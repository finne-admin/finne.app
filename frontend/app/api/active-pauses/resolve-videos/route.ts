export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/active-pauses/resolve-videos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error("Error en /active-pauses/resolve-videos:", text)
      return NextResponse.json({ error: "Backend error", detail: text }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data, { status: 200 })
  } catch (err: any) {
    console.error("Proxy error:", err)
    return NextResponse.json({ error: err.message || "Proxy error" }, { status: 500 })
  }
}

