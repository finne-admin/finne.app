import jwt from "jsonwebtoken";

let cachedJwtSecret: string | undefined;

export interface TokenPayload {
  id: string;
  email: string;
  roleId: string;
  roleName: string;
  roleScope?: string;
}

export function getJwtSecret(): string {
  if (!cachedJwtSecret) {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET no está configurado.");
    cachedJwtSecret = secret;
  }
  return cachedJwtSecret;
}

// ✅ Sin expiración
export function createToken(user: TokenPayload) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      roleId: user.roleId,
      roleName: user.roleName,
      roleScope: user.roleScope,
    },
    getJwtSecret()
  );
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as TokenPayload;
  } catch (error) {
    console.error("JWT verification failed:", (error as Error).message);
    return null;
  }
}
