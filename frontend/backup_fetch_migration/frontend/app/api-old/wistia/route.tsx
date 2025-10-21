import {NextRequest, NextResponse} from 'next/server'

export async function GET(request: NextRequest) {
    try {
        const projectId = process.env.WISTIA_PROJECT_ID
        const token = process.env.WISTIA_API_TOKEN

        // 1. Parse query params
        const { searchParams } = new URL(request.url)
        // This will grab all occurrences of ?tags=...
        const tags = searchParams.getAll('tags')

        // 2. Build base Wistia URL
        // If no tags selected, default to project_id param
        let wistiaUrl = `https://api.wistia.com/v1/medias?project_id=${projectId}`

        // 3. If we have any tags, append them to the URL
        if (tags.length > 0) {
            // Remove project_id if we only want to filter purely by tags,
            // or keep it if we want them restricted to the same project.
            // For now, let's keep project_id so we are still in the same project:
            // `?project_id=XYZ&tags=foo&tags=bar`
            // Up to you if you want to remove the project_id param in that scenario.
            tags.forEach(tag => {
                // Each tag param is appended separately
                wistiaUrl += `&tags=${encodeURIComponent(tag)}`
            })
        }

        // 4. Fetch from Wistia
        const response = await fetch(wistiaUrl, {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            throw new Error(`Wistia API error: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        return NextResponse.json(data)

    } catch (err) {
        console.error('Error fetching from Wistia:', err)
        return NextResponse.json({ error: 'Error fetching Wistia data' }, { status: 500 })
    }
}