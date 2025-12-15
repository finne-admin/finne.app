export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
import { NextRequest, NextResponse } from "next/server"
import { API_BASE_URL } from "@/lib/apiClient"
import { buildProxyHeaders } from "@/app/api/_utils/proxyHeaders"

interface RouteContext {
  params: { id: string }
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/users/${params.id}/approve`, {
      method: "POST",
      headers: buildProxyHeaders(req),
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error(`Proxy POST /api/admin/users/${params.id}/approve:`, error)
    return NextResponse.json({ error: "Proxy error" }, { status: 500 })
  }
}

