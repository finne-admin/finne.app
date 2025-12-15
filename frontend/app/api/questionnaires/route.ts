export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
import { NextRequest, NextResponse } from "next/server"
import { apiGet } from "@/lib/apiClient"

export async function GET(req: NextRequest) {
  try {
    // Proxy al backend real
    const res = await apiGet("/api/questionnaires")

    if (!res.ok) {
      const text = await res.text()
      console.error("Error en /questionnaires:", text)
      return NextResponse.json({ error: "Backend error", detail: text }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data, { status: 200 })
  } catch (err: any) {
    console.error("Proxy error:", err)
    return NextResponse.json({ error: err.message || "Proxy error" }, { status: 500 })
  }
}

// ruta: frontend\app\api\questionnaires\route.ts
