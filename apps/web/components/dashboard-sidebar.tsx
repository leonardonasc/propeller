"use client";

import {
  CalendarDays,
  ChevronDown,
  ChevronRight,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Settings,
  X,
} from "lucide-react";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { authClient } from "../lib/auth-client";

const navigationItems = [
  {
    label: "Visão geral",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Projetos",
    href: "/projects",
    icon: FolderKanban,
  },
  {
    label: "Calendário",
    href: "/calendar",
    icon: CalendarDays,
  },
  {
    label: "Configurações",
    href: "/settings",
    icon: Settings,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userName, setUserName] = useState("Meu perfil");

  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (session?.user?.name) {
      setUserName(session.user.name);
    }
  }, [session]);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await authClient.signOut();
      router.replace("/login?logout=success");
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
      toast.error("Não foi possível sair. Tente novamente.");
    }
  };

  const handleNavigation = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  const initials =
    userName !== "Meu perfil"
      ? userName
        .split(" ")
        .map((name) => name[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
      : "PL";

  return (
    <>
      {/* Mobile menu */}
      <button
        type="button"
        aria-label="Abrir menu"
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-4 z-10 grid size-9 place-items-center rounded-lg border border-slate-800 bg-[#0b1120] text-slate-300 shadow-lg shadow-black/10 transition hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-400 md:hidden"
      >
        <Menu size={18} />
      </button>

      {/* Mobile backdrop */}
      {isOpen && (
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-66 shrink-0 flex-col",
          "border-r border-slate-800/80 bg-[#0b1120] px-4 py-7",
          "transition-transform duration-300 ease-out",
          "md:static md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {/* Top */}
        <div className="px-2">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <span className="grid size-7 place-items-center rounded-lg bg-blue-600 text-[11px] font-extrabold tracking-tight text-white shadow-lg shadow-blue-600/20">
              P
            </span>

            <span className="text-[17px] font-bold tracking-tight text-white">
              Propeller
            </span>
          </div>

          {/* Close */}
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setIsOpen(false)}
            className="absolute right-4 top-6 grid size-8 place-items-center rounded-md text-slate-500 transition hover:bg-slate-800 hover:text-slate-200 md:hidden"
          >
            <X size={18} />
          </button>

          {/* New project */}
          <button
            type="button"
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2.5 text-[13px] font-semibold text-white shadow-lg shadow-blue-600/15 transition hover:bg-blue-500 hover:shadow-blue-500/20"
          >
            <Plus size={16} />
            Novo projeto
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-9" aria-label="Navegação principal">
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600">
            Workspace
          </p>

          <div className="space-y-1">
            {navigationItems.map(({ label, href, icon: Icon }) => {
              const isActive = pathname === href;

              return (
                <button
                  type="button"
                  key={href}
                  onClick={() => handleNavigation(href)}
                  className={[
                    "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] transition",
                    isActive
                      ? "bg-blue-500/10 font-semibold text-blue-400"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200",
                  ].join(" ")}
                >
                  <Icon
                    size={16}
                    className={
                      isActive
                        ? "text-blue-400"
                        : "text-slate-500 transition group-hover:text-slate-300"
                    }
                  />

                  <span>{label}</span>

                  {isActive && (
                    <ChevronRight
                      size={14}
                      className="ml-auto text-blue-500"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Bottom */}
        <div className="mt-auto">
          {/* Plan */}
          <div className="mb-4 flex items-center gap-2.5 rounded-lg border border-slate-800 bg-slate-900/50 px-2.5 py-3">
            <div className="grid size-7 shrink-0 place-items-center rounded-md bg-blue-500/10 text-blue-400">
              ✦
            </div>

            <div>
              <strong className="block text-[11px] font-semibold text-slate-200">
                Plano gratuito
              </strong>

              <span className="mt-0.5 block text-[10px] text-slate-500">
                3 projetos ativos
              </span>
            </div>
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsUserMenuOpen((open) => !open)}
              aria-expanded={isUserMenuOpen}
              className="group flex w-full items-center gap-2.5 rounded-lg px-1.5 py-2 text-left transition hover:bg-slate-800/60"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                {initials}
              </span>

              <span className="min-w-0 flex-1">
                <strong className="block truncate text-xs font-semibold text-slate-200">
                  {userName}
                </strong>

                <small className="mt-0.5 block truncate text-[12px] text-slate-500">
                  Plano gratuito
                </small>
              </span>

              <ChevronDown
                size={15}
                className={[
                  "shrink-0 text-slate-500 transition-transform",
                  isUserMenuOpen ? "rotate-180 text-blue-400" : "",
                ].join(" ")}
              />
            </button>

            {/* Dropdown */}
            {isUserMenuOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-full rounded-lg border border-slate-800 bg-[#0d1424] p-1.5 shadow-xl shadow-black/30">
                {/* TODO: fazer uma lista com as opções de tema */}

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2.5 text-left text-xs font-medium text-slate-400 transition hover:bg-red-500/10 hover:text-red-400 disabled:cursor-wait disabled:opacity-50"
                >
                  <LogOut size={15} />

                  <span>
                    {isLoggingOut ? "Saindo..." : "Sair da conta"}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
