import { NextRequest, NextResponse } from "next/server";
import { GoogleAuth } from "google-auth-library";
import { apiGet, apiPost, apiPut, apiDelete, apiFetch } from "@/lib/apiClient";

const AUDIENCE = process.env.BACKEND_AUDIENCE!;

export async function POST(req: NextRequest) {
  try {
    // 🔹 Crear cliente IAM (para Cloud Run)
    const auth = new GoogleAuth();
    const client = await auth.getIdTokenClient(AUDIENCE);
    const headers = await client.getRequestHeaders();

    // 🔹 Llamar al backend /api/auth/refresh
    const res = await apiFetch(`/api/auth/refresh`, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      // 👇 Importante: pasar las cookies del navegador al backend
      credentials: "include",
    });

    const data = await res.json().catch(() => ({}));

    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    console.error("❌ Error en proxy refresh:", err);
    return NextResponse.json(
      { error: err.message || "Error al refrescar sesión" },
      { status: 500 }
    );
  }
}
