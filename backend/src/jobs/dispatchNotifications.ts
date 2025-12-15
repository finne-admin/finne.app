import "dotenv/config"
import { dispatchPendingNotifications } from "../services/notificationDispatcher"
import { getPool } from "../config/dbManager"

async function main() {
  try {
    const result = await dispatchPendingNotifications()
    console.log("Dispatcher result:", result)
  } catch (error) {
    console.error("Error dispatching notifications:", error)
    process.exitCode = 1
  } finally {
    try {
      const pool = await getPool()
      await pool.end()
    } catch (poolError) {
      console.error("Error closing DB pool:", poolError)
    }

    const exitCode = process.exitCode ?? 0
    process.exit(exitCode)
  }
}

main()
