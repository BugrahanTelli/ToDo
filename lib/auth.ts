import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function getCurrentUser() {
    const session = await getServerSession(authOptions)
    return session?.user
}

// Add type definition for the session
declare module 'next-auth' {
    interface Session {
        user: {
            id: string
            name?: string | null
            email?: string | null
            image?: string | null
        }
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string
    }
}
