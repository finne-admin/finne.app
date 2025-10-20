import { NextRequest, NextResponse } from "next/server";
import { GoogleAuth } from "google-auth-library";

const BACKEND_URL = process.env.BACKEND_URL!;
const AUDIENCE = process.env.BACKEND_AUDIENCE!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const auth = new GoogleAuth();
    const client = await auth.getIdTokenClient(AUDIENCE);
    const headers = await client.getRequestHeaders();

    const res = await fetch(`${BACKEND_URL}/api/auth/verify`, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    console.error("❌ Error en proxy verify:", err);
    return NextResponse.json({ error: err.message || "Proxy error" }, { status: 500 });
  }
}
