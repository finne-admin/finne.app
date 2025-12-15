import React from 'react'

export const SessionContextProvider: React.FC<{ supabaseClient?: any; children: React.ReactNode }>=({ children })=>{
  return <>{children}</>
}

export function useUser(): any {
  return null
}

