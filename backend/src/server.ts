import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import wistiaRoutes from "./routes/wistiaRoutes";
import tallyRoutes from "./routes/tallyRoutes";
import { getPool } from "./config/dbManager"
import authRoutes from "./routes/authRoutes"

dotenv.config()

const app = express()

// CORS con credenciales para permitir cookies en peticiones cross-site
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000"
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
  })
)

// Parseo de JSON y cookies (para leer refresh_token)
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth", authRoutes)
app.use("/api/wistia", wistiaRoutes);
app.use("/api/tally", tallyRoutes);

// Ruta simple de prueba
app.get("/", (_, res) => {
  res.send("Backend running 🟢")
})

// 🔹 Iniciar el servidor
const PORT = process.env.PORT || 4000
const server = app.listen(PORT, async () => {
  console.log(`✅ Backend on http://localhost:${PORT}`)

  // Conectar una vez al iniciar el backend
  try {
    const pool = await getPool()
    const { rows } = await pool.query("SELECT NOW()")
    console.log("🟢 DB ready:", rows[0])
  } catch (err) {
    console.error("❌ Error inicial al conectar con la DB:", err)
  }
})

// 🔻 Cerrar el pool y el servidor al finalizar el proceso
async function gracefulShutdown() {
  console.log("\n🛑 Cerrando servidor y conexión a la base de datos...")

  try {
    const pool = await getPool()
    await pool.end()
    console.log("✅ Pool cerrado correctamente.")
  } catch (err) {
    console.error("⚠️ Error al cerrar el pool:", err)
  }

  server.close(() => {
    console.log("🟣 Servidor Express detenido.")
    process.exit(0)
  })
}

// Detectar señales de cierre
process.on("SIGINT", gracefulShutdown)   // Ctrl + C
process.on("SIGTERM", gracefulShutdown)  // Terminación del sistema
