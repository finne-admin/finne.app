// app/api/tally/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // service role (solo server)
)

// Deja vacío mientras pruebas para no filtrar formularios
const ALLOWED_FORMS = (process.env.TALLY_ALLOWED_FORMS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean)

function verifySignature(req: NextRequest, raw: string) {
  const secret = process.env.TALLY_WEBHOOK_SECRET!
  const received = req.headers.get('tally-signature') || '' // Next normaliza a minúsculas
  // Firma esperada en base64
  const hmac = crypto.createHmac('sha256', secret).update(raw, 'utf8').digest('base64')

  if (received.length === hmac.length) {
    try {
      return crypto.timingSafeEqual(Buffer.from(received), Buffer.from(hmac))
    } catch { /* ignore */ }
  }
  // Fallback por si algún proxy tocó espacios/orden de claves
  try {
    const reStr = JSON.stringify(JSON.parse(raw))
    const hmac2 = crypto.createHmac('sha256', secret).update(reStr, 'utf8').digest('base64')
    if (received.length === hmac2.length) {
      return crypto.timingSafeEqual(Buffer.from(received), Buffer.from(hmac2))
    }
  } catch { /* ignore */ }
  return false
}

const getTenant = (hidden: any) => (hidden?.tenant ?? 'piloto').toString().trim() || 'piloto'
const pluckAnswer = (v: any) => (v && typeof v === 'object' && 'value' in v ? (v as any).value : v ?? null)

/** 🔔 Webhook real (Tally hace POST aquí) */
export async function POST(req: NextRequest) {
  try {
    const raw = await req.text()

    // (solo DEV) permite bypass con header x-skip-signature: 1
    const bypass = process.env.NODE_ENV !== 'production' && req.headers.get('x-skip-signature') === '1'
    if (!bypass && !verifySignature(req, raw)) {
      return NextResponse.json({ error: 'invalid signature' }, { status: 401 })
    }

    const body = JSON.parse(raw)
    // Tally puede mandar {event:{data}}, {data} o el objeto directo
    const d = body?.event?.data ?? body?.data ?? body

    // IDs con fallback
    const submissionIdRaw: string | null =
      d?.id ?? d?.responseId ?? d?.submissionId ?? null
    const safeSubmissionId =
      submissionIdRaw ?? crypto.createHash('sha256').update(raw, 'utf8').digest('hex')

    const formId: string | null =
      d?.formId ?? d?.form_id ?? d?.form?.id ?? null
    if (!formId) {
      console.error('[webhook] missing formId; keys=', Object.keys(d || {}))
      return NextResponse.json({ ok: false, error: 'missing formId' }, { status: 400 })
    }

    const createdAt: string = d?.createdAt ?? new Date().toISOString()
    const respondentId: string | null = d?.respondentId ?? null

    const hidden = d?.hiddenFields ?? {}
    const userId: string | null = hidden?.userId ?? null
    const tenant = getTenant(hidden)

    // Allowlist opcional
    if (ALLOWED_FORMS.length && !ALLOWED_FORMS.includes(formId)) {
      return NextResponse.json({ ok: true, ignored: true })
    }

    // Pregunta -> valor
    const answers: Record<string, any> = {}
    for (const f of d?.fields ?? []) {
      const key = f.title || f.id || f.key
      answers[key] = pluckAnswer(f.answer)
    }

    // 1) Guardar envío completo (idempotente por tally_submission_id)
    const { error: e1 } = await supabase
      .from('questionnaire_submissions')
      .upsert(
        {
          tally_submission_id: safeSubmissionId,   // 👈 nunca NULL
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
    if (e1) console.error('[webhook] submissions upsert error', e1)

    // 2) Marcar respondido (si conocemos userId)
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
            tally_submission_id: safeSubmissionId,
          },
          { onConflict: 'tenant,questionnaire_id,user_id' }
        )
      if (e2) console.error('[webhook] responses upsert error', e2)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[webhook] unhandled error', err)
    // Devuelve 200 para evitar reintentos infinitos si el error es nuestro
    return NextResponse.json({ ok: false, error: 'unhandled' })
  }
}

/** ✅ Health/selftest (útil en local) */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('selftest') === '1') {
    const { error } = await supabase
      .from('questionnaire_submissions')
      .insert({
        tally_submission_id: 'selftest-' + Date.now(),
        form_id: 'mV9BKy', // usa uno real tuyo
        user_id: null,
        tenant: 'piloto',
        respondent_id: null,
        created_at: new Date().toISOString(),
        payload: { selftest: true },
        answers: {}
      })
    return NextResponse.json({ ok: !error, error })
  }
  return NextResponse.json({ ok: true, route: 'tally-webhook' })
}
