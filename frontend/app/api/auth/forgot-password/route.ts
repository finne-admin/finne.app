export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
import { NextRequest, NextResponse } from "next/server";
import { GoogleAuth } from "google-auth-library";

const AUDIENCE = process.env.BACKEND_AUDIENCE!;
const USE_IAM = process.env.DISABLE_IAM !== "1" && process.env.NODE_ENV !== "development";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let headers: HeadersInit = {};
    if (USE_IAM) {
      const auth = new GoogleAuth();
      const client = await auth.getIdTokenClient(AUDIENCE);
      headers = await client.getRequestHeaders();
    }

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const cookieHeader = req.headers.get("cookie") || undefined;
    const h = new Headers(headers as HeadersInit);
    h.set("Content-Type", "application/json");
    if (cookieHeader) h.set("Cookie", cookieHeader);

    const res = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
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
    console.error("Error en proxy forgot-password:", err);
    return NextResponse.json({ error: err.message || "Proxy error" }, { status: 500 });
  }
}

