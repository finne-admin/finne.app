import { NextRequest, NextResponse } from "next/server";
import { GoogleAuth } from "google-auth-library";

const BACKEND_URL = process.env.BACKEND_URL!;
const AUDIENCE = process.env.BACKEND_AUDIENCE!;

export async function GET(req: NextRequest) {
  try {
    const auth = new GoogleAuth();
    const client = await auth.getIdTokenClient(AUDIENCE);
    const headers = await client.getRequestHeaders();

    const url = new URL(req.url);
    const query = url.search;

    // 🔹 Leer token JWT del usuario (guardado en el navegador)
    const token = req.headers.get("authorization");

    // 🔹 Reenviar la petición al backend con ambos tokens
    const res = await fetch(`${BACKEND_URL}/api/wistia/videos${query}`, {
      method: "GET",
      headers: {
        ...headers,
        "Content-Type": "application/json",
        ...(token ? { Authorization: token } : {}), // <--- pasa el JWT si existe
      },
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    console.error("❌ Error en proxy /wistia/videos:", err);
    return NextResponse.json({ error: err.message || "Proxy error" }, { status: 500 });
  }
}
