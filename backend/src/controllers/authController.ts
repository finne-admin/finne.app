import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { findUserByEmail, insertUser, getUserWithPassword } from "../db/queries/userQueries";
import { getPool } from "../config/dbManager";
import { createRefreshToken, findRefreshToken, revokeRefreshToken } from "../db/queries/refreshTokenQueries";
import { v4 as uuidv4 } from "uuid";
import { createToken, verifyToken as verifyJwtToken } from "../utils/jwt";

// ======================================================
// 📍 POST /api/auth/register
// ======================================================
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, dateOfBirth, sex } = req.body;
    if (!email || !password || !firstName || !lastName)
      return res.status(400).json({ error: "Faltan campos obligatorios." });

    const existingUser = await findUserByEmail(email);
    if (existingUser)
      return res.status(400).json({ error: "El correo ya está registrado." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await insertUser({
      firstName,
      lastName,
      email,
      hashedPassword,
      dateOfBirth,
      sex,
      role: "user",
    });

    res.status(201).json({
      success: true,
      message: "Usuario registrado correctamente",
      user: newUser,
    });
  } catch (error: any) {
    console.error("❌ Error en registerUser:", error);
    res.status(500).json({ error: "Error al registrar usuario." });
  }
};

// ======================================================
// 📍 POST /api/auth/register-admin
// ======================================================
export const registerAdmin = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, dateOfBirth, sex } = req.body;
    if (!email || !password || !firstName || !lastName)
      return res.status(400).json({ error: "Faltan campos obligatorios." });

    const existingUser = await findUserByEmail(email);
    if (existingUser)
      return res.status(400).json({ error: "El correo ya está registrado." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await insertUser({
      firstName,
      lastName,
      email,
      hashedPassword,
      dateOfBirth,
      sex,
      role: "admin",
    });

    res.status(201).json({
      success: true,
      message: "Administrador registrado correctamente",
      user: newUser,
    });
  } catch (error: any) {
    console.error("❌ Error en registerAdmin:", error);
    res.status(500).json({ error: "Error al registrar administrador." });
  }
};

// ======================================================
// 📍 POST /api/auth/login
// ======================================================
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Faltan credenciales." });

    const user = await getUserWithPassword(email);
    if (!user) return res.status(400).json({ error: "Credenciales inválidas." });

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword)
      return res.status(400).json({ error: "Credenciales inválidas." });

    const token = createToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // 🔹 Crear Refresh Token persistente y guardarlo en cookie HttpOnly
    try {
      const refreshToken = uuidv4();
      await createRefreshToken(user.id, refreshToken);

      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
      });
    } catch (cookieErr) {
      console.error("❌ Error creando refresh token:", cookieErr);
      // No bloqueamos el login si falla almacenar el refresh token
    }

    // Devolver token al frontend
    res.json({
      success: true,
      message: "Inicio de sesión correcto",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ error: "Error interno" });
  }
};

// ======================================================
// 📍 POST /api/auth/verify
// ======================================================
export const verifyToken = async (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: "Token requerido." });

  try {
    const decoded = verifyJwtToken(token);
    if (!decoded) {
      return res
        .status(401)
        .json({ valid: false, error: "Token inválido o expirado." });
    }

    res.json({ valid: true, user: decoded });
  } catch (error) {
    console.error("❌ Error al verificar token:", error);
    res.status(500).json({ error: "Error al verificar el token." });
  }
};


export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.refresh_token;
    if (!token) return res.status(401).json({ error: "Falta refresh token" });

    const existing = await findRefreshToken(token);
    if (!existing) return res.status(401).json({ error: "Refresh token inválido" });

    // Buscar el usuario de este token
    const pool = await getPool();
    const { rows } = await pool.query(`SELECT * FROM users WHERE id = $1`, [existing.user_id]);
    const user = rows[0];
    if (!user) return res.status(401).json({ error: "Usuario no encontrado para refresh token" });

    // Crear nuevo access token
    const accessToken = createToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({ success: true, accessToken });
  } catch (err) {
    console.error("Error en refresh:", err);
    res.status(500).json({ error: "Error al refrescar token" });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
  const token = req.cookies?.refresh_token;
  if (token) await revokeRefreshToken(token);

  res.clearCookie("refresh_token");
  res.json({ success: true, message: "Sesión cerrada correctamente" });
  } catch (err) {
    console.error("Error en logout:", err);
    res.status(500).json({ error: "Error al cerrar sesión" });
  }
};