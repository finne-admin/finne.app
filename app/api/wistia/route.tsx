import { NextResponse } from 'next/server'

export async function GET() {
    const projectId = process.env.WISTIA_PROJECT_ID
    const token = process.env.WISTIA_API_TOKEN

    const url = `https://api.wistia.com/v1/medias?project_id=${projectId}`

    const response = await fetch(url, {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
        },
    })
    const data = await response.json()

    return NextResponse.json(data)
}