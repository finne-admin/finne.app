export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
import { NextRequest, NextResponse } from "next/server"
import { apiGet } from "@/lib/apiClient"

export async function GET(req: NextRequest) {
  try {
    const limit = req.nextUrl.searchParams.get("limit")
    const path = limit
      ? `/api/admin/exercise-satisfaction?limit=${encodeURIComponent(limit)}`
      : "/api/admin/exercise-satisfaction"
    const res = await apiGet(path)
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error("Proxy GET /api/admin/exercise-satisfaction:", error)
    return NextResponse.json({ error: "Proxy error" }, { status: 500 })
  }
}

