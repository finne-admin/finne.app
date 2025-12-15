export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
import { NextResponse } from "next/server"
import { apiGet } from "@/lib/apiClient"

export async function GET() {
  try {
    const res = await apiGet("/api/milestones/achievements/unlocked")
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error("Proxy GET /api/milestones/achievements/unlocked:", error)
    return NextResponse.json({ error: "Proxy error" }, { status: 500 })
  }
}

