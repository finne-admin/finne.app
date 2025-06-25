import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export async function POST(req: Request) {
  const { userId } = await req.json()

  if (!userId) {
    return NextResponse.json({ error: "Falta el userId" }, { status: 400 })
  }

  try {
    // 1. Eliminar registros relacionados
    const tablesToClean = [
      "exercise_favorites",
      "exercise_satisfaction",
      "notification_preferences",
      "fcm_tokens",
      "users"
    ]

    for (const table of tablesToClean) {
      const { error } = await supabaseAdmin
        .from(table)
        .delete()
        .eq("user_id", userId)
      if (error && table !== "users") {
        throw new Error(`Error eliminando en ${table}: ${error.message}`)
      }
      // excepción: en 'users' la columna es 'id', no 'user_id'
      if (table === "users") {
        const { error: userError } = await supabaseAdmin
          .from("users")
          .delete()
          .eq("id", userId)
        if (userError) throw new Error("Error eliminando en users: " + userError.message)
      }
    }

    // 2. Eliminar del sistema de autenticación (auth)
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)
    if (authError) throw new Error("Error eliminando en Auth: " + authError.message)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Error al eliminar usuario:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error desconocido" },
      { status: 500 }
    )
  }
}
