export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
import { NextRequest, NextResponse } from "next/server"
import { API_BASE_URL, apiFetch } from "@/lib/apiClient"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const res = await apiFetch(`${API_BASE_URL}/api/social/shares`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error("Proxy POST /api/social/shares:", error)
    return NextResponse.json({ error: "Proxy error" }, { status: 500 })
  }
}
