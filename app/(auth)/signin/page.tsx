import { SignInForm } from '@/components/auth/SignInForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Sign In - CyberTask',
    description: 'Sign in to CyberTask to manage your tasks',
}

export default function SignInPage() {
    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1
                        className="neon-text cyber-glitch"
                        data-text="CyberTask"
                    >
                        CyberTask
                    </h1>
                    <p className="text-base-content/70 mt-2">
                        Sign in to access your tasks
                    </p>
                </div>
                <div className="card-custom p-6">
                    <SignInForm />
                </div>
            </div>
        </div>
    )
}
