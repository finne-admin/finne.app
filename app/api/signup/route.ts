import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export const dynamic = "force-dynamic"

interface RegistrationData {
  firstName: string
  lastName: string
  email: string
  password: string
  dateOfBirth: string
  sex: string
}

export async function POST(request: Request) {
  try {
    const data: RegistrationData = await request.json()

    // Validación
    if (!data.email || !data.password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    if (new Date(data.dateOfBirth) > new Date()) {
      return NextResponse.json(
        { error: "La fecha de nacimiento no puede ser en el futuro" },
        { status: 400 }
      )
    }

    // Comprobación de usuario existente
    const { data: existingUser } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", data.email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: "Este correo electrónico ya está registrado" },
        { status: 409 }
      )
    }

    // Crear usuario en auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
          date_of_birth: data.dateOfBirth,
          sex: data.sex,
          role: "user"
        }
      }
    })

    if (authError) throw authError
    if (!authData.user) throw new Error("User creation failed")

    // ✅ Avatares disponibles
    const avatarOptions = [
        "https://cgpqlasmzpabwrubvhyl.supabase.co/storage/v1/object/public/avatars//avatar1.png",
        "https://cgpqlasmzpabwrubvhyl.supabase.co/storage/v1/object/public/avatars//avatar2.png",
        "https://cgpqlasmzpabwrubvhyl.supabase.co/storage/v1/object/public/avatars//avatar3.png",
        "https://cgpqlasmzpabwrubvhyl.supabase.co/storage/v1/object/public/avatars//avatar4.png",
        "https://cgpqlasmzpabwrubvhyl.supabase.co/storage/v1/object/public/avatars//avatar5.png",
    ]
    const randomAvatar = avatarOptions[Math.floor(Math.random() * avatarOptions.length)]

    // ✅ Insertar en tabla `users`
    const { error: insertError } = await supabaseAdmin.from("users").insert({
      id: authData.user.id,
      email: data.email,
      first_name: data.firstName,
      last_name: data.lastName,
      date_of_birth: data.dateOfBirth,
      sex: data.sex,
      role: "user",
      avatar_url: randomAvatar
    })

    if (insertError) throw insertError

    return NextResponse.json({
      success: true,
      userId: authData.user.id,
      message: "¡Registro exitoso! Por favor verifica tu correo electrónico."
    })

  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Error interno del servidor durante el registro" },
      { status: 500 }
    )
  }
}
