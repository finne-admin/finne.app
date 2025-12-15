export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
import { NextRequest, NextResponse } from "next/server";
import { GoogleAuth } from "google-auth-library";
import { apiGet, apiPost, apiPut, apiDelete, apiFetch } from "@/lib/apiClient";

const AUDIENCE = process.env.BACKEND_AUDIENCE!;
const USE_IAM = process.env.DISABLE_IAM !== "1" && process.env.NODE_ENV !== "development";

export async function GET(req: NextRequest) {
  try {
    let headers: HeadersInit = {}
    if (USE_IAM) {
      try {
        const auth = new GoogleAuth();
        const client = await auth.getIdTokenClient(AUDIENCE);
        headers = await client.getRequestHeaders();
      } catch {
        return new Response(JSON.stringify({ items: [], note: 'disabled during build' }), { status: 200 })
      }
    }

    const url = req.nextUrl;
    const query = url.search;

    // 🔹 Leer token JWT del usuario (guardado en el navegador)
    const token = req.headers.get("authorization");

    // 🔹 Reenviar la petición al backend con ambos tokens
    const res = await apiFetch(`/api/wistia/videos${query}`, {
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

