export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
import { NextRequest } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export async function POST(request: NextRequest) {
  if (!API_BASE_URL) {
    return new Response(JSON.stringify({ error: "NEXT_PUBLIC_API_URL no está configurado" }), {
      status: 500,
    })
  }

  const body = await request.text()
  const res = await fetch(`${API_BASE_URL}/api/achievements/check`, {
    method: "POST",
    headers: {
      "Content-Type": request.headers.get("content-type") || "application/json",
      Authorization: request.headers.get("authorization") || "",
    },
    body,
  })

  const text = await res.text()
  if (!res.ok) {
    console.error("Proxy POST /api/achievements/check:", res.status, text)
    return new Response(text, { status: res.status })
  }

  return new Response(text, { status: res.status, headers: { "Content-Type": "application/json" } })
}

