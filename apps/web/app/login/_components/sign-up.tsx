"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { authClient } from "../../../lib/auth-client";
import { toast } from "sonner";



const signUpSchema = z.object({
    name: z.string().min(1, { message: "O nome é obrigatório" }),
    email: z.string().email({ message: "Email inválido" }),
    password: z.string().min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
});

type SignUpSchema = z.infer<typeof signUpSchema>;

export function RegisterForm() {

    const { register, handleSubmit, formState } = useForm<SignUpSchema>({
        resolver: zodResolver(signUpSchema),
    });

    async function handleSignUp({ name, email, password }: SignUpSchema) {
        try {
            const { error } = await authClient.signUp.email({
                name,
                email,
                password,
                callbackURL: "/dashboard",
            });

            if (error) {
                toast.error(error.message || "Não foi possível criar a conta.");
                return;
            }

            toast.success("Conta criada com sucesso!");
        } catch (error) {
            console.error("Error during sign-up:", error);
            toast.error("Não foi possível criar a conta.");
        }
    }

    return (
        <form
            onSubmit={handleSubmit(handleSignUp)}
            className="mx-auto w-full max-w-md space-y-5"
        >
            <div className="mb-7">
                <h2 className="text-2xl font-semibold tracking-tight text-white">
                    Criar conta
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                    Crie sua conta para começar a organizar seus projetos.
                </p>
            </div>

            <div className="space-y-2">
                <label
                    htmlFor="name"
                    className="text-sm font-medium text-slate-300"
                >
                    Nome
                </label>

                <input
                    type="text"
                    placeholder="Seu nome"
                    {...register("name", { required: "Nome é obrigatório" })}
                    className="h-11 w-full rounded-lg border border-slate-800 bg-[#0d1424] px-3.5 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                    required
                />
                {formState.errors.name && (
                    <p role="alert" className="text-xs text-red-400">
                        {formState.errors.name.message}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <label
                    htmlFor="register-email"
                    className="text-sm font-medium text-slate-300"
                >
                    Email
                </label>

                <input
                    type="email"
                    placeholder="voce@email.com"
                    {...register("email", { required: "Email é obrigatório" })}
                    className="h-11 w-full rounded-lg border border-slate-800 bg-[#0d1424] px-3.5 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                    required
                />
                {formState.errors.email && (
                    <p role="alert" className="text-xs text-red-400">
                        {formState.errors.email.message}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <label
                    htmlFor="register-password"
                    className="text-sm font-medium text-slate-300"
                >
                    Senha
                </label>

                <input
                    type="password"
                    placeholder="••••••••"
                    {...register("password", { required: "Senha é obrigatória" })}
                    className="h-11 w-full rounded-lg border border-slate-800 bg-[#0d1424] px-3.5 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                    required
                />
                {formState.errors.password && (
                    <p role="alert" className="text-xs text-red-400">
                        {formState.errors.password.message}
                    </p>
                )}
            </div>

            <button
                type="submit"
                disabled={formState.isSubmitting}
                className="h-11 w-full rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
                Criar conta
            </button>
        </form>
    );
}

