export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
import { NextRequest, NextResponse } from "next/server"
import { apiGet, apiPut, apiDelete } from "@/lib/apiClient"

export async function GET(req: NextRequest) {
  try {
    const res = await apiGet("/api/notifications/preferences")
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (err: any) {
    console.error("Proxy GET /api/notifications/preferences:", err)
    return NextResponse.json({ error: "Proxy error" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const res = await apiPut("/api/notifications/preferences", body)
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (err: any) {
    console.error("Proxy PUT /api/notifications/preferences:", err)
    return NextResponse.json({ error: "Proxy error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json()
    const res = await apiDelete("/api/notifications/preferences", body)
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (err: any) {
    console.error("Proxy DELETE /api/notifications/preferences:", err)
    return NextResponse.json({ error: "Proxy error" }, { status: 500 })
  }
}

