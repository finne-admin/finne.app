import { createBrowserClient } from '@supabase/ssr'

// Return a dummy client if env vars are not set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const createClient = () => {
  return createBrowserClient(supabaseUrl || '', supabaseAnonKey || '')
}

