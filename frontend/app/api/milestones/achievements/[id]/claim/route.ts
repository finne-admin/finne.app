export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
import { NextRequest, NextResponse } from "next/server"
import { apiPost } from "@/lib/apiClient"

interface RouteContext {
  params: { id: string }
}

export async function POST(_req: NextRequest, { params }: RouteContext) {
  try {
    const res = await apiPost(`/api/milestones/achievements/${params.id}/claim`, {})
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error(`Proxy POST /api/milestones/achievements/${params.id}/claim:`, error)
    return NextResponse.json({ error: "Proxy error" }, { status: 500 })
  }
}

