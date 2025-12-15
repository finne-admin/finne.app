export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
// frontend/app/api/questionnaires/pending/route.ts
import { NextRequest, NextResponse } from "next/server"
import { apiGet } from "@/lib/apiClient"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const user = searchParams.get("user")

  if (!user) {
    return NextResponse.json({ error: "Falta parámetro user" }, { status: 400 })
  }

  try {
    const res = await apiGet(`/api/questionnaires/pending?user=${user}`)

    if (!res.ok) {
      const text = await res.text()
      console.error("Error en /questionnaires/pending:", text)
      return NextResponse.json({ error: "Backend error", detail: text }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data, { status: 200 })
  } catch (err: any) {
    console.error("Proxy error:", err)
    return NextResponse.json({ error: err.message || "Proxy error" }, { status: 500 })
  }
}

