import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export async function POST(req: Request) {
  const { userId } = await req.json()

  if (!userId) {
    return NextResponse.json({ error: "Falta el userId" }, { status: 400 })
  }

  try {
    // 1. Eliminar tokens de notificación primero (para no perder la referencia)
    const { error: tokenError } = await supabaseAdmin
      .from("fcm_tokens")
      .delete()
      .eq("user_id", userId)

    if (tokenError) throw new Error("Error eliminando tokens: " + tokenError.message)

    // 2. Eliminar de tabla users
    const { error: userError } = await supabaseAdmin
      .from("users")
      .delete()
      .eq("id", userId)

    if (userError) throw new Error("Error eliminando en users: " + userError.message)

    // 3. Eliminar del sistema de autenticación (auth)
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
