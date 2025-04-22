import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/db'

const userSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
})

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        const { name, email, password } = userSchema.parse(body)

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return NextResponse.json(
                { message: 'User with this email already exists' },
                { status: 409 }
            )
        }

        // Hash the password
        const hashedPassword = await hash(password, 12)

        // Create the user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        })

        // Return the user without the password
        const userWithoutPassword = {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }

        return NextResponse.json(
            { user: userWithoutPassword, message: 'User created successfully' },
            { status: 201 }
        )
    } catch (error) {
        console.error('Error in signup route:', error)

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { message: 'Invalid input data', errors: error.errors },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        )
    }
}
