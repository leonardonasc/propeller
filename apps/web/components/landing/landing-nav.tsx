import { useState } from "react";
import PropellerIcon from "../propeller-icon";
import { ArrowRight, ChevronRight, Menu, X } from "lucide-react";

const navigation = [
    { label: "História", href: "#historia" },
    { label: "Como funciona", href: "#como-funciona" },
    { label: "Recursos", href: "#recursos" },
    { label: "Preços", href: "#precos" },
];

interface LandingNavProps {
    session?: any;
    isPending?: boolean;
    router?: any;
    onStart: () => void;
}

export default function LandingNav({ session, isPending, router, onStart }: LandingNavProps) {

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <header className="fixed inset-x-0 top-0 z-50">
            <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
                <nav className="flex h-14 items-center justify-between rounded-2xl border border-white/10 bg-[#080d1a]/80 px-3 shadow-lg shadow-black/10 backdrop-blur-xl sm:px-4">
                    <a
                        href="#inicio"
                        className="flex items-center gap-2.5 rounded-lg px-2 py-1.5"
                    >
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                            <PropellerIcon size={17} />
                        </span>

                        <span className="text-sm font-semibold tracking-tight">
                            Propeller
                        </span>
                    </a>

                    {/* Desktop navigation */}
                    <div className="hidden items-center gap-1 md:flex">
                        {navigation.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                className="rounded-lg px-3 py-2 text-xs font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>

                    {/* Desktop actions */}
                    <div className="hidden items-center gap-2 md:flex">
                        {!session && (
                            <button
                                type="button"
                                onClick={() => router.push("/login")}
                                className="rounded-lg px-3 py-2 text-xs font-medium text-slate-400 transition hover:text-white"
                            >
                                Entrar
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={onStart}
                            disabled={isPending}
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60"
                        >
                            {session ? "Dashboard" : "Começar"}

                            <ArrowRight size={14} />
                        </button>
                    </div>

                    {/* Mobile button */}
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen((open) => !open)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 transition hover:bg-white/5 md:hidden"
                        aria-label="Abrir menu"
                        aria-expanded={mobileMenuOpen}
                    >
                        {mobileMenuOpen ? (
                            <X size={19} />
                        ) : (
                            <Menu size={19} />
                        )}
                    </button>
                </nav>

                {/* Mobile navigation */}
                {mobileMenuOpen && (
                    <div className="mt-2 rounded-2xl border border-white/10 bg-[#0d1424] p-2 shadow-xl md:hidden">
                        {navigation.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                onClick={closeMobileMenu}
                                className="flex items-center justify-between rounded-xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                            >
                                {item.label}

                                <ChevronRight
                                    size={15}
                                    className="text-slate-600"
                                />
                            </a>
                        ))}

                        <div className="my-2 h-px bg-white/5" />

                        {!session && (
                            <button
                                type="button"
                                onClick={() => {
                                    closeMobileMenu();
                                    router.push("/login");
                                }}
                                className="w-full rounded-xl px-4 py-3 text-left text-sm text-slate-300"
                            >
                                Entrar
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={() => {
                                closeMobileMenu();
                                onStart();
                            }}
                            disabled={isPending}
                            className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold disabled:opacity-60"
                        >
                            {session
                                ? "Ir para dashboard"
                                : "Começar agora"}

                            <ArrowRight size={15} />
                        </button>
                    </div>
                )}
            </div>
        </header>
    )
}