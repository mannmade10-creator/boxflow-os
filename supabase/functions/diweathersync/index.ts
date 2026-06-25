import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const OPEN_METEO = "https://api.open-meteo.com/v1/forecast";

const PARK_COORDS: Record<string,[number,number]> = {
  NYY:[40.829,-73.926],BOS:[42.347,-71.097],TB:[27.768,-82.653],TOR:[43.641,-79.389],
  BAL:[39.284,-76.622],CLE:[41.496,-81.685],DET:[42.339,-83.049],CWS:[41.830,-87.634],
  KC:[39.051,-94.480],MIN:[44.982,-93.278],HOU:[29.757,-95.355],LAA:[33.800,-117.883],
  OAK:[37.752,-122.201],ATH:[37.752,-122.201],SEA:[47.591,-122.333],TEX:[32.751,-97.083],
  ATL:[33.735,-84.390],MIA:[25.778,-80.220],NYM:[40.757,-73.846],PHI:[39.906,-75.167],
  WSH:[38.873,-77.008],CHC:[41.948,-87.655],CIN:[39.097,-84.507],MIL:[43.028,-87.971],
  PIT:[40.447,-80.006],STL:[38.623,-90.193],AZ:[33.446,-112.067],COL:[39.756,-104.994],
  LAD:[34.074,-118.240],SD:[32.708,-117.157],SF:[37.778,-122.389],
};

function windDir(deg: number, homeTeam: string): string {
  const cfDeg: Record<string,number> = {COL:310,BOS:290,NYY:300,HOU:320,TEX:315,ATL:300,NYM:300,MIL:305,STL:310};
  const cf = cfDeg[homeTeam] ?? 300;
  const diff = Math.min(Math.abs(deg-cf), 360-Math.abs(deg-cf));
  if (diff < 60) return "out to CF";
  if (diff > 120) return "in from CF";
  return "crosswind";
}

function boostPts(windMph: number, dir: string, tempF: number, precipPct: number): number {
  let pts = 0;
  if (dir === "out to CF") pts += Math.min(Math.round(windMph * 1.5), 20);
  else if (dir === "in from CF") pts -= Math.min(Math.round(windMph * 1.5), 15);
  if (tempF >= 85) pts += 8;
  else if (tempF <= 50) pts -= 8;
  if (precipPct > 50) pts -= 10;
  return pts;
}

function getTodayET(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(new Date());
}

Deno.serve(async (_req: Request) => {
  try {
    const today = getTodayET();
    const { data: games } = await supabase.from("di_games").select("id,home_team").eq("game_date",today);
    if (!games?.length) return new Response(JSON.stringify({ok:true,updated:0}),{headers:{"Content-Type":"application/json"}});
    let updated = 0;
    for (const game of games) {
      const coords = PARK_COORDS[game.home_team];
      if (!coords) continue;
      const [lat,lon] = coords;
      const url = `${OPEN_METEO}?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,wind_speed_10m,wind_direction_10m,precipitation_probability&temperature_unit=fahrenheit&wind_speed_unit=mph&forecast_days=1`;
      const res = await fetch(url);
      if (!res.ok) continue;
      const md = await res.json();
      const hr = 19;
      const tempF = Math.round(md.hourly?.temperature_2m?.[hr] ?? 72);
      const windMph = Math.round(md.hourly?.wind_speed_10m?.[hr] ?? 0);
      const windDeg = md.hourly?.wind_direction_10m?.[hr] ?? 180;
      const precipPct = md.hourly?.precipitation_probability?.[hr] ?? 0;
      const dir = windDir(windDeg, game.home_team);
      const boost = boostPts(windMph, dir, tempF, precipPct);
      const condition = precipPct > 50 ? "Rain likely" : precipPct > 20 ? "Partly cloudy" : "Clear";
      await supabase.from("di_weather").upsert({
        game_id: game.id, temp_f: tempF, wind_mph: windMph, wind_dir: dir,
        precip_pct: precipPct, condition, weather_boost_pts: boost,
        fetched_at: new Date().toISOString(),
      }, { onConflict: "game_id" });
      updated++;
    }
    return new Response(JSON.stringify({ok:true,updated}),{headers:{"Content-Type":"application/json"}});
  } catch(err:any) {
    return new Response(JSON.stringify({ok:false,error:err.message}),{status:500,headers:{"Content-Type":"application/json"}});
  }
});