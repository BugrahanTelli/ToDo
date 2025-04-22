import { TaskForm } from '@/components/tasks/TaskForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Create Task - CyberTask',
    description: 'Create a new task in your cyberpunk todo list',
}

export default function NewTaskPage() {
    return (
        <div>
            <h1 className="neon-text mb-8">Create New Task</h1>
            <TaskForm />
        </div>
    )
}
