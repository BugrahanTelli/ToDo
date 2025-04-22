'use client'

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'

type SessionProviderProps = {
    children: React.ReactNode
}

export const SessionProvider = ({ children }: SessionProviderProps) => {
    return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
}
