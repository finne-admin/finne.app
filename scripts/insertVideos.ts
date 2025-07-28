import { createClient } from '@supabase/supabase-js'
import fetch from 'node-fetch'
import 'dotenv/config'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const WISTIA_API_TOKEN = process.env.WISTIA_API_TOKEN!

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const categoriasValidas = [
  'fuerza',
  'miembro superior',
  'miembro inferior',
  'movilidad',
  'core',
  'cervicales',
  'cardio'
]

async function main() {
  const wistiaUrl = `https://api.wistia.com/v1/medias.json`
  const res = await fetch(wistiaUrl, {
    headers: {
      Authorization: `Bearer ${WISTIA_API_TOKEN}`
    }
  })

  if (!res.ok) {
    console.error('Error al acceder a la API de Wistia:', await res.text())
    return
  }

  const videos = await res.json() as Array<{ hashed_id: string; name: string; tags?: string[] }>

    for (const video of videos) {
    const hashedId = video.hashed_id

    const detailRes = await fetch(`https://api.wistia.com/v1/medias/${hashedId}.json`, {
        headers: {
        Authorization: `Bearer ${WISTIA_API_TOKEN}`
        }
    })

    if (!detailRes.ok) {
        console.warn(`❌ No se pudo obtener detalles de ${hashedId}:`, await detailRes.text())
        continue
    }

    const details = await detailRes.json() as { name: string; tags?: { name: string }[] }
    const name = details.name
    const tagsRaw = details.tags || []

    //console.log('Tags crudas:', tagsRaw)

    const tagNames = tagsRaw.map(t => t.name?.toLowerCase().trim())
    const categorias = categoriasValidas.filter(cat => tagNames.includes(cat))

    if (categorias.length === 0) {
    console.log(`⏩ Saltando vídeo sin categoría válida: ${name} (${hashedId})`)
    continue
    }


    const { error } = await supabase
    .from('videos')
    .upsert({
        wistia_id: hashedId,
        titulo: name,
        categorias, // <- ahora es un array
    }, { onConflict: 'wistia_id' })

    if (error) {
        console.error(`❌ Error al insertar vídeo ${hashedId}:`, error.message)
    } else {
        console.log(`✅ Insertado: ${name} (${categorias})`)
    }
    }


  console.log('📦 Finalizado.')
}

main()
