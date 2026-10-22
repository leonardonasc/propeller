import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Propeller | Organize projetos e tarefas", template: "%s | Propeller" },
  description: "Organize projetos, tarefas e rotina em um só lugar. Transforme ideias em progresso com o Propeller.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  );
}
