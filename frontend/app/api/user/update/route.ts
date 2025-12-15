export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
import { NextRequest, NextResponse } from "next/server"
import { apiPut } from "@/lib/apiClient"

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const res = await apiPut("/api/user/update", body)

    if (!res.ok) {
      const text = await res.text()
      console.error("❌ Error en proxy /api/user/update:", text)
      return NextResponse.json({ error: "Backend error", detail: text }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data, { status: 200 })
  } catch (err: any) {
    console.error("Proxy error /api/user/update:", err)
    return NextResponse.json({ error: err.message || "Proxy error" }, { status: 500 })
  }
}

