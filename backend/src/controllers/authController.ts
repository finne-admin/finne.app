import { Request, Response } from "express";
import bcrypt from "bcrypt";
import {
  findUserByEmail,
  insertUser,
  getUserWithPassword,
  updateUserPasswordById,
  findUserById,
} from "../db/queries/userQueries";
import { findRoleByName } from "../db/queries/roleQueries";
import { getPool } from "../config/dbManager";
import {
  findJoinCodeByCode,
  incrementJoinCodeUsage,
} from "../db/queries/joinCodeQueries";
import { upsertUserMembership } from "../db/queries/userMembershipQueries";
import {
  createRefreshToken,
  findRefreshToken,
  revokeRefreshToken,
} from "../db/queries/refreshTokenQueries";
import { uuidv7 as uuidv4 } from "uuidv7";
import { createToken, verifyToken as verifyJwtToken } from "../utils/jwt";
import {
  ensurePasswordResetTable,
  createPasswordResetToken,
  findValidPasswordResetToken,
  markPasswordResetTokenUsed,
} from "../db/queries/passwordResetQueries";

const serializeError = (error: unknown) => {
  if (error instanceof Error) {
    return { message: error.message, stack: error.stack };
  }
  return error;
};

const createRequestLogger = (scope: string, req: Request) => {
  const requestId = uuidv4();
  const label = `[${scope}][${requestId}] total`;
  const baseMeta = {
    requestId,
    ip: req.ip,
    userAgent: req.get("user-agent") || "unknown",
    referer: req.get("referer") || "unknown",
  };

  return {
    requestId,
    meta: baseMeta,
    start: () => console.time(label),
    end: () => console.timeEnd(label),
    log: (message: string, payload?: Record<string, unknown>) =>
      console.log(`[${scope}][${requestId}] ${message}`, payload || {}),
    warn: (message: string, payload?: Record<string, unknown>) =>
      console.warn(`[${scope}][${requestId}] ${message}`, payload || {}),
    error: (message: string, payload?: Record<string, unknown>) =>
      console.error(`[${scope}][${requestId}] ${message}`, payload || {}),
  };
};

// ======================================================
// POST /api/auth/register
// ======================================================
export const registerUser = async (req: Request, res: Response) => {
  const logger = createRequestLogger("auth:register", req);
  logger.log("incoming request", {
    ...logger.meta,
    body: {
      email: req.body?.email,
      firstName: req.body?.firstName,
      lastName: req.body?.lastName,
    },
  });

  logger.start();
  try {
    const { firstName, lastName, email, password, dateOfBirth, sex, joinCode } = req.body;
    if (!email || !password || !firstName || !lastName) {
      logger.warn("missing required fields", { email });
      return res.status(400).json({ error: "Faltan campos obligatorios." });
    }

    if (!joinCode || typeof joinCode !== "string") {
      return res.status(400).json({ error: "Debe proporcionar un código de registro válido." });
    }

    const normalizedCode = joinCode.trim().toUpperCase();
    if (!/^[A-Z0-9]{3}-[A-Z0-9]{3}$/.test(normalizedCode)) {
      return res.status(400).json({ error: "Formato de código inválido. Usa XXX-YYY." });
    }

    logger.log("checking if email already exists", { email });
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      logger.warn("email already registered", { email });
      return res.status(400).json({ error: "El correo ya esta registrado." });
    }

    const pool = await getPool();
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const userRole = await findRoleByName("user");

      const joinCodeRecord = await findJoinCodeByCode(normalizedCode, {
        client,
        forUpdate: true,
      });

      if (!joinCodeRecord) {
        await client.query("ROLLBACK");
        return res.status(400).json({ error: "Código de registro no encontrado." });
      }

      if (joinCodeRecord.expires_at && joinCodeRecord.expires_at < new Date()) {
        await client.query("ROLLBACK");
        return res.status(400).json({ error: "Este código ha expirado." });
      }

      if (
        joinCodeRecord.max_uses !== null &&
        joinCodeRecord.used_count >= joinCodeRecord.max_uses
      ) {
        await client.query("ROLLBACK");
        return res.status(400).json({ error: "Este código ya alcanzó el límite de usos." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const accountStatus = joinCodeRecord.auto_approve ? "active" : "pending";

      const newUser = await insertUser(
        {
          firstName,
          lastName,
          email,
          hashedPassword,
          dateOfBirth,
          sex,
          roleId: userRole.id,
          accountStatus,
        },
        client
      );

      await upsertUserMembership(
        newUser.id,
        joinCodeRecord.organization_id,
        joinCodeRecord.department_id,
        client
      );

      await incrementJoinCodeUsage(joinCodeRecord.id, client);
      await client.query("COMMIT");

      const message = joinCodeRecord.auto_approve
        ? "Cuenta creada y activada correctamente. Ya puedes iniciar sesión."
        : "Solicitud registrada correctamente. Un administrador debe aprobar tu cuenta antes de iniciar sesión.";

      res.status(201).json({
        success: true,
        message,
        user: newUser,
        role: newUser.role_name,
        requiresApproval: !joinCodeRecord.auto_approve,
        accountStatus,
      });

      logger.log("registration completed", {
        userId: newUser.id,
        joinCode: normalizedCode,
        autoApprove: joinCodeRecord.auto_approve,
      });
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  } catch (error) {
    logger.error("registration failed", { error: serializeError(error) });
    res.status(500).json({ error: "Error al registrar usuario." });
  } finally {
    logger.end();
  }
};

// ======================================================
// POST /api/auth/register-admin
// ======================================================
export const registerAdmin = async (req: Request, res: Response) => {
  const logger = createRequestLogger("auth:register-admin", req);
  logger.log("incoming request", {
    ...logger.meta,
    body: {
      email: req.body?.email,
      firstName: req.body?.firstName,
      lastName: req.body?.lastName,
    },
  });

  logger.start();
  try {
    const { firstName, lastName, email, password, dateOfBirth, sex } = req.body;
    if (!email || !password || !firstName || !lastName) {
      logger.warn("missing required fields", { email });
      return res.status(400).json({ error: "Faltan campos obligatorios." });
    }

    logger.log("checking if email already exists", { email });
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      logger.warn("email already registered", { email });
      return res.status(400).json({ error: "El correo ya esta registrado." });
    }

    const adminRole = await findRoleByName("admin");
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await insertUser({
      firstName,
      lastName,
      email,
      hashedPassword,
      dateOfBirth,
      sex,
      roleId: adminRole.id,
      accountStatus: "active",
    });

    res.status(201).json({
      success: true,
      message: "Administrador registrado correctamente",
      user: newUser,
      role: newUser.role_name,
    });

    logger.log("admin registration completed", { userId: newUser.id });
  } catch (error) {
    logger.error("register-admin failed", { error: serializeError(error) });
    res.status(500).json({ error: "Error al registrar administrador." });
  } finally {
    logger.end();
  }
};

// ======================================================
// POST /api/auth/login
// ======================================================
export const loginUser = async (req: Request, res: Response) => {
  const logger = createRequestLogger("auth:login", req);
  const { email, password } = req.body;

  logger.log("incoming request", { ...logger.meta, email });

  if (!email || !password) {
    logger.warn("missing credentials", { email });
    return res.status(400).json({ error: "Faltan credenciales." });
  }

  logger.start();
  try {
    const user = await getUserWithPassword(email);
    if (!user) {
      logger.warn("user not found", { email });
      return res.status(400).json({ error: "Credenciales inválidas." });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      logger.warn("invalid password", { userId: user.id });
      return res.status(400).json({ error: "Credenciales inválidas." });
    }

    if (user.account_status !== "active") {
      const code = user.account_status === "pending" ? "ACCOUNT_PENDING" : "ACCOUNT_REJECTED";
      const message =
        code === "ACCOUNT_PENDING"
          ? "Tu cuenta está pendiente de aprobación por un administrador."
          : "Tu solicitud fue rechazada por un administrador.";
      logger.warn("account not active", { userId: user.id, status: user.account_status });
      return res.status(403).json({ error: message, code });
    }

    // 🔐 Crear token JWT sin caducidad
    const token = createToken({
      id: user.id,
      email: user.email,
      roleId: user.role_id,
      roleName: user.role_name,
      roleScope: user.role_scope,
    });

    // 🗃 Registrar sesión activa (sin expiración)
    try {
      await createRefreshToken(user.id, token); // usamos el JWT como "token" en refresh_tokens
    } catch (dbErr) {
      logger.error("failed to register active session", { error: serializeError(dbErr) });
    }

    // ✅ Respuesta con token y datos del usuario
    res.json({
      success: true,
      message: "Inicio de sesión correcto",
      token,
      user: {
        id: user.id,
        email: user.email,
        roleId: user.role_id,
        role: user.role_name,
        roleName: user.role_name,
        roleScope: user.role_scope,
        accountStatus: user.account_status,
      },
    });

    logger.log("login success", { userId: user.id });
  } catch (error) {
    logger.error("login failed", { error: serializeError(error) });
    res.status(500).json({ error: "Error al iniciar sesión." });
  } finally {
    logger.end();
  }
};


// ======================================================
// POST /api/auth/verify
// ======================================================
export const verifyToken = async (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: "Token requerido." });

  try {
    const decoded = verifyJwtToken(token);
    if (!decoded) {
      return res
        .status(401)
        .json({ valid: false, error: "Token invalido o expirado." });
    }

    res.json({ valid: true, user: decoded });
  } catch (error) {
    console.error("? Error al verificar token:", error);
    res.status(500).json({ error: "Error al verificar el token." });
  }
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  const logger = createRequestLogger("auth:refresh", req);
  logger.log("incoming request", {
    ...logger.meta,
    hasCookie: Boolean(req.cookies?.refresh_token),
  });

  logger.start();
  try {
    const token = req.cookies?.refresh_token;
    if (!token) {
      logger.warn("missing refresh token cookie");
      return res.status(401).json({ error: "Falta refresh token" });
    }

    const existing = await findRefreshToken(token);
    if (!existing) {
      logger.warn("refresh token not found in store");
      return res.status(401).json({ error: "Refresh token invalido" });
    }

    const pool = await getPool();
    const { rows } = await pool.query(`SELECT * FROM users WHERE id = $1`, [existing.user_id]);
    const user = rows[0];
    if (!user) {
      logger.warn("user not found for refresh token", { refreshId: existing.id });
      return res.status(401).json({ error: "Usuario no encontrado para refresh token" });
    }

    const accessToken = createToken({
      id: user.id,
      email: user.email,
      roleId: user.role_id,
      roleName: user.role_name,
      roleScope: user.role_scope,
    });

    try {
      await revokeRefreshToken(token);
      const newRefresh = uuidv4();
      await createRefreshToken(user.id, newRefresh);
      res.cookie("refresh_token", newRefresh, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
      });
    } catch (rotationErr) {
      logger.error("failed rotating refresh token", { error: serializeError(rotationErr) });
    }

    res.json({ success: true, accessToken });
    logger.log("refresh success", { userId: user.id });
  } catch (err) {
    logger.error("refresh failed", { error: serializeError(err) });
    res.status(500).json({ error: "Error al refrescar token" });
  } finally {
    logger.end();
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  const logger = createRequestLogger("auth:logout", req);
  logger.start();

  try {
    const cookieToken = req.cookies?.refresh_token;
    const authHeader = req.headers.authorization;
    const bearer = authHeader?.split(" ")[1];

    // 🔹 Revocar refresh_token
    if (cookieToken) {
      await revokeRefreshToken(cookieToken);
    }

    // 🔹 También revocar el accessToken (si se guardó como sesión activa)
    if (bearer) {
      await revokeRefreshToken(bearer).catch(() => {});
    }

    res.clearCookie("refresh_token");
    res.json({ success: true, message: "Sesión cerrada correctamente" });
    logger.log("logout success");
  } catch (err) {
    logger.error("logout failed", { error: serializeError(err) });
    res.status(500).json({ error: "Error al cerrar sesión" });
  } finally {
    logger.end();
  }
};


export const getCurrentUser = async (req: Request, res: Response) => {
  const logger = createRequestLogger("auth:me", req);
  logger.log("incoming request", logger.meta);
  logger.start();

  try {
    const authUser = (req as any).user;
    if (!authUser?.id) {
      logger.warn("missing auth context");
      return res.status(401).json({ error: "No autenticado" });
    }

    const dbUser = await findUserById(authUser.id);
    if (!dbUser) {
      logger.warn("user not found in database", { userId: authUser.id });
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const userPayload = {
      id: dbUser.id,
      email: dbUser.email,
      firstName: dbUser.first_name,
      lastName: dbUser.last_name,
      roleId: dbUser.role_id,
      role: dbUser.role_name,
      roleName: dbUser.role_name,
      roleScope: dbUser.role_scope,
      dateOfBirth: dbUser.date_of_birth,
      sex: dbUser.sex,
      createdAt: dbUser.created_at,
      accountStatus: dbUser.account_status,
      approvedAt: dbUser.approved_at,
      approvedBy: dbUser.approved_by,
      registrationRequestedAt: dbUser.registration_requested_at,
    };

    res.json({ success: true, user: userPayload });
    logger.log("me success", { userId: dbUser.id });
  } catch (error) {
    logger.error("me failed", { error: serializeError(error) });
    res.status(500).json({ error: "Error al obtener usuario" });
  } finally {
    logger.end();
  }
};

// ======================================================
// POST /api/auth/forgot-password
// ======================================================
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body as { email?: string };
    if (!email) return res.status(400).json({ error: "Falta email" });

    await ensurePasswordResetTable();

    const user = await findUserByEmail(email);
    if (!user) return res.status(200).json({ ok: true });

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await createPasswordResetToken(user.id, token, expiresAt);

    const resetUrl = `${process.env.FRONTEND_ORIGIN || "http://localhost:3000"}/reset-password?token=${token}`;
    console.log("?? Password reset link:", resetUrl);

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Error en forgot-password:", error);
    return res.status(500).json({ error: "Error interno" });
  }
};

// ======================================================
// POST /api/auth/reset-password
// ======================================================
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body as { token?: string; password?: string };
    if (!token || !password) return res.status(400).json({ error: "Falta token o password" });

    const entry = await findValidPasswordResetToken(token);
    if (!entry) return res.status(400).json({ error: "Token invalido o expirado" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await updateUserPasswordById(entry.user_id, hashedPassword);
    await markPasswordResetTokenUsed(token);

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Error en reset-password:", error);
    return res.status(500).json({ error: "Error interno" });
  }
};
