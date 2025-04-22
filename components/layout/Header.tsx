'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'

export function Header() {
    const { data: session } = useSession()
    const pathname = usePathname()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    const isActive = (path: string) => {
        return pathname === path ? 'bg-base-300' : ''
    }

    return (
        <header className="bg-neutral text-neutral-content border-primary/20 border-b shadow-lg">
            <div className="navbar container mx-auto">
                <div className="navbar-start">
                    <div className="dropdown">
                        <label
                            tabIndex={0}
                            className="btn btn-ghost lg:hidden"
                            onClick={toggleMenu}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h8m-8 6h16"
                                />
                            </svg>
                        </label>
                        {isMenuOpen && (
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content bg-base-300 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                            >
                                {session && (
                                    <>
                                        <li>
                                            <Link
                                                href="/dashboard"
                                                className={isActive(
                                                    '/dashboard'
                                                )}
                                                onClick={toggleMenu}
                                            >
                                                Dashboard
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href="/tasks"
                                                className={isActive('/tasks')}
                                                onClick={toggleMenu}
                                            >
                                                Tasks
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href="/tasks/new"
                                                className={isActive(
                                                    '/tasks/new'
                                                )}
                                                onClick={toggleMenu}
                                            >
                                                New Task
                                            </Link>
                                        </li>
                                    </>
                                )}
                            </ul>
                        )}
                    </div>
                    <Link
                        href={session ? '/dashboard' : '/'}
                        className="btn btn-ghost neon-text text-xl"
                    >
                        CyberTask
                    </Link>
                </div>

                <div className="navbar-center hidden lg:flex">
                    {session && (
                        <ul className="menu menu-horizontal px-1">
                            <li>
                                <Link
                                    href="/dashboard"
                                    className={isActive('/dashboard')}
                                >
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/tasks"
                                    className={isActive('/tasks')}
                                >
                                    Tasks
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/tasks/new"
                                    className={isActive('/tasks/new')}
                                >
                                    New Task
                                </Link>
                            </li>
                        </ul>
                    )}
                </div>

                <div className="navbar-end">
                    {session ? (
                        <div className="dropdown dropdown-end">
                            <label
                                tabIndex={0}
                                className="btn btn-ghost btn-circle avatar"
                            >
                                <div className="border-primary w-10 rounded-full border-2">
                                    {session.user?.image ? (
                                        <div className="relative h-full w-full">
                                            <Image
                                                src={session.user.image}
                                                alt={
                                                    session.user.name ||
                                                    'User avatar'
                                                }
                                                fill
                                                sizes="40px"
                                                className="rounded-full"
                                            />
                                        </div>
                                    ) : (
                                        <div className="bg-primary/20 flex h-full w-full items-center justify-center text-xl">
                                            {session.user?.name
                                                ? session.user.name
                                                      .charAt(0)
                                                      .toUpperCase()
                                                : 'U'}
                                        </div>
                                    )}
                                </div>
                            </label>
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content bg-base-300 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                            >
                                <li>
                                    <Link
                                        href="/profile"
                                        className="justify-between"
                                    >
                                        Profile
                                        <span className="badge badge-primary">
                                            New
                                        </span>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/settings">Settings</Link>
                                </li>
                                <li>
                                    <button
                                        onClick={() =>
                                            signOut({ callbackUrl: '/' })
                                        }
                                    >
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <Link
                                href="/signin"
                                className="btn btn-sm btn-outline"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/signup"
                                className="btn btn-sm btn-custom"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
