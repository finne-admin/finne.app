export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
import { NextRequest, NextResponse } from "next/server"
import { API_BASE_URL, apiFetch } from "@/lib/apiClient"

interface RouteContext {
  params: { token: string }
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const res = await apiFetch(`${API_BASE_URL}/api/social/shares/${params.token}/use`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error(`Proxy POST /api/social/shares/${params.token}/use:`, error)
    return NextResponse.json({ error: "Proxy error" }, { status: 500 })
  }
}
