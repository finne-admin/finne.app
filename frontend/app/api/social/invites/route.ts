export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
import { NextRequest, NextResponse } from "next/server"
import { API_BASE_URL } from "@/lib/apiClient"
import { buildProxyHeaders } from "@/app/api/_utils/proxyHeaders"

export async function GET(req: NextRequest) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/social/invites`, {
      method: "GET",
      headers: buildProxyHeaders(req),
      cache: "no-store",
      credentials: "include",
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error("Proxy GET /api/social/invites:", error)
    return NextResponse.json({ error: "Proxy error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const res = await fetch(`${API_BASE_URL}/api/social/invites`, {
      method: "POST",
      headers: buildProxyHeaders(request),
      body: JSON.stringify(body),
      credentials: "include",
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error("Proxy POST /api/social/invites:", error)
    return NextResponse.json({ error: "Proxy error" }, { status: 500 })
  }
}
