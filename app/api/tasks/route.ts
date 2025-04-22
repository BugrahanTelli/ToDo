import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const taskSchema = z.object({
    title: z.string().min(3).max(100),
    description: z.string().optional(),
    priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'CRITICAL']),
    status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED']),
    dueDate: z.string().nullable().optional(),
})

// GET /api/tasks - Get all tasks for the current user
export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            )
        }

        const tasks = await prisma.task.findMany({
            where: {
                userId: session.user.id,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        return NextResponse.json(tasks)
    } catch (error) {
        console.error('Error fetching tasks:', error)

        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        )
    }
}

// POST /api/tasks - Create a new task
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            )
        }

        const body = await req.json()
        const validatedData = taskSchema.parse(body)

        const task = await prisma.task.create({
            data: {
                ...validatedData,
                dueDate: validatedData.dueDate
                    ? new Date(validatedData.dueDate)
                    : null,
                userId: session.user.id,
            },
        })

        return NextResponse.json(task, { status: 201 })
    } catch (error) {
        console.error('Error creating task:', error)

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
