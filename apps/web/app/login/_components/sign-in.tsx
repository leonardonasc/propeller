"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { authClient } from "../../../lib/auth-client";
import { toast } from "sonner";


const signInSchema = z.object({
    email: z.string().email({ message: "Email inválido" }),
    password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
});

type SignInSchema = z.infer<typeof signInSchema>;

export function LoginForm() {

    const { register, handleSubmit, formState } = useForm<SignInSchema>({
        resolver: zodResolver(signInSchema),
    });

    async function handleSignIn({ email, password }: SignInSchema) {
        try {
            const { error } = await authClient.signIn.email({
                email,
                password,
                callbackURL: "/dashboard",
            });

            if (error) {
                toast.error(error.message || "Não foi possível realizar o login.");
                return;
            }

            toast.success("Login realizado com sucesso!");
        } catch (error) {
            console.error("Error during sign-in:", error);
            toast.error("Não foi possível realizar o login.");
        }
    }

    return (
        <form
            onSubmit={handleSubmit(handleSignIn)}
            className="mx-auto w-full max-w-md space-y-5"
        >

            <div className="space-y-2">
                <label
                    htmlFor="email"
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
                    htmlFor="password"
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
                Entrar
            </button>
        </form>
    );
}