import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PropellerIcon from "../components/propeller-icon";

export default function NotFound() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-[#080d1a] px-6 text-white">
            <div className="w-full max-w-md text-center">
                <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600">
                    <PropellerIcon />
                </div>

                <p className="mb-3 text-sm font-medium tracking-widest text-blue-500 uppercase">
                    Erro 404
                </p>

                <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                    Página não encontrada
                </h1>

                <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-slate-400">
                    A página que você está procurando não existe ou foi movida para outro
                    lugar.
                </p>

                <Link
                    href="/"
                    className="mt-8 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-500"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Voltar para o início
                </Link>
            </div>
        </main>
    );
}