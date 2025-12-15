export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
import { NextRequest, NextResponse } from "next/server"
import { apiPost } from "@/lib/apiClient"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Proxy hacia backend
    const res = await apiPost("/api/tags", body)

    if (!res.ok) {
      const text = await res.text()
      console.error("Error en /api/tags:", text)
      return NextResponse.json({ error: "Backend error", detail: text }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data, { status: 200 })
  } catch (err: any) {
    console.error("Proxy error /api/tags:", err)
    return NextResponse.json({ error: err.message || "Proxy error" }, { status: 500 })
  }
}

