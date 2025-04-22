import { TaskList } from '@/components/tasks/TaskList'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Tasks - CyberTask',
    description: 'Manage your tasks in cyberpunk style',
}

export default async function TasksPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const user = await getCurrentUser()

    if (!user) {
        return null
    }

    // Parse query parameters for filtering
    const status = searchParams.status as string | undefined
    const priority = searchParams.priority as string | undefined

    // Build where clause for filtering
    const where: any = {
        userId: user.id,
    }

    if (status) {
        where.status = status
    }

    if (priority) {
        where.priority = priority
    }

    const tasks = await prisma.task.findMany({
        where,
        orderBy: {
            createdAt: 'desc',
        },
    })

    return (
        <div>
            <h1 className="neon-text mb-8">Your Tasks</h1>

            <div className="mb-8 flex flex-wrap gap-4">
                <a
                    href="/tasks"
                    className={`badge badge-lg ${
                        !status && !priority ? 'badge-primary' : 'badge-outline'
                    }`}
                >
                    All
                </a>
                <a
                    href="/tasks?status=PENDING"
                    className={`badge badge-lg ${
                        status === 'PENDING' ? 'badge-ghost' : 'badge-outline'
                    }`}
                >
                    Pending
                </a>
                <a
                    href="/tasks?status=IN_PROGRESS"
                    className={`badge badge-lg ${
                        status === 'IN_PROGRESS'
                            ? 'badge-primary'
                            : 'badge-outline'
                    }`}
                >
                    In Progress
                </a>
                <a
                    href="/tasks?status=COMPLETED"
                    className={`badge badge-lg ${
                        status === 'COMPLETED'
                            ? 'badge-success'
                            : 'badge-outline'
                    }`}
                >
                    Completed
                </a>
                <a
                    href="/tasks?priority=CRITICAL"
                    className={`badge badge-lg ${
                        priority === 'CRITICAL'
                            ? 'badge-error'
                            : 'badge-outline'
                    }`}
                >
                    Critical
                </a>
            </div>

            <TaskList
                tasks={tasks}
                title={
                    status
                        ? `${status.replace('_', ' ')} Tasks`
                        : priority
                          ? `${priority} Priority Tasks`
                          : 'All Tasks'
                }
                emptyMessage={
                    status || priority
                        ? 'No tasks found with the selected filter'
                        : "You don't have any tasks yet"
                }
            />
        </div>
    )
}
