'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const signUpSchema = z
    .object({
        name: z
            .string()
            .min(2, { message: 'Name must be at least 2 characters' }),
        email: z.string().email({ message: 'Invalid email address' }),
        password: z
            .string()
            .min(8, { message: 'Password must be at least 8 characters' }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    })

type SignUpFormValues = z.infer<typeof signUpSchema>

export function SignUpForm() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpFormValues>({
        resolver: zodResolver(signUpSchema),
    })

    const onSubmit = async (data: SignUpFormValues) => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    password: data.password,
                }),
            })

            const result = await response.json()

            if (!response.ok) {
                setError(result.message || 'Something went wrong')
                setIsLoading(false)
                return
            }

            // Sign in the user after successful registration
            const signInResult = await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false,
            })

            if (signInResult?.error) {
                setError(
                    'Registration successful but could not sign in automatically'
                )
                setIsLoading(false)
                return
            }

            router.push('/dashboard')
            router.refresh()
        } catch (error) {
            setError('Something went wrong. Please try again.')
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
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
                        <span>{error}</span>
                    </div>
                </div>
            )}

            <div className="space-y-2">
                <label className="label-custom" htmlFor="name">
                    Name
                </label>
                <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    className={`input-custom w-full ${errors.name ? 'input-error' : ''}`}
                    {...register('name')}
                />
                {errors.name && (
                    <p className="form-error">{errors.name.message}</p>
                )}
            </div>

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
                <label className="label-custom" htmlFor="password">
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    className={`input-custom w-full ${
                        errors.password ? 'input-error' : ''
                    }`}
                    {...register('password')}
                />
                {errors.password && (
                    <p className="form-error">{errors.password.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <label className="label-custom" htmlFor="confirmPassword">
                    Confirm Password
                </label>
                <input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    className={`input-custom w-full ${
                        errors.confirmPassword ? 'input-error' : ''
                    }`}
                    {...register('confirmPassword')}
                />
                {errors.confirmPassword && (
                    <p className="form-error">
                        {errors.confirmPassword.message}
                    </p>
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
                        'Sign Up'
                    )}
                </button>
            </div>

            <div className="text-center text-sm">
                <p>
                    Already have an account?{' '}
                    <Link
                        href="/signin"
                        className="text-secondary hover:text-primary"
                    >
                        Sign In
                    </Link>
                </p>
            </div>
        </form>
    )
}
