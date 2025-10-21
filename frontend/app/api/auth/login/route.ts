import { NextRequest, NextResponse } from "next/server";
import { GoogleAuth } from "google-auth-library";
// Usamos fetch nativo en entorno servidor para poder reenviar cookies y Set-Cookie

const AUDIENCE = process.env.BACKEND_AUDIENCE!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const auth = new GoogleAuth();
    const client = await auth.getIdTokenClient(AUDIENCE);
    const headers = await client.getRequestHeaders();

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const cookieHeader = req.headers.get("cookie") || undefined;
    const h = new Headers(headers as HeadersInit);
    h.set("Content-Type", "application/json");
    if (cookieHeader) h.set("Cookie", cookieHeader);

    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: h,
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));
    const out = NextResponse.json(data, { status: res.status });
    const setCookie = res.headers.get("set-cookie");
    if (setCookie) out.headers.set("set-cookie", setCookie);
    return out;
  } catch (err: any) {
    console.error("❌ Error en proxy login:", err);
    return NextResponse.json({ error: err.message || "Proxy error" }, { status: 500 });
  }
}
