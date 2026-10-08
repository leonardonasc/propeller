import Link from "next/link"

export default function PublicFooter() {
    return (
        <footer className="border-t border-border">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <Link
                        href="/"
                        className="font-semibold tracking-tight"
                    >
                        Propeller
                    </Link>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Construindo, melhorando e compartilhando o que vem pela frente.
                    </p>
                </div>

                <nav className="flex items-center gap-5 text-sm text-muted-foreground">
                    <Link
                        href="/historia"
                        className="transition-colors hover:text-foreground"
                    >
                        História
                    </Link>

                    <Link
                        href="/roadmap"
                        className="transition-colors hover:text-foreground"
                    >
                        Roadmap
                    </Link>
                </nav>

                <p className="text-sm text-muted-foreground">
                    © 2026 Propeller
                </p>
            </div>
        </footer>
    )
}
