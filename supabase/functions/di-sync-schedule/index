import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const MLB_BASE = "https://statsapi.mlb.com/api/v1";
const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

function mapStatus(abstractState?: string, detailedState?: string): string {
  if (!abstractState) return 'scheduled';
  if (abstractState === 'Final') return 'final';
  if (abstractState === 'Live') return 'in_progress';
  if (abstractState === 'Preview') {
    const d = (detailedState ?? '').trim();
    if (d === 'Postponed') return 'postponed';
    if (d === 'Cancelled') return 'cancelled';
    return 'scheduled';
  }
  return 'scheduled';
}

function getTodayET(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(new Date());
}

async function fetchSchedule(days = 7): Promise<any[]> {
  const today = getTodayET();
  const end = new Date(today);
  end.setDate(end.getDate() + days - 1);
  const endStr = end.toISOString().slice(0, 10);
  const url = `${MLB_BASE}/schedule?sportId=1&startDate=${today}&endDate=${endStr}&gameType=R&hydrate=probablePitcher,venue,team`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`MLB schedule fetch failed: ${res.status}`);
  const data = await res.json();
  return data.dates ?? [];
}

async function upsertPlayer(p: any) {
  if (!p?.id) return;
  await supabase.from("di_players").upsert({
    id: String(p.id), full_name: p.fullName ?? "Unknown",
    position: p.primaryPosition?.abbreviation ?? null,
    updated_at: new Date().toISOString(),
  }, { onConflict: "id", ignoreDuplicates: false });
}

async function syncGames(dates: any[]) {
  let synced = 0;
  for (const date of dates) {
    for (const game of (date.games ?? [])) {
      if (game.gamePk == null) continue;
      const awayP = game.teams?.away?.probablePitcher;
      const homeP = game.teams?.home?.probablePitcher;
      if (awayP) await upsertPlayer(awayP);
      if (homeP) await upsertPlayer(homeP);
      const gameTime = game.gameDate ? new Date(game.gameDate) : null;
      const gameTimeET = gameTime
        ? gameTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "America/New_York" })
        : null;
      await supabase.from("di_games").upsert({
        id: String(game.gamePk),
        game_date: date.date,
        game_time_et: gameTimeET,
        status: mapStatus(game.status?.abstractGameState, game.status?.detailedState),
        away_team: game.teams?.away?.team?.abbreviation ?? "UNK",
        home_team: game.teams?.home?.team?.abbreviation ?? "UNK",
        away_pitcher_id: awayP ? String(awayP.id) : null,
        home_pitcher_id: homeP ? String(homeP.id) : null,
        venue_name: game.venue?.name ?? null,
        raw_mlb: game,
        updated_at: new Date().toISOString(),
      }, { onConflict: "id", ignoreDuplicates: false });
      synced++;
    }
  }
  return synced;
}

Deno.serve(async (_req: Request) => {
  try {
    const dates = await fetchSchedule(7);
    const synced = await syncGames(dates);
    return new Response(JSON.stringify({ ok: true, games_synced: synced, date_start: getTodayET(), ts: new Date().toISOString() }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), {
      status: 500, headers: { "Content-Type": "application/json" },
    });
  }
});