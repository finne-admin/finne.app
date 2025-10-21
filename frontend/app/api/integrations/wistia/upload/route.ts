import { NextRequest, NextResponse } from "next/server";
import { GoogleAuth } from "google-auth-library";
import { apiGet, apiPost, apiPut, apiDelete, apiFetch } from "@/lib/apiClient";

const AUDIENCE = process.env.BACKEND_AUDIENCE!;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData(); // para manejar archivos
    const auth = new GoogleAuth();
    const client = await auth.getIdTokenClient(AUDIENCE);
    const headers = await client.getRequestHeaders();

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
