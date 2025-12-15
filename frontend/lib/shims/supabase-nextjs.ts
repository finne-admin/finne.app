// Minimal shim to remove Supabase at build time
export function createClientComponentClient(): any {
  const noop = async (..._args: any[]) => ({ data: null, error: null })
  const chain = () => ({ eq: () => chain(), single: () => noop(), maybeSingle: () => noop(), select: () => chain() })
  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      setSession: noop,
      resetPasswordForEmail: noop,
      updateUser: noop,
      resend: noop,
      signOut: noop,
    },
    from: () => ({ select: () => chain(), delete: () => ({ eq: () => ({ throwOnError: async () => ({}) }) }) }),
    rpc: noop,
    channel: () => ({ on: () => ({ subscribe: () => ({ unsubscribe: () => {} }) }) }),
  }
}

