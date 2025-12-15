export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
import { NextRequest, NextResponse } from "next/server"
import { apiPost } from "@/lib/apiClient"

interface RouteContext {
  params: { id: string }
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  try {
    const body = await req.json()
    const res = await apiPost(`/api/admin/users/${params.id}/password`, body)
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error(`Proxy POST /api/admin/users/${params.id}/password:`, error)
    return NextResponse.json({ error: "Proxy error" }, { status: 500 })
  }
}

