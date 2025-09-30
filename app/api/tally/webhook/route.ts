import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // service role (solo server)
)

// Opcional: restringe qué formularios acepta el webhook (coma-separada)
const ALLOWED_FORMS = (process.env.TALLY_ALLOWED_FORMS || 'mV9BKy,3qYMX9,3qY7j7')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean)

function verifySignature(req: NextRequest, raw: string) {
  const secret = process.env.TALLY_WEBHOOK_SECRET!
  const header = req.headers.get('tally-signature') || ''
  const expected = crypto.createHmac('sha256', secret).update(raw, 'utf8').digest('hex')
  try {
    return crypto.timingSafeEqual(Buffer.from(header), Buffer.from(expected))
  } catch {
    return false
  }
}

function getTenant(hidden: any) {
  const t = (hidden?.tenant ?? '').toString().trim()
  return t || 'piloto'
}

function pluckAnswer(val: any) {
  if (val == null) return null
  if (typeof val === 'object' && 'value' in val) return (val as any).value
  return val
}

export async function POST(req: NextRequest) {
  try {
    const raw = await req.text()

    // 1) Firma
    if (!verifySignature(req, raw)) {
      return NextResponse.json({ error: 'invalid signature' }, { status: 401 })
    }

    // 2) Payload (Tally a veces envuelve en { event: { data } })
    const body = JSON.parse(raw)
    const d = body?.event?.data ?? body

    const submissionId: string = d.id
    const formId: string = d.formId
    const createdAt: string = d.createdAt ?? new Date().toISOString()
    const respondentId: string | null = d.respondentId ?? null
    const hidden = d.hiddenFields ?? {}
    const userId: string | null = hidden.userId ?? null
    const tenant = getTenant(hidden)

    // 2.1) Allowlist opcional de formularios
    if (ALLOWED_FORMS.length && !ALLOWED_FORMS.includes(formId)) {
      // Ignoramos silenciosamente formularios no esperados
      return NextResponse.json({ ok: true, ignored: true })
    }

    // 3) Normalizar respuestas (pregunta -> valor)
    const answers: Record<string, any> = {}
    for (const f of d.fields ?? []) {
      const key = f.title || f.id
      answers[key] = pluckAnswer(f.answer)
    }

    // 4) Guardar envío completo (idempotente por tally_submission_id)
    const { error: e1 } = await supabase
      .from('questionnaire_submissions')
      .upsert(
        {
          tally_submission_id: submissionId,
          form_id: formId,
          user_id: userId ?? undefined,
          tenant,
          respondent_id: respondentId ?? undefined,
          created_at: createdAt,
          payload: d,
          answers,
        },
        { onConflict: 'tally_submission_id' }
      )
    if (e1) {
      // No frenamos la respuesta a Tally, pero lo registramos
      console.error('[webhook] upsert submissions error', e1)
    }

    // 5) Marcar respondido (única por tenant + form + user)
    if (userId) {
      const { error: e2 } = await supabase
        .from('questionnaire_responses')
        .upsert(
          {
            tenant,
            questionnaire_id: formId,
            user_id: userId,
            answered: true,
            submitted_at: createdAt,
            tally_submission_id: submissionId,
          },
          { onConflict: 'tenant,questionnaire_id,user_id' }
        )
      if (e2) console.error('[webhook] upsert responses error', e2)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[webhook] unhandled error', err)
    // Devuelve 200 para evitar reintentos infinitos si el error es nuestro
    return NextResponse.json({ ok: false, error: 'unhandled' })
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, route: 'tally-webhook' })
}