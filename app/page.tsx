import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function HomePage() {
    const user = await getCurrentUser()

    if (user) {
        redirect('/dashboard')
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="from-base-100 to-base-300 relative overflow-hidden bg-gradient-to-b py-20">
                    <div className="relative z-10 container mx-auto px-4">
                        <div className="grid items-center gap-12 md:grid-cols-2">
                            <div className="text-center md:text-left">
                                <h1
                                    className="neon-text cyber-glitch mb-6 text-5xl font-bold"
                                    data-text="CyberTask"
                                >
                                    CyberTask
                                </h1>
                                <p className="text-base-content/80 mb-8 text-xl">
                                    Manage your tasks in a cyberpunk world.
                                    Streamline your workflow, prioritize what
                                    matters, and never miss a deadline.
                                </p>
                                <div className="flex flex-col justify-center gap-4 sm:flex-row md:justify-start">
                                    <Link
                                        href="/signup"
                                        className="btn-custom btn-lg"
                                    >
                                        Get Started
                                    </Link>
                                    <Link
                                        href="/signin"
                                        className="btn btn-outline btn-lg"
                                    >
                                        Sign In
                                    </Link>
                                </div>
                            </div>
                            <div className="hidden md:block">
                                <div className="bg-neutral cyber-border relative flex h-96 w-full items-center justify-center overflow-hidden rounded-lg shadow-2xl">
                                    <div className="absolute inset-0 opacity-20">
                                        <div className="bg-grid-pattern absolute top-0 left-0 h-full w-full"></div>
                                    </div>
                                    <div className="relative z-10 p-8">
                                        <div className="mockup-code w-full text-left">
                                            <pre data-prefix="$">
                                                <code>
                                                    initialize cybertask.exe
                                                </code>
                                            </pre>
                                            <pre
                                                data-prefix=">"
                                                className="text-warning"
                                            >
                                                <code>System loading...</code>
                                            </pre>
                                            <pre
                                                data-prefix=">"
                                                className="text-success"
                                            >
                                                <code>
                                                    Welcome to CyberTask v1.0
                                                </code>
                                            </pre>
                                            <pre data-prefix="1">
                                                <code>
                                                    [ ] Finish project proposal
                                                </code>
                                            </pre>
                                            <pre data-prefix="2">
                                                <code>
                                                    [x] Update neural implants
                                                </code>
                                            </pre>
                                            <pre data-prefix="3">
                                                <code>
                                                    [ ] Meet with fixer @ 22:00
                                                </code>
                                            </pre>
                                            <pre data-prefix="4">
                                                <code>
                                                    [ ] Hack into mainframe
                                                </code>
                                            </pre>
                                            <pre data-prefix="$">
                                                <code>
                                                    add_task &quot;Escape the
                                                    system&quot;
                                                </code>
                                            </pre>
                                            <pre
                                                data-prefix=">"
                                                className="text-success"
                                            >
                                                <code>
                                                    Task added successfully
                                                </code>
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Background decorations */}
                    <div className="bg-primary/10 absolute top-20 left-10 h-64 w-64 rounded-full blur-3xl filter"></div>
                    <div className="bg-secondary/10 absolute right-10 bottom-10 h-96 w-96 rounded-full blur-3xl filter"></div>
                </section>

                {/* Features Section */}
                <section className="bg-base-100 py-16">
                    <div className="container mx-auto px-4">
                        <h2 className="neon-text mb-12 text-center text-3xl font-bold">
                            Key Features
                        </h2>
                        <div className="grid gap-8 md:grid-cols-3">
                            <div className="card-custom p-6">
                                <div className="mb-4 flex items-center">
                                    <div className="bg-primary/20 mr-3 flex h-10 w-10 items-center justify-center rounded-full">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="text-primary h-6 w-6"
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
                                    <h3 className="text-xl font-semibold">
                                        Task Management
                                    </h3>
                                </div>
                                <p className="text-base-content/70">
                                    Create, organize, and track your tasks with
                                    ease. Set priorities, deadlines, and
                                    categories to stay on top of your workload.
                                </p>
                            </div>

                            <div className="card-custom p-6">
                                <div className="mb-4 flex items-center">
                                    <div className="bg-secondary/20 mr-3 flex h-10 w-10 items-center justify-center rounded-full">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="text-secondary h-6 w-6"
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
                                    <h3 className="text-xl font-semibold">
                                        Time Tracking
                                    </h3>
                                </div>
                                <p className="text-base-content/70">
                                    Track the time spent on each task. Analyze
                                    your productivity patterns and optimize your
                                    workflow for maximum efficiency.
                                </p>
                            </div>

                            <div className="card-custom p-6">
                                <div className="mb-4 flex items-center">
                                    <div className="bg-accent/20 mr-3 flex h-10 w-10 items-center justify-center rounded-full">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="text-accent h-6 w-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M13 10V3L4 14h7v7l9-11h-7z"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold">
                                        Priority System
                                    </h3>
                                </div>
                                <p className="text-base-content/70">
                                    Assign priorities to your tasks ranging from
                                    low to critical. Focus on what matters most
                                    and never miss important deadlines.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="from-primary/20 to-secondary/20 bg-gradient-to-r py-16">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="neon-text mb-6 text-3xl font-bold">
                            Ready to boost your productivity?
                        </h2>
                        <p className="text-base-content/80 mx-auto mb-8 max-w-2xl text-xl">
                            Join CyberTask today and experience a new way of
                            managing your tasks in style. Your cyberpunk
                            productivity journey starts here.
                        </p>
                        <Link href="/signup" className="btn-custom btn-lg">
                            Get Started Now
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}
