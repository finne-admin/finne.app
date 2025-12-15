export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
import { NextRequest, NextResponse } from "next/server";
import { GoogleAuth } from "google-auth-library";
import { apiGet, apiPost, apiPut, apiDelete, apiFetch } from "@/lib/apiClient";

const AUDIENCE = process.env.BACKEND_AUDIENCE!;
const USE_IAM = process.env.DISABLE_IAM !== "1" && process.env.NODE_ENV !== "development";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData(); // para manejar archivos
    let headers: HeadersInit = {}
    if (USE_IAM) {
      try {
        const auth = new GoogleAuth();
        const client = await auth.getIdTokenClient(AUDIENCE);
        headers = await client.getRequestHeaders();
      } catch {
        return new Response(JSON.stringify({ ok: false, note: 'disabled during build' }), { status: 200 })
      }
    }

    const res = await apiFetch(`/api/wistia/upload`, {
      method: "POST",
      headers,
      body: formData,
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    console.error("❌ Error en proxy /wistia/upload:", err);
    return NextResponse.json({ error: err.message || "Proxy error" }, { status: 500 });
  }
}

