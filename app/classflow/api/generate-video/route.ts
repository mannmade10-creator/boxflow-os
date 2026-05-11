// app/api/generate-video/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { createAvatarVideo, getVideoStatus } from '@/lib/heygen'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { lesson_id } = body

    // ── Fetch lesson + instructor ─────────────────────
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select('*, instructor:ai_instructors(*)')
      .eq('id', lesson_id)
      .eq('teacher_id', user.id)
      .single()

    if (lessonError || !lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }
    if (!lesson.script) {
      return NextResponse.json({ error: 'Lesson script not generated yet' }, { status: 400 })
    }

    // ── Mark as generating ────────────────────────────
    await supabase
      .from('lessons')
      .update({ status: 'generating' })
      .eq('id', lesson_id)

    // ── Submit to HeyGen ──────────────────────────────
    const { video_id } = await createAvatarVideo({
      lesson_id,
      script: lesson.script,
      heygen_avatar_id: lesson.instructor.heygen_avatar_id,
      elevenlabs_voice_id: lesson.instructor.elevenlabs_voice_id,
      language: lesson.language,
    })

    // ── Store HeyGen job id for polling ───────────────
    await supabase
      .from('lessons')
      .update({ heygen_video_id: video_id })
      .eq('id', lesson_id)

    return NextResponse.json({ video_id, status: 'processing' })
  } catch (err: any) {
    console.error('[generate-video]', err)
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// ── Poll video status ─────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const lessonId = req.nextUrl.searchParams.get('lesson_id')
    if (!lessonId) return NextResponse.json({ error: 'lesson_id required' }, { status: 400 })

    const { data: lesson } = await supabase
      .from('lessons')
      .select('heygen_video_id, status, video_url')
      .eq('id', lessonId)
      .single()

    if (!lesson?.heygen_video_id) {
      return NextResponse.json({ status: lesson?.status ?? 'draft' })
    }

    const videoStatus = await getVideoStatus(lesson.heygen_video_id)

    // ── If completed, save video URL & mark published ──
    if (videoStatus.status === 'completed' && videoStatus.video_url) {
      await supabase
        .from('lessons')
        .update({
          status: 'published',
          video_url: videoStatus.video_url,
        })
        .eq('id', lessonId)
    }

    if (videoStatus.status === 'failed') {
      await supabase
        .from('lessons')
        .update({ status: 'failed' })
        .eq('id', lessonId)
    }

    return NextResponse.json(videoStatus)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
