import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { formatDistanceToNow } from '@/lib/utils'

export default async function DashboardPage() {
    const user = await getCurrentUser()

    if (!user) {
        return null
    }

    // Fetch task summary
    const [
        totalTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
        criticalTasks,
        dueSoonTasks,
        recentTasks,
    ] = await Promise.all([
        prisma.task.count({ where: { userId: user.id } }),
        prisma.task.count({ where: { userId: user.id, status: 'PENDING' } }),
        prisma.task.count({
            where: { userId: user.id, status: 'IN_PROGRESS' },
        }),
        prisma.task.count({ where: { userId: user.id, status: 'COMPLETED' } }),
        prisma.task.count({
            where: {
                userId: user.id,
                priority: 'CRITICAL',
                status: { not: 'COMPLETED' },
            },
        }),
        prisma.task.count({
            where: {
                userId: user.id,
                dueDate: {
                    lte: new Date(Date.now() + 24 * 60 * 60 * 1000), // Due within 24 hours
                    gte: new Date(), // Not overdue
                },
                status: { not: 'COMPLETED' },
            },
        }),
        prisma.task.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
            take: 5,
        }),
    ])

    return (
        <div>
            <h1 className="neon-text">Dashboard</h1>

            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="stat card-custom bg-neutral">
                    <div className="stat-figure text-primary">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                        </svg>
                    </div>
                    <div className="stat-title">Total Tasks</div>
                    <div className="stat-value text-primary">{totalTasks}</div>
                </div>

                <div className="stat card-custom">
                    <div className="stat-figure text-secondary">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
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
                    </div>
                    <div className="stat-title">In Progress</div>
                    <div className="stat-value text-secondary">
                        {inProgressTasks}
                    </div>
                </div>

                <div className="stat card-custom">
                    <div className="stat-figure text-success">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <div className="stat-title">Completed</div>
                    <div className="stat-value text-success">
                        {completedTasks}
                    </div>
                </div>

                <div className="stat card-custom">
                    <div className="stat-figure text-error">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>
                    <div className="stat-title">Critical</div>
                    <div className="stat-value text-error">{criticalTasks}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="card-custom">
                    <div className="card-body">
                        <h2 className="card-title text-2xl">Recent Tasks</h2>
                        {recentTasks.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="table w-full">
                                    <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Priority</th>
                                            <th>Status</th>
                                            <th>Created</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentTasks.map((task) => (
                                            <tr key={task.id}>
                                                <td>
                                                    <Link
                                                        href={`/tasks/${task.id}`}
                                                        className="text-secondary hover:text-primary"
                                                    >
                                                        {task.title}
                                                    </Link>
                                                </td>
                                                <td>
                                                    <span
                                                        className={`badge badge-${
                                                            task.priority ===
                                                            'LOW'
                                                                ? 'info'
                                                                : task.priority ===
                                                                    'NORMAL'
                                                                  ? 'success'
                                                                  : task.priority ===
                                                                      'HIGH'
                                                                    ? 'warning'
                                                                    : 'error'
                                                        }`}
                                                    >
                                                        {task.priority}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span
                                                        className={`badge badge-${
                                                            task.status ===
                                                            'PENDING'
                                                                ? 'ghost'
                                                                : task.status ===
                                                                    'IN_PROGRESS'
                                                                  ? 'primary'
                                                                  : task.status ===
                                                                      'COMPLETED'
                                                                    ? 'success'
                                                                    : 'neutral'
                                                        }`}
                                                    >
                                                        {task.status.replace(
                                                            '_',
                                                            ' '
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="text-sm opacity-70">
                                                    {formatDistanceToNow(
                                                        task.createdAt
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-base-content/50 py-8 text-center">
                                <p>No tasks found. Create your first task!</p>
                            </div>
                        )}
                        <div className="card-actions mt-4 justify-end">
                            <Link
                                href="/tasks"
                                className="btn btn-outline btn-sm"
                            >
                                View All Tasks
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="card-custom">
                    <div className="card-body">
                        <h2 className="card-title text-2xl">Task Summary</h2>
                        <div className="px-4 py-6">
                            <div className="flex flex-col space-y-4">
                                <div>
                                    <div className="mb-1 flex justify-between">
                                        <span>Pending</span>
                                        <span>
                                            {pendingTasks} of {totalTasks}
                                        </span>
                                    </div>
                                    <progress
                                        className="progress progress-primary"
                                        value={
                                            totalTasks
                                                ? (pendingTasks / totalTasks) *
                                                  100
                                                : 0
                                        }
                                        max="100"
                                    ></progress>
                                </div>

                                <div>
                                    <div className="mb-1 flex justify-between">
                                        <span>In Progress</span>
                                        <span>
                                            {inProgressTasks} of {totalTasks}
                                        </span>
                                    </div>
                                    <progress
                                        className="progress progress-secondary"
                                        value={
                                            totalTasks
                                                ? (inProgressTasks /
                                                      totalTasks) *
                                                  100
                                                : 0
                                        }
                                        max="100"
                                    ></progress>
                                </div>

                                <div>
                                    <div className="mb-1 flex justify-between">
                                        <span>Completed</span>
                                        <span>
                                            {completedTasks} of {totalTasks}
                                        </span>
                                    </div>
                                    <progress
                                        className="progress progress-success"
                                        value={
                                            totalTasks
                                                ? (completedTasks /
                                                      totalTasks) *
                                                  100
                                                : 0
                                        }
                                        max="100"
                                    ></progress>
                                </div>
                            </div>
                        </div>
                        <div className="py-4">
                            <div className="flex flex-wrap gap-2">
                                <div className="badge badge-lg">
                                    <span className="text-error mr-1">⚠️</span>
                                    {criticalTasks} Critical
                                </div>
                                <div className="badge badge-lg">
                                    <span className="text-warning mr-1">
                                        ⏰
                                    </span>
                                    {dueSoonTasks} Due Soon
                                </div>
                            </div>
                        </div>
                        <div className="card-actions mt-4 justify-end">
                            <Link
                                href="/tasks/new"
                                className="btn-custom btn-sm"
                            >
                                Create New Task
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
