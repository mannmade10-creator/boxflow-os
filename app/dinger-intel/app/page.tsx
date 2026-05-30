'use client'
import { useState, useEffect, useCallback } from 'react'

const API = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/dipicksapi`

const PARK_FACTORS: Record<string, number> = {
  COL:118,BOS:108,CIN:107,PHI:106,NYY:105,TEX:103,ATL:103,HOU:103,MIL:102,CHC:102,
  MIN:101,DET:100,WSH:100,STL:98,CWS:97,LAA:97,TOR:97,SEA:96,BAL:96,NYM:96,
  PIT:95,KC:95,CLE:95,OAK:94,ATH:94,MIA:93,TB:93,AZ:92,SD:91,SF:90,LAD:99,
}

function barColor(v: number) {
  if (v >= 85) return '#22c55e'
  if (v >= 70) return '#3b82f6'
  if (v >= 55) return '#f59e0b'
  return '#ef4444'
}
function gradeColor(g: string) {
  return ({ S:'#22c55e', A:'#3b82f6', B:'#f59e0b', C:'#ef4444' } as any)[g] || '#64748b'
}
function gradeBg(g: string) {
  return ({ S:'rgba(34,197,94,0.12)', A:'rgba(59,130,246,0.12)', B:'rgba(245,158,11,0.12)', C:'rgba(239,68,68,0.12)' } as any)[g] || 'rgba(100,116,139,0.12)'
}
function fmtOdds(n: number | null | undefined) {
  if (!n) return 'N/A'
  return n > 0 ? `+${n}` : `${n}`
}
function americanToDecimal(o: number) {
  return o > 0 ? o/100+1 : 100/Math.abs(o)+1
}
function decimalToAmerican(d: number) {
  return d >= 2 ? `+${Math.round((d-1)*100)}` : `-${Math.round(100/(d-1))}`
}
function fmtTime(t: string | null | undefined) {
  if (!t) return ''
  const [h, m] = t.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return `${h12}:${String(m).padStart(2,'0')} ${ampm} ET`
}

function Skeleton({ h = 16 }: { h?: number }) {
  return <div style={{ height: h, borderRadius: 8, background: 'rgba(255,255,255,0.06)', animation: 'pulse 1.4s ease-in-out infinite' }} />
}

function PickCard({ pick, onToggleParlay, inParlay }: any) {
  const [expanded, setExpanded] = useState(false)
  const dims = [
    { label: 'Hot Streak', val: pick.score_hot_streak },
    { label: 'Matchup',    val: pick.score_matchup },
    { label: 'Park Factor',val: pick.score_park },
    { label: 'Weather',    val: pick.score_weather },
    { label: 'Pitch Edge', val: pick.score_pitch_edge },
    { label: 'Weak Spot',  val: pick.score_weak_spot },
  ]
  const logs    = pick.detail_json?.game_logs ?? []
  const arsenal = pick.detail_json?.arsenal ?? []
  const h2h     = pick.detail_json?.h2h

  return (
    <div style={{ background: 'rgba(15,20,35,0.9)', border: `0.5px solid ${expanded ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 14, overflow: 'hidden', marginBottom: 8, transition: 'border-color 0.2s' }}>
      <div onClick={() => setExpanded(e => !e)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px 10px', cursor: 'pointer' }}>
        <div style={{ width: 36, height: 36, borderRadius: 9, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 900, background: gradeBg(pick.grade), color: gradeColor(pick.grade) }}>
          {pick.grade}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#f0f6ff' }}>{pick.batter_name ?? pick.batter?.full_name ?? pick.batter_id}</div>
          <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>
            {pick.batter_team ?? pick.batter?.team} · {pick.batter_position ?? pick.batter?.position} · vs {pick.pitcher_name} ({pick.pitcher_hand === 'L' ? 'LHP' : 'RHP'})
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#f0f6ff' }}>{pick.total_score}</div>
          <div style={{ fontSize: 11, color: '#22c55e', background: 'rgba(34,197,94,0.1)', border: '0.5px solid rgba(34,197,94,0.25)', borderRadius: 5, padding: '1px 8px', fontWeight: 600 }}>
            {fmtOdds(pick.best_hr_odds)} HR
          </div>
          <button onClick={e => { e.stopPropagation(); onToggleParlay(pick) }}
            style={{ fontSize: 11, padding: '3px 10px', borderRadius: 5, cursor: 'pointer', border: inParlay ? '0.5px solid rgba(34,197,94,0.5)' : '0.5px solid rgba(255,255,255,0.15)', background: inParlay ? 'rgba(34,197,94,0.15)' : 'transparent', color: inParlay ? '#22c55e' : '#64748b', fontFamily: 'system-ui', transition: 'all 0.15s' }}>
            {inParlay ? '+ Added' : '+ Parlay'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, padding: '0 16px 12px' }}>
        {dims.map(d => (
          <div key={d.label}>
            <div style={{ fontSize: 9, color: '#334155', marginBottom: 4, letterSpacing: 0.5 }}>{d.label}</div>
            <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${d.val}%`, background: barColor(d.val), borderRadius: 2 }} />
            </div>
          </div>
        ))}
      </div>

      {expanded && (
        <div style={{ borderTop: '0.5px solid rgba(255,255,255,0.06)', padding: 16 }}>
          {pick.insight && (
            <div style={{ borderLeft: '3px solid #ef4444', borderRadius: '0 8px 8px 0', background: 'rgba(239,68,68,0.06)', padding: '10px 14px', fontSize: 13, color: '#f0f6ff', lineHeight: 1.6, marginBottom: 16 }}>
              {pick.insight}
            </div>
          )}

          {arsenal.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>Pitcher Arsenal</div>
              {arsenal.map((p: any, i: number) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '110px 50px 40px 40px auto', gap: 8, fontSize: 12, padding: '6px 0', borderBottom: '0.5px solid rgba(255,255,255,0.05)', alignItems: 'center' }}>
                  <span style={{ color: '#f0f6ff' }}>{p.pitch_name ?? p.pitch_type}</span>
                  <span style={{ color: '#64748b' }}>{p.velocity_avg ? `${p.velocity_avg.toFixed(1)}` : '—'}</span>
                  <span style={{ color: '#64748b' }}>{p.usage_pct ? `${p.usage_pct.toFixed(0)}%` : '—'}</span>
                  <span style={{ color: '#f0f6ff' }}>{p.xba_against ? p.xba_against.toFixed(3) : '—'}</span>
                  <span style={{ fontSize: 10, color: '#64748b' }}>{p.whiff_rate ? `${p.whiff_rate.toFixed(0)}% whiff` : '—'}</span>
                </div>
              ))}
            </div>
          )}

          {h2h && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 10 }}>Career H2H vs {pick.pitcher_name}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
                {[['PA', h2h.pa], ['AVG', h2h.avg ? Number(h2h.avg).toFixed(3) : '—'], ['HR', h2h.hr], ['OPS', h2h.ops ? Number(h2h.ops).toFixed(3) : '—']].map(([l, v]) => (
                  <div key={l as string} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '10px 8px' }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#f0f6ff' }}>{v ?? '—'}</div>
                    <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {logs.length > 0 && (
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>Last {logs.length} Games</div>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {logs.map((g: any, i: number) => {
                  const isHR  = (g.hr ?? g.home_runs ?? 0) > 0
                  const isHit = (g.hits ?? 0) > 0
                  return (
                    <div key={i} style={{ width: 32, height: 32, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, background: isHR ? 'rgba(34,197,94,0.15)' : isHit ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.04)', color: isHR ? '#22c55e' : isHit ? '#3b82f6' : '#334155' }}>
                      {isHR ? 'HR' : isHit ? `${g.hits}H` : '0'}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function DingerIntelApp() {
  const [data, setData]                   = useState<any[]>([])
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState<string | null>(null)
  const [activeGameIdx, setActiveGameIdx] = useState(0)
  const [activeTab, setActiveTab]         = useState('picks')
  const [parlay, setParlay]               = useState<any[]>([])
  const [countdown, setCountdown]         = useState(60)
  // FIX: today must be client-only state to avoid React hydration mismatch (#418)
  const [today, setToday]                 = useState('')

  // FIX: set today only on client after mount
  useEffect(() => {
    setToday(new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }))
  }, [])

  const fetchData = useCallback(async () => {
    try {
      // FIX: use ET timezone so date matches MLB schedule dates, not UTC
      const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(new Date())
      const res  = await fetch(`${API}?date=${date}`)
      const json = await res.json()
      if (!json.ok) throw new Error(json.error || 'API error')
      setData(json.data ?? [])
      setError(null)
      setCountdown(60)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  useEffect(() => {
    const id = setInterval(() => {
      setCountdown(c => { if (c <= 1) { fetchData(); return 60 } return c - 1 })
    }, 1000)
    return () => clearInterval(id)
  }, [fetchData])

  const toggleParlay = (pick: any) => {
    setParlay(prev => {
      const exists = prev.find(l => l.id === pick.id)
      if (exists) return prev.filter(l => l.id !== pick.id)
      return [...prev, { ...pick, legType: 'HR' }]
    })
  }

  const activeGame = data[activeGameIdx]
  const picks      = activeGame?.picks ?? []
  const weather    = activeGame?.weather
  const game       = activeGame?.game

  const parlayDecimal = parlay.reduce((acc, l) => {
    if (!l.best_hr_odds) return acc
    return acc * americanToDecimal(l.best_hr_odds)
  }, 1)

  return (
    <div style={{ minHeight: '100vh', background: '#0a0e1a', color: '#f0f6ff', fontFamily: 'system-ui,sans-serif' }}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>

      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '0.5px solid rgba(255,255,255,0.07)', background: 'rgba(10,14,26,0.95)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ fontSize: 22 }}>⚾</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 900, color: '#fff', letterSpacing: -0.3 }}>Dinger Intel</div>
            <div style={{ fontSize: 8, color: '#ef4444', letterSpacing: 2, textTransform: 'uppercase' }}>by Made Technologies</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* today is empty string on server, fills in on client — no hydration mismatch */}
          <div style={{ fontSize: 12, color: '#475569', background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: 7, padding: '4px 10px' }}>{today}</div>
          <div onClick={fetchData} style={{ fontSize: 12, color: '#22c55e', background: 'rgba(34,197,94,0.08)', border: '0.5px solid rgba(34,197,94,0.25)', borderRadius: 7, padding: '4px 10px', cursor: 'pointer' }}>
            LIVE · {countdown}s
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', borderBottom: '0.5px solid rgba(255,255,255,0.07)', padding: '0 20px', background: 'rgba(10,14,26,0.8)' }}>
        {['picks', 'parlay', 'glossary'].map(t => (
          <div key={t} onClick={() => setActiveTab(t)} style={{ padding: '10px 16px', fontSize: 13, cursor: 'pointer', color: activeTab === t ? '#f0f6ff' : '#475569', borderBottom: activeTab === t ? '2px solid #ef4444' : '2px solid transparent', marginBottom: -1, fontWeight: activeTab === t ? 700 : 400, textTransform: 'capitalize', transition: 'color 0.15s' }}>
            {t}
            {t === 'parlay' && parlay.length > 0 && (
              <span style={{ background: '#ef4444', color: '#fff', borderRadius: 10, padding: '1px 6px', fontSize: 10, marginLeft: 6, fontWeight: 700 }}>{parlay.length}</span>
            )}
          </div>
        ))}
      </div>

      {/* PICKS TAB */}
      {activeTab === 'picks' && (
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '16px 16px' }}>
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '0.5px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#ef4444', marginBottom: 14 }}>
              {error} — <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={fetchData}>retry</span>
            </div>
          )}

          {loading ? (
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              {[1,2,3].map(i => <Skeleton key={i} h={36} />)}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 14 }}>
              {data.map((d, i) => (
                <div key={d.game?.id ?? i} onClick={() => setActiveGameIdx(i)}
                  style={{ flexShrink: 0, padding: '7px 14px', borderRadius: 9, cursor: 'pointer', whiteSpace: 'nowrap', background: i === activeGameIdx ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.04)', border: `0.5px solid ${i === activeGameIdx ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.08)'}`, fontSize: 12, color: i === activeGameIdx ? '#ef4444' : '#64748b', fontWeight: i === activeGameIdx ? 700 : 400, transition: 'all 0.15s' }}>
                  {d.game?.away_team} @ {d.game?.home_team}
                  <span style={{ color: '#334155', marginLeft: 6 }}>{fmtTime(d.game?.game_time_et)}</span>
                </div>
              ))}
            </div>
          )}

          {game && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', marginBottom: 14, background: 'rgba(255,255,255,0.03)', borderRadius: 10, fontSize: 12, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 18 }}>{(weather?.precip_pct ?? 0) > 50 ? '🌧' : (weather?.wind_mph ?? 0) > 10 ? '💨' : '☀️'}</span>
              <span style={{ color: '#64748b' }}>
                <strong style={{ color: '#f0f6ff' }}>{game.venue_name}</strong>
                {weather ? ` · ${weather.wind_mph}mph ${weather.wind_dir} · ${weather.temp_f}°F` : ' · Loading weather...'}
              </span>
              <span style={{ marginLeft: 'auto', fontSize: 11 }}>
                Park: <span style={{ fontWeight: 700, color: (game.park_factor ?? 100) >= 105 ? '#22c55e' : (game.park_factor ?? 100) <= 93 ? '#ef4444' : '#f59e0b' }}>{game.park_factor ?? 100}</span>
                {weather?.weather_boost_pts != null && (
                  <span style={{ marginLeft: 8, color: weather.weather_boost_pts > 0 ? '#22c55e' : '#ef4444' }}>
                    Weather {weather.weather_boost_pts > 0 ? `+${weather.weather_boost_pts}` : weather.weather_boost_pts}pts
                  </span>
                )}
              </span>
            </div>
          )}

          {loading ? (
            [1,2,3].map(i => <div key={i} style={{ marginBottom: 8 }}><Skeleton h={88} /></div>)
          ) : picks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 48, color: '#334155', fontSize: 13 }}>
              {data.length === 0 ? 'No games found for today. Check back after 6 AM ET.' : 'Picks are being generated — check back in a moment.'}
            </div>
          ) : (
            picks.map((p: any) => (
              <PickCard key={p.id} pick={p} onToggleParlay={toggleParlay} inParlay={parlay.some(l => l.id === p.id)} />
            ))
          )}
        </div>
      )}

      {/* PARLAY TAB */}
      {activeTab === 'parlay' && (
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '16px' }}>
          <div style={{ background: 'rgba(15,20,35,0.9)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>My Parlay</div>
            {parlay.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 32, color: '#334155', fontSize: 13 }}>
                Add picks from the Picks tab to build your parlay.
              </div>
            ) : (
              <>
                {parlay.map((l, i) => (
                  <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: '0.5px solid rgba(255,255,255,0.06)', fontSize: 13 }}>
                    <div style={{ flex: 1, fontWeight: 600, color: '#f0f6ff' }}>{l.batter_name ?? l.batter?.full_name}</div>
                    <select value={l.legType} onChange={e => setParlay(prev => prev.map((x, j) => j === i ? { ...x, legType: e.target.value } : x))}
                      style={{ fontSize: 11, border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 5, padding: '3px 6px', background: 'rgba(255,255,255,0.06)', color: '#94a3b8', fontFamily: 'system-ui' }}>
                      <option value="HR">HR</option>
                      <option value="1+H">1+ Hit</option>
                      <option value="2+H">2+ Hits</option>
                    </select>
                    <div style={{ color: '#475569', fontSize: 12 }}>{fmtOdds(l.best_hr_odds)}</div>
                    <div onClick={() => setParlay(prev => prev.filter((_,j) => j !== i))} style={{ cursor: 'pointer', color: '#475569', padding: '0 6px', fontSize: 16 }}>×</div>
                  </div>
                ))}
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: '0.5px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 13, color: '#f0f6ff' }}>
                      {parlay.length}-leg: <strong style={{ fontSize: 20 }}>{decimalToAmerican(parlayDecimal)}</strong>
                    </div>
                    <div style={{ fontSize: 11, color: '#475569', marginTop: 3 }}>$10 → ${(10 * parlayDecimal).toFixed(2)}</div>
                  </div>
                  <button onClick={() => setParlay([])} style={{ fontSize: 12, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'system-ui' }}>Clear all</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* GLOSSARY TAB */}
      {activeTab === 'glossary' && (
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '20px 16px', fontSize: 13, color: '#64748b', lineHeight: 1.8 }}>
          <p style={{ marginBottom: 16, color: '#f0f6ff', fontWeight: 700, fontSize: 15 }}>How Dinger Intel Scores HR Props</p>
          {[
            ['Hot Streak (L10)', 'HR and hit rate in the last 10 games, weighted toward the most recent. A player with 4 HR in 10 scores ~90.'],
            ['Matchup Score', "Batter's ISO vs the pitcher's handedness. Higher ISO against the pitcher's throw hand = higher score."],
            ['Park Factor', "Each park's HR park factor vs league average (100). Coors Field = 118, Petco Park = 91. Normalized to 0-100."],
            ['Weather Boost', 'Out-to-CF wind above 10mph adds points. Heat above 85°F adds points. Rain or wind in subtracts points.'],
            ['Pitch Type Edge', "Batter's ISO broken down by each pitch type the pitcher throws. More exploitable pitches = higher score."],
            ['Pitcher Weak Spot', "The pitcher's highest xBA-against pitch, cross-referenced with how well this batter hits that specific pitch."],
            ['Grade', 'S = elite edge (88+), A = strong (76-87), B = solid value (64-75), C = speculative (below 64).'],
          ].map(([t, d]) => (
            <p key={t as string} style={{ marginBottom: 10 }}>
              <strong style={{ color: '#f0f6ff' }}>{t}</strong> — {d}
            </p>
          ))}
          <p style={{ marginTop: 24, fontSize: 11, color: '#334155' }}>
            Data: MLB Stats API · Open-Meteo weather · Supabase backend<br />
            Picks refresh every 60 seconds · For entertainment purposes only
          </p>
        </div>
      )}
    </div>
  )
}