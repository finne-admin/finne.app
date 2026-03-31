import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import wistiaRoutes from "./routes/wistiaRoutes"
import tallyRoutes from "./routes/tallyRoutes"
import { getPool } from "./config/dbManager"
import authRoutes from "./routes/authRoutes"
import questionnairesRoutes from "./routes/questionnairesRoutes"
import quotaRoutes from "./routes/quotaRoutes";
import statisticsRoutes from "./routes/statisticsRoutes";
import activePauseRoutes from "./routes/activePauseRoutes";
import tagsRoutes from "./routes/tagsRoutes"
import xpRoutes from "./routes/xpRoutes"
import exerciseRoutes from "./routes/exerciseRoutes"
import favoriteRoutes from "./routes/favoriteRoutes"
import milestonesRoutes from "./routes/milestonesRoutes"
import userRoutes from "./routes/userRoutes"
import notificationRoutes from "./routes/notificationRoutes"
import reportRoutes from "./routes/reportRoutes"
import announcementRoutes from "./routes/announcementRoutes"
import adminRoutes from "./routes/adminRoutes"
import achievementRoutes from "./routes/achievementRoutes"
import socialRoutes from "./routes/socialRoutes"
import systemRoutes from "./routes/systemRoutes"

dotenv.config()

const app = express()

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "https://finne-beta.online";

app.use(
  cors({
    origin: [FRONTEND_ORIGIN, "https://www.finne-beta.online"],
    credentials: true,
  })
);

// Parseo de JSON y cookies (para leer refresh_token)
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth", authRoutes)
app.use("/api/wistia", wistiaRoutes)
app.use("/api/tally", tallyRoutes)
app.use("/api/quota", quotaRoutes);
app.use("/api/statistics", statisticsRoutes);
app.use("/api/active-pauses", activePauseRoutes);
app.use("/api/tags", tagsRoutes)
app.use("/api/xp", xpRoutes)
app.use("/api/exercises", exerciseRoutes)
app.use("/api/exercises/favorites", favoriteRoutes)
app.use("/api/questionnaires", questionnairesRoutes)
app.use("/api/user", userRoutes)
app.use("/api/notifications", notificationRoutes)
app.use("/api/reports", reportRoutes)
app.use("/api/announcements", announcementRoutes)
app.use("/api/milestones", milestonesRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/achievements", achievementRoutes)
app.use("/api/social", socialRoutes)
app.use("/api/system", systemRoutes)

// Ruta simple de prueba
app.get("/", (_, res) => {
  res.send("Backend running 🟢")
})

// 🔹 Iniciar el servidor
const PORT = parseInt(process.env.PORT || "8080", 10)

const server = app.listen(PORT, "0.0.0.0", async () => {
  console.log(`✅ Backend running on 0.0.0.0:${PORT}`)

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
