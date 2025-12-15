export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
import { NextRequest, NextResponse } from "next/server";
import { GoogleAuth } from "google-auth-library";
import { apiFetch } from "@/lib/apiClient";

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

    const res = await apiFetch(`/api/auth/verify`, {
      method: "POST",
      headers: { ...(headers as any), "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    console.error("❌ Error en proxy verify:", err);
    return NextResponse.json({ error: err.message || "Proxy error" }, { status: 500 });
  }
}


