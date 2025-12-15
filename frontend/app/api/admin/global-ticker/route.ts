export const dynamic = "force-dynamic"
export const revalidate = 0
export const fetchCache = "force-no-store"
import { NextRequest, NextResponse } from "next/server"
import { API_BASE_URL } from "@/lib/apiClient"
import { buildProxyHeaders } from "@/app/api/_utils/proxyHeaders"

export async function GET(req: NextRequest) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/global-ticker`, {
      method: "GET",
      headers: buildProxyHeaders(req),
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error("Proxy GET /api/admin/global-ticker:", error)
    return NextResponse.json({ error: "Proxy error" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const res = await fetch(`${API_BASE_URL}/api/admin/global-ticker`, {
      method: "PUT",
      headers: buildProxyHeaders(req),
      body: JSON.stringify(body),
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error("Proxy PUT /api/admin/global-ticker:", error)
    return NextResponse.json({ error: "Proxy error" }, { status: 500 })
  }
}
