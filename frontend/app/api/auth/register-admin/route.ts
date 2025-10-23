import { NextRequest, NextResponse } from "next/server";
import { GoogleAuth } from "google-auth-library";
// Usar fetch nativo en server para evitar localStorage

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

    const res = await fetch(`${BASE_URL}/api/auth/register-admin`, {
      method: "POST",
      headers: h,
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    console.error("❌ Error en proxy register-admin:", err);
    return NextResponse.json({ error: err.message || "Proxy error" }, { status: 500 });
  }
}
