import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import {
    formatDateTime,
    formatDate,
    formatStatus,
    formatPriority,
    isOverdue,
    getTimeRemaining,
} from '@/lib/utils'
import { DeleteTaskButton } from '@/components/tasks/DeleteTaskButton'
import { Metadata } from 'next'

type TaskDetailPageProps = {
    params: { id: string }
}

// Fix the params awaiting issue by correctly typing the function
export async function generateMetadata({
    params,
}: TaskDetailPageProps): Promise<Metadata> {
    const task = await prisma.task.findUnique({
        where: { id: params.id },
    })

    return {
        title: task
            ? `${task.title} - CyberTask`
            : 'Task Not Found - CyberTask',
        description:
            task?.description || 'Task details in your cyberpunk todo list',
    }
}

// Fix the params awaiting issue by correctly typing the function
export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
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
            <div className="mb-8 flex items-center justify-between">
                <h1 className="neon-text">{task.title}</h1>
                <div className="flex gap-2">
                    <Link
                        href={`/tasks/${task.id}/edit`}
                        className="btn btn-primary"
                    >
                        Edit
                    </Link>
                    <DeleteTaskButton taskId={task.id} />
                </div>
            </div>

            <div className="card-custom overflow-hidden">
                <div className="card-body p-6">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        <div>
                            {task.description ? (
                                <div className="mb-6">
                                    <h2 className="mb-2 text-xl font-semibold">
                                        Description
                                    </h2>
                                    <div className="bg-base-300 rounded-lg p-4 whitespace-pre-wrap">
                                        {task.description}
                                    </div>
                                </div>
                            ) : (
                                <div className="mb-6">
                                    <h2 className="mb-2 text-xl font-semibold">
                                        Description
                                    </h2>
                                    <div className="bg-base-300 rounded-lg p-4 italic opacity-50">
                                        No description provided
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold">
                                        Created:
                                    </span>
                                    <span>
                                        {formatDateTime(task.createdAt)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="font-semibold">
                                        Last Updated:
                                    </span>
                                    <span>
                                        {formatDateTime(task.updatedAt)}
                                    </span>
                                </div>

                                {task.dueDate && (
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold">
                                            Due Date:
                                        </span>
                                        <span
                                            className={
                                                isOverdue(task.dueDate) &&
                                                task.status !== 'COMPLETED'
                                                    ? 'text-error'
                                                    : ''
                                            }
                                        >
                                            {formatDateTime(task.dueDate)}
                                            {task.status !== 'COMPLETED' && (
                                                <span className="ml-2">
                                                    (
                                                    {isOverdue(task.dueDate)
                                                        ? 'Overdue'
                                                        : getTimeRemaining(
                                                              task.dueDate
                                                          )}
                                                    )
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className="flex flex-col space-y-4">
                                <div>
                                    <h2 className="mb-2 text-xl font-semibold">
                                        Status
                                    </h2>
                                    <div
                                        className={`badge badge-lg ${
                                            task.status === 'PENDING'
                                                ? 'badge-ghost'
                                                : task.status === 'IN_PROGRESS'
                                                  ? 'badge-primary'
                                                  : task.status === 'COMPLETED'
                                                    ? 'badge-success'
                                                    : 'badge-neutral'
                                        }`}
                                    >
                                        {formatStatus(task.status)}
                                    </div>
                                </div>

                                <div>
                                    <h2 className="mb-2 text-xl font-semibold">
                                        Priority
                                    </h2>
                                    <div
                                        className={`badge badge-lg ${
                                            task.priority === 'LOW'
                                                ? 'badge-info'
                                                : task.priority === 'NORMAL'
                                                  ? 'badge-success'
                                                  : task.priority === 'HIGH'
                                                    ? 'badge-warning'
                                                    : 'badge-error'
                                        }`}
                                    >
                                        {formatPriority(task.priority)}
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <div
                                        className="radial-progress text-primary"
                                        style={
                                            {
                                                '--value':
                                                    getCompletionPercentage(
                                                        task.status
                                                    ),
                                            } as any
                                        }
                                    >
                                        {getCompletionPercentage(task.status)}%
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="divider"></div>

                    <div className="card-actions justify-between">
                        <Link href="/tasks" className="btn btn-outline">
                            Back to Tasks
                        </Link>

                        {task.status !== 'COMPLETED' && (
                            <form
                                action={`/api/tasks/${task.id}/complete`}
                                method="post"
                            >
                                <button
                                    type="submit"
                                    className="btn btn-success"
                                >
                                    Mark as Completed
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function getCompletionPercentage(status: string): number {
    switch (status) {
        case 'PENDING':
            return 0
        case 'IN_PROGRESS':
            return 50
        case 'COMPLETED':
            return 100
        case 'ARCHIVED':
            return 100
        default:
            return 0
    }
}
