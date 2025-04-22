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

// GET /api/tasks/[id] - Get a specific task
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            )
        }

        const task = await prisma.task.findUnique({
            where: {
                id: params.id,
            },
        })

        if (!task) {
            return NextResponse.json(
                { message: 'Task not found' },
                { status: 404 }
            )
        }

        // Check if the task belongs to the current user
        if (task.userId !== session.user.id) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 403 }
            )
        }

        return NextResponse.json(task)
    } catch (error) {
        console.error('Error fetching task:', error)

        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        )
    }
}

// PUT /api/tasks/[id] - Update a task
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Check if task exists and belongs to user
        const existingTask = await prisma.task.findUnique({
            where: {
                id: params.id,
            },
        })

        if (!existingTask) {
            return NextResponse.json(
                { message: 'Task not found' },
                { status: 404 }
            )
        }

        if (existingTask.userId !== session.user.id) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 403 }
            )
        }

        const body = await req.json()
        const validatedData = taskSchema.parse(body)

        const updatedTask = await prisma.task.update({
            where: {
                id: params.id,
            },
            data: {
                ...validatedData,
                dueDate: validatedData.dueDate
                    ? new Date(validatedData.dueDate)
                    : null,
            },
        })

        return NextResponse.json(updatedTask)
    } catch (error) {
        console.error('Error updating task:', error)

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

// DELETE /api/tasks/[id] - Delete a task
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Check if task exists and belongs to user
        const existingTask = await prisma.task.findUnique({
            where: {
                id: params.id,
            },
        })

        if (!existingTask) {
            return NextResponse.json(
                { message: 'Task not found' },
                { status: 404 }
            )
        }

        if (existingTask.userId !== session.user.id) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 403 }
            )
        }

        await prisma.task.delete({
            where: {
                id: params.id,
            },
        })

        return NextResponse.json(
            { message: 'Task deleted successfully' },
            { status: 200 }
        )
    } catch (error) {
        console.error('Error deleting task:', error)

        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        )
    }
}
