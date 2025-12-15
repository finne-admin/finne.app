export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
import { NextRequest, NextResponse } from "next/server"
import { apiGet } from "@/lib/apiClient"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const limit = searchParams.get("limit") || "20"
  const offset = searchParams.get("offset") || "0"

  try {
    const res = await apiGet(`/api/xp/history?limit=${encodeURIComponent(limit)}&offset=${encodeURIComponent(offset)}`)
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error("Proxy GET /api/xp/history:", error)
    return NextResponse.json({ error: "Proxy error" }, { status: 500 })
  }
}

