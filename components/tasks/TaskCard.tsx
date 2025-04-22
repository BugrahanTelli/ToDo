import Link from 'next/link'
import {
    formatDate,
    formatStatus,
    formatPriority,
    isOverdue,
    getTimeRemaining,
} from '@/lib/utils'
import type { Task } from '@prisma/client'

type TaskCardProps = {
    task: Task
}

export function TaskCard({ task }: TaskCardProps) {
    return (
        <div
            className={`card-custom overflow-hidden task-priority-${task.priority.toLowerCase()}`}
        >
            <div className="card-body p-6">
                <div className="flex items-start justify-between">
                    <h3 className="card-title mb-2 text-xl">
                        <Link
                            href={`/tasks/${task.id}`}
                            className="hover:text-primary transition-colors"
                        >
                            {task.title}
                        </Link>
                    </h3>
                    <div className="flex gap-2">
                        <span
                            className={`badge badge-${
                                task.priority === 'LOW'
                                    ? 'info'
                                    : task.priority === 'NORMAL'
                                      ? 'success'
                                      : task.priority === 'HIGH'
                                        ? 'warning'
                                        : 'error'
                            }`}
                        >
                            {formatPriority(task.priority)}
                        </span>
                        <span
                            className={`badge badge-${
                                task.status === 'PENDING'
                                    ? 'ghost'
                                    : task.status === 'IN_PROGRESS'
                                      ? 'primary'
                                      : task.status === 'COMPLETED'
                                        ? 'success'
                                        : 'neutral'
                            }`}
                        >
                            {formatStatus(task.status)}
                        </span>
                    </div>
                </div>

                {task.description && (
                    <p className="text-base-content/70 mb-4 line-clamp-2">
                        {task.description}
                    </p>
                )}

                <div className="text-base-content/60 mt-auto flex flex-wrap items-center justify-between text-sm">
                    <div className="flex items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-1 h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        <span>Created: {formatDate(task.createdAt)}</span>
                    </div>

                    {task.dueDate && (
                        <div
                            className={`flex items-center ${isOverdue(task.dueDate) ? 'text-error' : ''}`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="mr-1 h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <span>
                                {isOverdue(task.dueDate)
                                    ? 'Overdue: '
                                    : 'Due: '}
                                {formatDate(task.dueDate)}
                                {task.status !== 'COMPLETED' && (
                                    <span className="ml-1">
                                        (
                                        {isOverdue(task.dueDate)
                                            ? 'Overdue'
                                            : getTimeRemaining(task.dueDate)}
                                        )
                                    </span>
                                )}
                            </span>
                        </div>
                    )}
                </div>

                <div className="card-actions mt-4 justify-end">
                    <Link
                        href={`/tasks/${task.id}`}
                        className="btn btn-sm btn-outline"
                    >
                        View Details
                    </Link>
                    <Link
                        href={`/tasks/${task.id}/edit`}
                        className="btn btn-sm btn-primary"
                    >
                        Edit
                    </Link>
                </div>
            </div>
        </div>
    )
}
