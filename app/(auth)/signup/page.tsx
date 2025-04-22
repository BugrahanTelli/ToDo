import { SignUpForm } from '@/components/auth/SignUpForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Sign Up - CyberTask',
    description: 'Create a new account on CyberTask',
}

export default function SignUpPage() {
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
                        Create a new account to get started
                    </p>
                </div>
                <div className="card-custom p-6">
                    <SignUpForm />
                </div>
            </div>
        </div>
    )
}
