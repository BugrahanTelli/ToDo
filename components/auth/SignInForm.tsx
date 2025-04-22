'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const signInSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(1, { message: 'Password is required' }),
})

type SignInFormValues = z.infer<typeof signInSchema>

export function SignInForm() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignInFormValues>({
        resolver: zodResolver(signInSchema),
    })

    const onSubmit = async (data: SignInFormValues) => {
        setIsLoading(true)
        setErrorMessage(null)

        try {
            const result = await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false,
            })

            if (result?.error) {
                setErrorMessage('Invalid email or password')
                setIsLoading(false)
                return
            }

            router.push('/dashboard')
            router.refresh()
        } catch (error) {
            setErrorMessage('Something went wrong. Please try again.')
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {errorMessage && (
                <div className="alert alert-error shadow-lg">
                    <div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 flex-shrink-0"
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
                        <span>{errorMessage}</span>
                    </div>
                </div>
            )}

            <div className="space-y-2">
                <label className="label-custom" htmlFor="email">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className={`input-custom w-full ${
                        errors.email ? 'input-error' : ''
                    }`}
                    {...register('email')}
                />
                {errors.email && (
                    <p className="form-error">{errors.email.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label className="label-custom" htmlFor="password">
                        Password
                    </label>
                    <a
                        href="#"
                        className="text-secondary hover:text-primary text-xs"
                    >
                        Forgot password?
                    </a>
                </div>
                <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    className={`input-custom w-full ${
                        errors.password ? 'input-error' : ''
                    }`}
                    {...register('password')}
                />
                {errors.password && (
                    <p className="form-error">{errors.password.message}</p>
                )}
            </div>

            <div>
                <button
                    type="submit"
                    className="btn-custom w-full"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                        'Sign In'
                    )}
                </button>
            </div>

            <div className="text-center text-sm">
                <p>
                    Don&apos;t have an account?{' '}
                    <Link
                        href="/signup"
                        className="text-secondary hover:text-primary"
                    >
                        Sign Up
                    </Link>
                </p>
            </div>
        </form>
    )
}
