export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
import { NextRequest, NextResponse } from "next/server";
import { GoogleAuth } from "google-auth-library";

const AUDIENCE = process.env.BACKEND_AUDIENCE!;
const USE_IAM = process.env.DISABLE_IAM !== "1" && process.env.NODE_ENV !== "development";

const MAX_RETRIES = 5;
const INITIAL_DELAY_MS = 1000;
const MAX_DELAY_MS = 16000;
const REQUEST_TIMEOUT_MS = Number(process.env.AUTH_PROXY_TIMEOUT_MS ?? 20000);
const RETRYABLE_STATUSES = new Set([408, 425, 429, 500, 502, 503, 504]);

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const computeRetryDelay = (res: Response, attempt: number, currentDelay: number) => {
  const retryAfterHeader = res.headers.get("retry-after");
  if (retryAfterHeader) {
    const numeric = Number(retryAfterHeader);
    if (!Number.isNaN(numeric)) return Math.max(numeric * 1000, 500);

    const retryDate = Date.parse(retryAfterHeader);
    if (!Number.isNaN(retryDate)) return Math.max(retryDate - Date.now(), 500);
  }

  return Math.min(currentDelay * 2, MAX_DELAY_MS, 500 * Math.pow(2, attempt + 1));
};

const resolveBaseUrl = () => {
  const base =
    process.env.API_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    (process.env.NODE_ENV === "development"
      ? "http://localhost:4000"
      : "https://api.finne-beta.online");

  if (base.includes("finne-beta.online") && !base.includes("api.")) {
    throw new Error(
      "API_INTERNAL_URL o NEXT_PUBLIC_API_URL apunta al dominio del frontend (finne-beta.online) en lugar de api.finne-beta.online. Esto provoca un bucle infinito."
    );
  }

  return base;
};

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") || undefined;
    const cookieHeader = req.headers.get("cookie") || undefined;

    // 🔐 IAM headers (Cloud Run)
    let headers: HeadersInit = {};
    if (USE_IAM) {
      const auth = new GoogleAuth();
      const client = await auth.getIdTokenClient(AUDIENCE);
      headers = await client.getRequestHeaders();
    }

    // ✅ Fusionamos IAM + usuario
    const finalHeaders = new Headers(headers as HeadersInit);
    if (authHeader) finalHeaders.set("Authorization", authHeader);
    if (cookieHeader) finalHeaders.set("Cookie", cookieHeader);
    finalHeaders.set("Cache-Control", "no-store");

    const BASE_URL = resolveBaseUrl();

    let delay = INITIAL_DELAY_MS;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

        const res = await fetch(`${BASE_URL}/api/auth/me`, {
          method: "GET",
          headers: finalHeaders,
          cache: "no-store",
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!RETRYABLE_STATUSES.has(res.status) || attempt === MAX_RETRIES) {
          const text = await res.text().catch(() => "");
          let data: any;
          try {
            data = text ? JSON.parse(text) : {};
          } catch {
            data = text ? { error: text } : {};
          }

          const out = NextResponse.json(data, { status: res.status });
          const setCookie = res.headers.get("set-cookie");
          if (setCookie) out.headers.set("set-cookie", setCookie);
          return out;
        }

        delay = computeRetryDelay(res, attempt, delay);
        const bodyPreview = await res.text().catch(() => "");
        console.warn(
          `[auth/me] backend ${res.status} on attempt ${attempt + 1}. Retrying in ${delay}ms. Body: ${bodyPreview}`
        );
      } catch (fetchErr: any) {
        if (attempt === MAX_RETRIES) {
          console.error(`[auth/me] network failure on attempt ${attempt + 1}:`, fetchErr);
          return NextResponse.json(
            { error: fetchErr?.message || "Proxy network error" },
            { status: 502 }
          );
        }

        delay = Math.min(delay * 2, MAX_DELAY_MS);
        console.warn(
          `[auth/me] network error on attempt ${attempt + 1}: ${fetchErr?.message ?? fetchErr}. Retrying in ${delay}ms`
        );
      }

      await wait(delay);
    }
  } catch (err: any) {
    console.error("❌ Error en proxy /auth/me:", err);
    return NextResponse.json(
      { error: err?.message || "Proxy error" },
      { status: 500 }
    );
  }

  return NextResponse.json({ error: "Unexpected proxy state" }, { status: 500 });
}

