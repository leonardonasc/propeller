import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Entrar ou criar conta",
  description: "Acesse sua conta Propeller ou crie uma conta para organizar seus projetos.",
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
