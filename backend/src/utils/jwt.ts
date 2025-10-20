import jwt from "jsonwebtoken";

let cachedJwtSecret: string | undefined;

export function getJwtSecret(): string {
  if (!cachedJwtSecret) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET no está configurado.");
    }
    cachedJwtSecret = secret;
  }

  return cachedJwtSecret;
}

/**
 * Crea un nuevo token para un usuario.
 */
export function createToken(user: any) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    getJwtSecret(),
    { expiresIn: "15m" } // dura 15 minutos
  );
}

/**
 * Verifica si un token es válido y devuelve su contenido.
 */
export function verifyToken(token: string) {
  try {
    return jwt.verify(token, getJwtSecret());
  } catch (error) {
    if (error instanceof Error && error.message === "JWT_SECRET no está configurado.") {
      throw error;
    }
    return null;
  }
}
