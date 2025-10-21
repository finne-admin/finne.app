import { NextRequest, NextResponse } from "next/server";
import { GoogleAuth } from "google-auth-library";

const AUDIENCE = process.env.BACKEND_AUDIENCE!;

export async function POST(req: NextRequest) {
  try {
    // Crear cliente IAM (para Cloud Run)
    const auth = new GoogleAuth();
    const client = await auth.getIdTokenClient(AUDIENCE);
    const headers = await client.getRequestHeaders();

    // Llamar al backend /api/auth/refresh con URL absoluta y reenviar cookies del cliente
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const cookieHeader = req.headers.get("cookie") || undefined;

    const h = new Headers(headers as HeadersInit);
    h.set("Content-Type", "application/json");
    if (cookieHeader) h.set("Cookie", cookieHeader);

    const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: "POST",
      headers: h,
    });

    const data = await res.json().catch(() => ({}));

    // Reenviar Set-Cookie del backend al navegador del cliente
    const out = NextResponse.json(data, { status: res.status });
    const setCookie = res.headers.get("set-cookie");
    if (setCookie) out.headers.set("set-cookie", setCookie);
    return out;
  } catch (err: any) {
    console.error("❌ Error en proxy refresh:", err);
    return NextResponse.json(
      { error: err.message || "Error al refrescar sesión" },
      { status: 500 }
    );
  }
}
