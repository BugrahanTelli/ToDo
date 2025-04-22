import { TaskCard } from '@/components/tasks/TaskCard'
import Link from 'next/link'
import type { Task } from '@prisma/client'

type TaskListProps = {
    tasks: Task[]
    title?: string
    emptyMessage?: string
    showCreateButton?: boolean
}

export function TaskList({
    tasks,
    title = 'Tasks',
    emptyMessage = 'No tasks found',
    showCreateButton = true,
}: TaskListProps) {
    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <h2 className="neon-text text-2xl font-bold">{title}</h2>
                {showCreateButton && (
                    <Link href="/tasks/new" className="btn-custom btn-sm">
                        Create Task
                    </Link>
                )}
            </div>

            {tasks.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {tasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </div>
            ) : (
                <div className="card-custom p-12 text-center">
                    <p className="text-base-content/60 mb-4">{emptyMessage}</p>
                    {showCreateButton && (
                        <div className="flex justify-center">
                            <Link href="/tasks/new" className="btn-custom">
                                Create Your First Task
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
