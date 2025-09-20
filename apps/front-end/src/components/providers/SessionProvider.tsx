"use client"

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react"
import { ReactNode } from "react"

interface SessionProviderProps {
  children: ReactNode
}

export function SessionProvider({ children }: SessionProviderProps) {
  return (
    <NextAuthSessionProvider
      baseUrl={process.env.NEXTAUTH_URL || "http://localhost:3000"}
    >
      {children}
    </NextAuthSessionProvider>
  )
}