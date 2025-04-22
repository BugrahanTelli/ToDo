'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Task } from '@prisma/client'

const taskSchema = z.object({
    title: z
        .string()
        .min(3, { message: 'Title must be at least 3 characters' })
        .max(100),
    description: z.string().optional(),
    priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'CRITICAL']),
    status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED']),
    dueDate: z.string().optional().nullable(),
})

type TaskFormValues = z.infer<typeof taskSchema>

type TaskFormProps = {
    task?: Task
    isEditMode?: boolean
}

export function TaskForm({ task, isEditMode = false }: TaskFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TaskFormValues>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            title: task?.title || '',
            description: task?.description || '',
            priority: task?.priority || 'NORMAL',
            status: task?.status || 'PENDING',
            dueDate: task?.dueDate
                ? new Date(task.dueDate).toISOString().slice(0, 16)
                : '',
        },
    })

    const onSubmit = async (data: TaskFormValues) => {
        setIsLoading(true)
        setError(null)

        try {
            const endpoint = isEditMode
                ? `/api/tasks/${task?.id}`
                : '/api/tasks'

            const method = isEditMode ? 'PUT' : 'POST'

            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...data,
                    dueDate: data.dueDate
                        ? new Date(data.dueDate).toISOString()
                        : null,
                }),
            })

            const result = await response.json()

            if (!response.ok) {
                setError(result.message || 'Something went wrong')
                setIsLoading(false)
                return
            }

            router.push(isEditMode ? `/tasks/${task?.id}` : '/tasks')
            router.refresh()
        } catch (error) {
            console.error('Error submitting task:', error)
            setError('Something went wrong. Please try again.')
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="card-custom p-6">
            {error && (
                <div className="alert alert-error mb-6">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span>{error}</span>
                </div>
            )}

            <div className="space-y-6">
                <div className="form-control">
                    <label className="label-custom" htmlFor="title">
                        Title
                    </label>
                    <input
                        id="title"
                        type="text"
                        placeholder="Enter task title"
                        className={`input-custom w-full ${
                            errors.title ? 'input-error' : ''
                        }`}
                        {...register('title')}
                    />
                    {errors.title && (
                        <p className="form-error">{errors.title.message}</p>
                    )}
                </div>

                <div className="form-control">
                    <label className="label-custom" htmlFor="description">
                        Description
                    </label>
                    <textarea
                        id="description"
                        placeholder="Enter task description (optional)"
                        className={`textarea textarea-bordered bg-base-300 border-primary/30 focus:border-primary h-32 w-full ${
                            errors.description ? 'textarea-error' : ''
                        }`}
                        {...register('description')}
                    ></textarea>
                    {errors.description && (
                        <p className="form-error">
                            {errors.description.message}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="form-control">
                        <label className="label-custom" htmlFor="priority">
                            Priority
                        </label>
                        <select
                            id="priority"
                            className={`select select-bordered bg-base-300 border-primary/30 focus:border-primary w-full ${
                                errors.priority ? 'select-error' : ''
                            }`}
                            {...register('priority')}
                        >
                            <option value="LOW">Low</option>
                            <option value="NORMAL">Normal</option>
                            <option value="HIGH">High</option>
                            <option value="CRITICAL">Critical</option>
                        </select>
                        {errors.priority && (
                            <p className="form-error">
                                {errors.priority.message}
                            </p>
                        )}
                    </div>

                    <div className="form-control">
                        <label className="label-custom" htmlFor="status">
                            Status
                        </label>
                        <select
                            id="status"
                            className={`select select-bordered bg-base-300 border-primary/30 focus:border-primary w-full ${
                                errors.status ? 'select-error' : ''
                            }`}
                            {...register('status')}
                        >
                            <option value="PENDING">Pending</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="ARCHIVED">Archived</option>
                        </select>
                        {errors.status && (
                            <p className="form-error">
                                {errors.status.message}
                            </p>
                        )}
                    </div>
                </div>

                <div className="form-control">
                    <label className="label-custom" htmlFor="dueDate">
                        Due Date (Optional)
                    </label>
                    <input
                        id="dueDate"
                        type="datetime-local"
                        className={`input-custom w-full ${
                            errors.dueDate ? 'input-error' : ''
                        }`}
                        {...register('dueDate')}
                    />
                    {errors.dueDate && (
                        <p className="form-error">{errors.dueDate.message}</p>
                    )}
                </div>

                <div className="mt-8 flex justify-end space-x-2">
                    <Link
                        href={isEditMode ? `/tasks/${task?.id}` : '/tasks'}
                        className="btn btn-outline"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        className="btn-custom"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="loading loading-spinner loading-sm"></span>
                        ) : isEditMode ? (
                            'Update Task'
                        ) : (
                            'Create Task'
                        )}
                    </button>
                </div>
            </div>
        </form>
    )
}
