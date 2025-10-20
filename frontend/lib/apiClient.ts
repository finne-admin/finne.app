// frontend/lib/apiClient.ts

// Base URL (cambia en producción automáticamente con Cloud Run)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// --- Core: apiFetch (maneja tokens, refresh, reintentos) ---
export async function apiFetch(
  url: string,
  options: RequestInit = {},
  retry = true
) {
  const token = localStorage.getItem("accessToken");

  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "Content-Type": "application/json",
  };

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: "include", // necesario para refresh_token cookie
  });

  // Si el token caducó, intenta refrescarlo automáticamente
  if (res.status === 401 && retry) {
    const refreshRes = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (refreshRes.ok) {
      const { accessToken } = await refreshRes.json();
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        // Reintenta la petición original una sola vez
        return apiFetch(url, options, false);
      }
    }
  }

  return res;
}

// --- Helpers semánticos para distintas operaciones HTTP ---

export async function apiGet(path: string) {
  return apiFetch(`${BASE_URL}${path}`);
}

export async function apiPost(path: string, body: any) {
  return apiFetch(`${BASE_URL}${path}`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function apiPut(path: string, body: any) {
  return apiFetch(`${BASE_URL}${path}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function apiDelete(path: string) {
  return apiFetch(`${BASE_URL}${path}`, { method: "DELETE" });
}
