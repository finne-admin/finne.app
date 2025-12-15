import { NextRequest } from "next/server"

export const buildProxyHeaders = (req: NextRequest) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  const authHeader = req.headers.get("authorization")
  if (authHeader) {
    headers.Authorization = authHeader
  }

  const cookieHeader = req.headers.get("cookie")
  if (cookieHeader) {
    headers.Cookie = cookieHeader
  }

  return headers
}
