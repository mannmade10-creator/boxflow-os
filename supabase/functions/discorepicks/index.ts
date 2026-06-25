import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const MLB = "https://statsapi.mlb.com/api/v1";

const PARK_FACTORS: Record<string,number> = {
  COL:118,BOS:108,CIN:107,PHI:106,NYY:105,TEX:103,ATL:103,HOU:103,MIL:102,CHC:102,
  MIN:101,DET:100,WSH:100,STL:98,CWS:97,LAA:97,TOR:97,SEA:96,BAL:96,NYM:96,
  PIT:95,KC:95,CLE:95,OAK:94,ATH:94,MIA:93,TB:93,AZ:92,SD:91,SF:90,LAD:99,
};

function getTodayET(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(new Date());
}

function parkScore(ht:string){return Math.round(((PARK_FACTORS[ht]??100)-90)/28*100);}
function weatherScore(w:any){if(!w)return 50;let s=50+Math.round((w.weather_boost_pts??0)*1.2);return Math.max(0,Math.min(100,s));}
function hotStreakScore(logs:any[]){if(!logs.length)return 40;let s=0;logs.slice(0,10).forEach((g:any,i:number)=>{const w=1+(10-i)*0.1;s+=(g.hr??0)*14*w+(g.hits??0)*3*w;});return Math.max(0,Math.min(100,Math.round(s)));}
function matchupScore(bat:any,pit:any){if(!bat||!pit)return 50;const hand=pit.throw_hand??"R";const iso=hand==="L"?(bat.iso_vs_l??0.15):(bat.iso_vs_r??0.15);return Math.max(0,Math.min(100,Math.round((iso/0.30)*100)));}
function pitchEdgeScore(splits:any[]){return Math.min(100,40+splits.filter((p:any)=>(p.iso??0)>0.2).length*15);}
function weakSpotScore(arsenal:any[],splits:any[]){if(!arsenal.length)return 50;const worst=[...arsenal].sort((a:any,b:any)=>(b.xba_against??0)-(a.xba_against??0))[0];const bvw=splits.find((p:any)=>p.pitch_type===worst?.pitch_type);return bvw?Math.min(100,Math.round((bvw.slg??0.4)*120)):50;}
function calcGrade(s:number){return s>=88?"S":s>=76?"A":s>=64?"B":"C";}
function buildInsight(bn:string,pn:string,ht:string,sHot:number,sMatch:number,sPark:number,sWeath:number,arsenal:any[],splits:any[]):string{const p:string[]=[];if(sHot>=75)p.push(`${bn} is on a hot streak`);if(sMatch>=75)p.push(`strong ISO matchup vs ${pn}`);if(sPark>=80)p.push(`${ht} park factor ${PARK_FACTORS[ht]??100} boosts HR`);if(sWeath>=70)p.push("favorable wind/temp conditions today");const ws=[...splits].sort((a:any,b:any)=>(b.iso??0)-(a.iso??0))[0];const wp=[...arsenal].sort((a:any,b:any)=>(b.xba_against??0)-(a.xba_against??0))[0];if(ws&&wp&&ws.pitch_type===wp.pitch_type)p.push(`crushes ${wp.pitch_name??wp.pitch_type} — pitcher's weakest offering`);return p.length?p.join(" · "):`${bn} is a solid HR candidate today.`;}

async function getBatterLogs(id:string){const res=await fetch(`${MLB}/people/${id}/stats?stats=gameLog&season=2026&group=hitting&limit=10`);if(!res.ok)return[];const d=await res.json();return(d.stats?.[0]?.splits??[]).map((s:any)=>({game_date:s.date,hits:s.stat?.hits??0,hr:s.stat?.homeRuns??0,ab:s.stat?.atBats??0,rbi:s.stat?.rbi??0,bb:s.stat?.baseOnBalls??0,k:s.stat?.strikeOuts??0}));}

async function getRosterBatters(teamId: number, limit=4): Promise<string[]> {
  const res = await fetch(`${MLB}/teams/${teamId}/roster?rosterType=active&season=2026`);
  if (!res.ok) return [];
  const d = await res.json();
  const posPriority: Record<string,number> = {DH:1,LF:2,RF:3,CF:4,"1B":5,"3B":6,"2B":7,C:8,SS:9};
  return (d.roster??[]).filter((p:any)=>p.position?.type!=="Pitcher").sort((a:any,b:any)=>(posPriority[a.position?.abbreviation]??99)-(posPriority[b.position?.abbreviation]??99)).slice(0,limit).map((p:any)=>String(p.person?.id)).filter(Boolean);
}

async function getTeamId(abbr: string): Promise<number|null> {
  const res = await fetch(`${MLB}/teams?sportId=1&season=2026`);
  if (!res.ok) return null;
  const d = await res.json();
  const t = (d.teams??[]).find((t:any)=>t.abbreviation===abbr||t.abbreviation===abbr.replace('ATH','OAK'));
  return t?.id ?? null;
}

async function processGame(game:any):Promise<number>{
  let awayB: string[] = [];
  let homeB: string[] = [];
  if (game.status==="in_progress"||game.status==="final") {
    const boxRes=await fetch(`${MLB}/game/${game.id}/boxscore`);
    const box=boxRes.ok?await boxRes.json():null;
    awayB=(box?.teams?.away?.battingOrder??[]).slice(0,4).map(String);
    homeB=(box?.teams?.home?.battingOrder??[]).slice(0,4).map(String);
  }
  if (!awayB.length){const id=await getTeamId(game.away_team);if(id)awayB=await getRosterBatters(id,4);}
  if (!homeB.length){const id=await getTeamId(game.home_team);if(id)homeB=await getRosterBatters(id,4);}
  const all=[...awayB,...homeB];
  if(!all.length)return 0;
  const {data:wr}=await supabase.from("di_weather").select("*").eq("game_id",game.id).maybeSingle();
  const sPark=parkScore(game.home_team);
  const sWeath=weatherScore(wr);
  const getPit=async(pid:string|null)=>{if(!pid)return null;const{data}=await supabase.from("di_players").select("*").eq("id",pid).maybeSingle();return data;};
  const getArsenal=async(pid:string|null)=>{if(!pid)return[];const{data}=await supabase.from("di_pitcher_arsenals").select("*").eq("pitcher_id",pid);return data??[];};
  const awayP=await getPit(game.away_pitcher_id);
  const homeP=await getPit(game.home_pitcher_id);
  const awayA=await getArsenal(game.away_pitcher_id);
  const homeA=await getArsenal(game.home_pitcher_id);
  let count=0;
  for(const bid of all){
    try{
      const isAway=awayB.includes(bid);
      const fpid=isAway?game.home_pitcher_id:game.away_pitcher_id;
      const fp=isAway?homeP:awayP;
      const fa=isAway?homeA:awayA;
      const{data:bat}=await supabase.from("di_players").select("*").eq("id",bid).maybeSingle();
      if(!bat){
        const pRes=await fetch(`${MLB}/people/${bid}?hydrate=currentTeam`);
        if(pRes.ok){const pData=await pRes.json();const p=pData.people?.[0];if(p){await supabase.from("di_players").upsert({id:String(p.id),full_name:p.fullName??"Unknown",team:p.currentTeam?.abbreviation??null,position:p.primaryPosition?.abbreviation??null,bat_hand:p.batSide?.code??null,throw_hand:p.pitchHand?.code??null,updated_at:new Date().toISOString()},{onConflict:"id"});}}
      }
      const{data:batFresh}=await supabase.from("di_players").select("*").eq("id",bid).maybeSingle();
      const logs=await getBatterLogs(bid);
      for(const l of logs){await supabase.from("di_batter_game_log").upsert({batter_id:bid,game_date:l.game_date,hits:l.hits,hr:l.hr,ab:l.ab,rbi:l.rbi,bb:l.bb,k:l.k},{onConflict:"batter_id,game_date"});}
      const{data:splits}=await supabase.from("di_batter_pitch_splits").select("*").eq("batter_id",bid);
      const{data:h2h}=await supabase.from("di_batter_pitcher_h2h").select("*").eq("batter_id",bid).eq("pitcher_id",fpid??"").maybeSingle();
      const{data:oddsRow}=await supabase.from("di_odds").select("american_odds").eq("game_id",game.id).eq("player_id",bid).eq("market","hr").order("fetched_at",{ascending:false}).limit(1).maybeSingle();
      const sl=splits??[];
      const sHot=hotStreakScore(logs);
      const sMatch=matchupScore(batFresh,fp);
      const sPE=pitchEdgeScore(sl);
      const sWS=weakSpotScore(fa,sl);
      const total=Math.round(sHot*0.22+sMatch*0.20+sPark*0.15+sWeath*0.12+sPE*0.16+sWS*0.15);
      await supabase.from("di_picks").upsert({game_id:game.id,batter_id:bid,pitcher_id:fpid,generated_at:new Date().toISOString(),score_hot_streak:sHot,score_matchup:sMatch,score_park:sPark,score_weather:sWeath,score_pitch_edge:sPE,score_weak_spot:sWS,total_score:total,grade:calcGrade(total),best_hr_odds:oddsRow?.american_odds??null,insight:buildInsight(batFresh?.full_name??bid,fp?.full_name??"pitcher",game.home_team,sHot,sMatch,sPark,sWeath,fa,sl),detail_json:{game_logs:logs.slice(0,10),h2h,arsenal:fa,pitch_splits:sl}},{onConflict:"game_id,batter_id"});
      count++;
    }catch(e){console.error(`pick error for ${bid}:`,e);}
  }
  return count;
}

Deno.serve(async(req:Request)=>{
  try{
    const url=new URL(req.url);
    const sg=url.searchParams.get("game_id");
    const dateParam=url.searchParams.get("date");
    const today=dateParam??getTodayET();
    console.log('discorepicks running for date:',today);
    let q=supabase.from("di_games").select("*").eq("game_date",today);
    if(sg)q=q.eq("id",sg) as any;
    const{data:games,error}=await q;
    if(error)throw error;
    if(!games?.length)return new Response(JSON.stringify({ok:true,picks_generated:0,date:today}),{headers:{"Content-Type":"application/json"}});
    let total=0;
    for(const g of games)total+=await processGame(g);
    return new Response(JSON.stringify({ok:true,picks_generated:total,games:games.length,date:today}),{headers:{"Content-Type":"application/json"}});
  }catch(err:any){
    return new Response(JSON.stringify({ok:false,error:err.message}),{status:500,headers:{"Content-Type":"application/json"}});
  }
});