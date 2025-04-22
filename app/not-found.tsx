import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="from-base-300 to-base-100 flex min-h-screen items-center justify-center bg-gradient-to-br">
            <div className="card-custom mx-auto max-w-lg p-8 text-center">
                <h1
                    className="neon-text cyber-glitch mb-4 text-5xl font-bold"
                    data-text="404"
                >
                    404
                </h1>
                <h2 className="mb-6 text-2xl font-bold">Signal Lost</h2>
                <p className="text-base-content/70 mb-8">
                    The neural connection failed. The data you&apos;re looking
                    for cannot be found in the network. The system might have
                    been corrupted or the data was never uploaded to begin with.
                </p>
                <div className="mockup-code mb-8 text-left">
                    <pre data-prefix="$">
                        <code>locate_resource.exe</code>
                    </pre>
                    <pre data-prefix=">" className="text-error">
                        <code>ERROR: Resource not found in the system</code>
                    </pre>
                    <pre data-prefix=">" className="text-warning">
                        <code>Attempting to reconnect to mainframe...</code>
                    </pre>
                    <pre data-prefix=">" className="text-success">
                        <code>
                            Connection established. Redirecting to safe zone.
                        </code>
                    </pre>
                </div>
                <Link href="/" className="btn-custom">
                    Return to Safe Zone
                </Link>
            </div>
        </div>
    )
}
