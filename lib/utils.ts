export function formatDate(date: Date | string | null): string {
    if (!date) return 'No date'

    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}

export function formatDateTime(date: Date | string | null): string {
    if (!date) return 'No date'

    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    })
}

export function formatDistanceToNow(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date
    const now = new Date()

    const diffInMilliseconds = now.getTime() - d.getTime()
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000)
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    const diffInHours = Math.floor(diffInMinutes / 60)
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInSeconds < 60) {
        return 'just now'
    } else if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`
    } else if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`
    } else if (diffInDays < 7) {
        return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`
    } else {
        return formatDate(d)
    }
}

export function getPriorityColor(priority: string): string {
    switch (priority) {
        case 'LOW':
            return 'info'
        case 'NORMAL':
            return 'success'
        case 'HIGH':
            return 'warning'
        case 'CRITICAL':
            return 'error'
        default:
            return 'neutral'
    }
}

export function getStatusColor(status: string): string {
    switch (status) {
        case 'PENDING':
            return 'ghost'
        case 'IN_PROGRESS':
            return 'primary'
        case 'COMPLETED':
            return 'success'
        case 'ARCHIVED':
            return 'neutral'
        default:
            return 'neutral'
    }
}

export function formatStatus(status: string): string {
    return status
        .replace('_', ' ')
        .toLowerCase()
        .replace(/\b\w/g, (l) => l.toUpperCase())
}

export function formatPriority(priority: string): string {
    return priority.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase())
}

export function classNames(
    ...classes: (string | boolean | undefined)[]
): string {
    return classes.filter(Boolean).join(' ')
}

export function isOverdue(dueDate: Date | string | null): boolean {
    if (!dueDate) return false

    const d = typeof dueDate === 'string' ? new Date(dueDate) : dueDate
    return d < new Date()
}

export function getTimeRemaining(dueDate: Date | string | null): string {
    if (!dueDate) return 'No deadline'

    const d = typeof dueDate === 'string' ? new Date(dueDate) : dueDate
    const now = new Date()

    if (d < now) {
        return 'Overdue'
    }

    const diffInMilliseconds = d.getTime() - now.getTime()
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000)
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    const diffInHours = Math.floor(diffInMinutes / 60)
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInDays > 0) {
        return `${diffInDays} day${diffInDays !== 1 ? 's' : ''}`
    } else if (diffInHours > 0) {
        return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''}`
    } else {
        return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''}`
    }
}
