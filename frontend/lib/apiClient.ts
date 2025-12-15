// frontend/lib/apiClient.ts

// Base URL (Cloud Run en prod, localhost en dev)
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

// Saber si estamos en entorno servidor
const isServer = typeof window === "undefined"

// --- Core: apiFetch ---
export async function apiFetch(url: string, options: RequestInit = {}) {
  let token: string | null = null

  // Solo intenta leer localStorage si estamos en el navegador
  if (!isServer) {
    token = localStorage.getItem("accessToken")
  }

  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "Content-Type": "application/json",
  }

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: "include", // necesario para refresh_token cookie
  })

  return res
}

// --- Helpers ---
export const apiGet = (path: string) => apiFetch(`${API_BASE_URL}${path}`)
export const apiPost = (path: string, body: any) =>
  apiFetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    body: JSON.stringify(body),
  })
export const apiPut = (path: string, body: any) =>
  apiFetch(`${API_BASE_URL}${path}`, {
    method: "PUT",
    body: JSON.stringify(body),
  })
export const apiDelete = (path: string, body?: any) =>
  apiFetch(`${API_BASE_URL}${path}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  })

