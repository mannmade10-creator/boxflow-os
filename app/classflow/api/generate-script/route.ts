// app/api/generate-script/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { extractTextFromFile, prepareContentForAI } from '@/lib/extract-content'
import { generateLessonScript } from '@/lib/openai'

export const maxDuration = 60 // Vercel function timeout (seconds)

export async function POST(req: NextRequest) {
  try {
    // ── Auth check ────────────────────────────────────
    const supabase = createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ── Parse multipart form ──────────────────────────
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const textContent = formData.get('text_content') as string | null
    const language = (formData.get('language') as string) || 'en'
    const instructorStyle = (formData.get('instructor_style') as string) || 'professional'
    const instructorId = formData.get('instructor_id') as string

    let rawContent = ''

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer())
      rawContent = await extractTextFromFile(buffer, file.type)
    } else if (textContent) {
      rawContent = textContent
    } else {
      return NextResponse.json({ error: 'No content provided' }, { status: 400 })
    }

    const content = prepareContentForAI(rawContent)

    // ── Generate script + quiz via OpenAI ─────────────
    const generated = await generateLessonScript({
      content,
      language,
      instructor_style: instructorStyle as any,
    })

    // ── Save lesson draft to Supabase ─────────────────
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .insert({
        teacher_id: user.id,
        title: generated.title,
        description: generated.description,
        status: 'draft',
        language,
        instructor_id: instructorId,
        source_content: content,
        script: generated.script,
      })
      .select()
      .single()

    if (lessonError) throw lessonError

    // ── Save quiz ──────────────────────────────────────
    await supabase.from('quizzes').insert({
      lesson_id: lesson.id,
      questions: generated.quiz,
    })

    // ── Save summary ───────────────────────────────────
    await supabase.from('lesson_summaries').insert({
      lesson_id: lesson.id,
      summary_text: generated.summary,
      key_terms: generated.key_terms,
      practice_questions: generated.practice_questions,
    })

    return NextResponse.json({ lesson_id: lesson.id, ...generated })
  } catch (err: any) {
    console.error('[generate-script]', err)
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
