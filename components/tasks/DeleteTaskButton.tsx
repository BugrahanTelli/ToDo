'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type DeleteTaskButtonProps = {
    taskId: string
}

export function DeleteTaskButton({ taskId }: DeleteTaskButtonProps) {
    const router = useRouter()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const openModal = () => setIsModalOpen(true)
    const closeModal = () => setIsModalOpen(false)

    const handleDelete = async () => {
        setIsDeleting(true)
        setError(null)

        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.message || 'Failed to delete task')
            }

            closeModal()
            router.push('/tasks')
            router.refresh()
        } catch (error) {
            console.error('Error deleting task:', error)
            setError(
                error instanceof Error ? error.message : 'An error occurred'
            )
            setIsDeleting(false)
        }
    }

    return (
        <>
            <button onClick={openModal} className="btn btn-error">
                Delete
            </button>

            {isModalOpen && (
                <div className="bg-base-300/80 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
                    <div className="modal-box bg-neutral">
                        <h3 className="mb-4 text-lg font-bold">
                            Are you sure you want to delete this task?
                        </h3>
                        <p className="mb-6">
                            This action cannot be undone. The task will be
                            permanently deleted.
                        </p>

                        {error && (
                            <div className="alert alert-error mb-4">
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

                        <div className="modal-action">
                            <button
                                onClick={closeModal}
                                className="btn btn-outline"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="btn btn-error"
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <span className="loading loading-spinner loading-sm"></span>
                                ) : (
                                    'Delete'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
