// app/api/tags/route.ts
import { NextResponse } from 'next/server'
import { apiGet, apiPost, apiPut, apiDelete, apiFetch } from "@/lib/apiClient"

export async function POST(request: Request) {
    const { video_hashes } = await request.json()

    try {
        // Validate input
        if (!Array.isArray(video_hashes)) {
            return NextResponse.json(
                { error: 'video_hashes must be an array' },
                { status: 400 }
            )
        }

        // Fetch tags from Wistia in parallel
        const tagsResults = await Promise.allSettled(
            video_hashes.map(async (hash) => {
                const response = await apiFetch(
                    `https://api.wistia.com/v1/medias/${hash}.json`,
                    {
                        headers: {
                            'Authorization': `Bearer ${process.env.WISTIA_API_TOKEN}`,
                            'Content-Type': 'application/json'
                        }
                    }
                )

                if (!response.ok) {
                    throw new Error(`Failed to fetch tags for ${hash}`)
                }

                const data = await response.json()
                return data.tags?.map((t: { name: string }) => t.name) || []
            })
        )

        // Process results and flatten tags
        const allTags = Array.from(new Set(
            tagsResults.flatMap(result =>
                result.status === 'fulfilled' ? result.value : []
            )
        ))

        return NextResponse.json({
            success: true,
            tags: allTags,
            errors: tagsResults.filter(r => r.status === 'rejected').map(r => r.reason.message)
        })

    } catch (error : any) {
        console.error('API Error:', error)
        return NextResponse.json(
            { error: 'Failed to process tags', details: error.message },
            { status: 500 }
        )
    }
}