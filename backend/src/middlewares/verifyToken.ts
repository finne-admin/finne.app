import { Request, Response, NextFunction } from "express";
import { verifyToken, TokenPayload } from "../utils/jwt";
import { isRefreshTokenValid } from "../db/queries/refreshTokenQueries";

const GLOBAL_ROLES = new Set(["superadmin", "soporte"]);
const ORG_ADMIN_ROLES = new Set(["admin", "manager", "superadmin", "soporte"]);

const getUserFromRequest = (req: Request): TokenPayload | undefined => {
  return (req as any).user as TokenPayload | undefined;
};

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token no proporcionado o formato inválido" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: "Token inválido o expirado" });
    }

    const valid = await isRefreshTokenValid(token);
    if (!valid) {
      return res.status(401).json({ error: "Sesión expirada o cerrada" });
    }

    (req as any).user = decoded;
    next();
  } catch (error) {
    console.error("Error en requireAuth:", error);
    return res.status(500).json({ error: "Error interno en autenticación" });
  }
}

export function requireOrganizationAdmin(req: Request, res: Response, next: NextFunction) {
  const user = getUserFromRequest(req);
  if (!user) {
    return res.status(401).json({ error: "No autenticado" });
  }

  const roleName = user.roleName?.toLowerCase();
  if (!roleName || !ORG_ADMIN_ROLES.has(roleName)) {
    return res.status(403).json({ error: "Permiso denegado" });
  }

  next();
}

export function requireSuperAdmin(req: Request, res: Response, next: NextFunction) {
  const user = getUserFromRequest(req);
  if (!user) {
    return res.status(401).json({ error: "No autenticado" });
  }

  const roleName = user.roleName?.toLowerCase();
  if (!roleName || !GLOBAL_ROLES.has(roleName)) {
    return res.status(403).json({ error: "Permiso denegado" });
  }

  next();
}
