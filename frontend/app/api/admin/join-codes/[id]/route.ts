export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
import { NextRequest, NextResponse } from "next/server"
import { API_BASE_URL } from "@/lib/apiClient"
import { buildProxyHeaders } from "@/app/api/_utils/proxyHeaders"

interface RouteContext {
  params: { id: string }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/join-codes/${params.id}`, {
      method: "DELETE",
      headers: buildProxyHeaders(req),
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error(`Proxy DELETE /api/admin/join-codes/${params.id}:`, error)
    return NextResponse.json({ error: "Proxy error" }, { status: 500 })
  }
}

