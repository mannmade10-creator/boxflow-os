import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
}

function getTodayET(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())
}

function getParkFactor(team: string): number {
  const factors: Record<string, number> = {
    COL:118,BOS:108,CIN:107,PHI:106,NYY:105,TEX:103,ATL:103,HOU:103,MIL:102,CHC:102,
    MIN:101,DET:100,WSH:100,STL:98,CWS:97,LAA:97,TOR:97,SEA:96,BAL:96,NYM:96,
    PIT:95,KC:95,CLE:95,OAK:94,ATH:94,MIA:93,TB:93,AZ:92,SD:91,SF:90,LAD:99,
  }
  return factors[team] ?? 100
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers })
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    const url = new URL(req.url)
    const date = url.searchParams.get('date') ?? getTodayET()
    const gradeFilter = url.searchParams.get('grade')
    console.log('dipicksapi called for date:', date)
    const { data: games, error: gErr } = await supabase.from('di_games').select('*').eq('game_date', date)
    if (gErr) throw gErr
    if (!games || games.length === 0) {
      return new Response(JSON.stringify({ ok: true, data: [], date, fetched_at: new Date().toISOString() }), { headers })
    }
    const gameIds = games.map((g: any) => g.id)
    let query = supabase.from('di_picks').select(`*, batter:di_players!batter_id(id, full_name, team, position, bat_hand, headshot_url), game:di_games!game_id(id, game_date, home_team, away_team, game_time_et, status)`).in('game_id', gameIds).order('total_score', { ascending: false })
    if (gradeFilter) query = query.eq('grade', gradeFilter.toUpperCase())
    const { data: picks, error: pErr } = await query
    if (pErr) throw pErr
    const gameMap: Record<string, any> = {}
    for (const game of games) {
      gameMap[game.id] = { game: { ...game, park_factor: getParkFactor(game.home_team) }, picks: [], weather: null }
    }
    const { data: weatherRows } = await supabase.from('di_weather').select('*').in('game_id', gameIds.map(String))
    const weatherMap: Record<string, any> = {}
    if (weatherRows) { for (const w of weatherRows) { weatherMap[w.game_id] = w } }
    for (const gameId of Object.keys(gameMap)) { gameMap[gameId].weather = weatherMap[gameId] ?? null }
    for (const pick of (picks ?? [])) {
      const gameId = pick.game_id
      if (gameMap[gameId]) {
        gameMap[gameId].picks.push({ ...pick, batter_name: pick.batter?.full_name ?? 'Unknown', batter_team: pick.batter?.team ?? '', pitcher_name: 'TBD', pitcher_hand: 'R' })
      }
    }
    const result = Object.values(gameMap).filter((g: any) => g.picks.length > 0)
    return new Response(JSON.stringify({ ok: true, data: result, date, fetched_at: new Date().toISOString() }), { headers })
  } catch (err: any) {
    console.error('dipicksapi error:', err)
    return new Response(JSON.stringify({ ok: false, error: err.message ?? 'Unknown error', data: [] }), { status: 500, headers })
  }
})