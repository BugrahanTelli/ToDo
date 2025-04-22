import { notFound } from 'next/navigation'
import { TaskForm } from '@/components/tasks/TaskForm'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { Metadata } from 'next'

type EditTaskPageProps = {
    params: { id: string }
}

export async function generateMetadata({
    params,
}: EditTaskPageProps): Promise<Metadata> {
    const task = await prisma.task.findUnique({
        where: { id: params.id },
    })

    return {
        title: task
            ? `Edit ${task.title} - CyberTask`
            : 'Edit Task - CyberTask',
        description: 'Edit your task in CyberTask',
    }
}

export default async function EditTaskPage({ params }: EditTaskPageProps) {
    const user = await getCurrentUser()

    if (!user) {
        return null
    }

    const task = await prisma.task.findUnique({
        where: { id: params.id },
    })

    if (!task) {
        notFound()
    }

    // Check if the task belongs to the current user
    if (task.userId !== user.id) {
        notFound()
    }

    return (
        <div>
            <h1 className="neon-text mb-8">Edit Task</h1>
            <TaskForm task={task} isEditMode={true} />
        </div>
    )
}
