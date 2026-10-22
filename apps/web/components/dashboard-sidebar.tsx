"use client";

import {
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Crosshair,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Settings,
  ShieldCheck,
  User,
  X,
} from "lucide-react";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { authClient } from "../lib/auth-client";
import Link from "next/link";
import { ThemePicker } from "./theme-picker";
import { API_BASE_PATH } from "../app/src/services/api";

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
    disabled: true,
  },
];

const otherMenuItems = [
  {
    label: "Meu perfil",
    href: "/profile",
    icon: User
  },
  {
    label: "Roadmap",
    href: "/roadmap",
    icon: Crosshair
  }
]

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [activeProjectCount, setActiveProjectCount] = useState<number | null>(null);

  const { data: session } = authClient.useSession();
  const userName = session?.user.name ?? "Meu perfil";
  const userPlan = session?.user.plan ?? "free";
  const isAdmin = session?.user.role === "admin";

  useEffect(() => {
    let cancelled = false;
    const loadCount = () => {
      fetch(`${API_BASE_PATH}/projects`, { credentials: "include", cache: "no-store" })
        .then((response) => response.ok ? response.json() as Promise<unknown[]> : [])
        .then((projects) => { if (!cancelled) setActiveProjectCount(projects.length); })
        .catch(() => { if (!cancelled) setActiveProjectCount(null); });
    };
    loadCount();
    window.addEventListener("propeller:projects-changed", loadCount);
    return () => { cancelled = true; window.removeEventListener("propeller:projects-changed", loadCount); };
  }, [pathname]);

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
        className="fixed left-4 top-4 z-10 grid size-9 place-items-center rounded-lg border border-border bg-card text-card-foreground shadow-lg shadow-black/10 transition hover:border-primary/40 hover:bg-primary/10 hover:text-primary md:hidden"
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
          "fixed inset-y-0 left-0 z-50 flex w-66 shrink-0 flex-col overflow-y-auto",
          "border-r border-border bg-card px-4 py-7 text-card-foreground",
          "transition-transform duration-300 ease-out",
          "md:static md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {/* Top */}
        <div className="px-2">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <span className="grid size-7 place-items-center rounded-lg bg-primary text-[11px] font-extrabold tracking-tight text-primary-foreground shadow-lg shadow-primary/20">
              P
            </span>

            <span className="text-[17px] font-bold tracking-tight text-card-foreground">
              Propeller
            </span>
          </div>

          {/* Close */}
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setIsOpen(false)}
            className="absolute right-4 top-6 grid size-8 place-items-center rounded-md text-muted-foreground transition hover:bg-secondary hover:text-foreground md:hidden"
          >
            <X size={18} />
          </button>

          {/* New project */}
        </div>

        {/* Navigation */}
        <nav className="mt-9" aria-label="Navegação principal">
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
            Workspace
          </p>

          <div className="space-y-1">
            {navigationItems.map(({ label, href, icon: Icon, disabled }) => {
              const isActive = pathname === href;

              return (
                <button
                  type="button"
                  key={href}
                  onClick={() => handleNavigation(href)}
                  disabled={disabled}
                  className={[
                    "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] transition",
                    isActive
                      ? "bg-primary/10 font-semibold text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                    disabled
                      ? "cursor-not-allowed opacity-50"
                      : "",
                  ].join(" ")}
                >
                  <Icon
                    size={16}
                    className={
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground transition group-hover:text-foreground"
                    }
                  />

                  <span>{label}</span>

                  {isActive && (
                    <ChevronRight
                      size={14}
                      className="ml-auto text-primary"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        <nav>
          <p className="mb-2 mt-6 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
            Outros
          </p>
          <div className="space-y-1">
            {otherMenuItems.map(({ label, href, icon: Icon }) => (
              <button
                type="button"
                key={href}
                onClick={() => handleNavigation(href)}
                className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] text-muted-foreground transition hover:bg-secondary hover:text-foreground"
              >
                <Icon size={16} className="text-muted-foreground transition group-hover:text-foreground" />
                <span>{label}</span>
              </button>
            ))}
            {isAdmin && (
              <button
                type="button"
                onClick={() => handleNavigation("/admin")}
                className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] transition ${pathname.startsWith("/admin") ? "bg-primary/10 font-semibold text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
              >
                <ShieldCheck size={16} />
                <span>Administração</span>
                {pathname.startsWith("/admin") && <ChevronRight size={14} className="ml-auto text-primary" />}
              </button>
            )}
          </div>
        </nav>

        {/* Bottom */}
        <div className="mt-auto">
          {/* Plan */}
          <div className="mb-4 flex items-center gap-2.5 rounded-lg border border-border bg-secondary/50 px-2.5 py-3">
            <div className="grid size-7 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
              ✦
            </div>

            <div>
              <strong className="block text-[11px] font-semibold text-card-foreground">
                Plano {userPlan === "premium" ? "Premium" : "Free"}
              </strong>

              <span className="mt-0.5 block text-[10px] text-muted-foreground">
                {activeProjectCount === null ? "Projetos ativos" : `${activeProjectCount} ${activeProjectCount === 1 ? "projeto ativo" : "projetos ativos"}`}
              </span>
            </div>
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsUserMenuOpen((open) => !open)}
              aria-expanded={isUserMenuOpen}
              className="group flex w-full items-center gap-2.5 rounded-lg px-1.5 py-2 text-left transition hover:bg-secondary"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {initials}
              </span>

              <span className="min-w-0 flex-1">
                <strong className="block truncate text-xs font-semibold text-card-foreground">
                  {userName}
                </strong>

                <small className="mt-0.5 block truncate text-[12px] text-muted-foreground">
                  {isAdmin ? "Administrador" : "Membro"} · {userPlan === "premium" ? "Premium" : "Free"}
                </small>
              </span>

              <ChevronDown
                size={15}
                className={[
                  "shrink-0 text-muted-foreground transition-transform",
                  isUserMenuOpen ? "rotate-180 text-primary" : "",
                ].join(" ")}
              />
            </button>

            {/* Dropdown */}
            {isUserMenuOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-full rounded-lg border border-border bg-popover p-1.5 text-popover-foreground shadow-xl shadow-black/30">
                {/* TODO: fazer uma lista com as opções de tema */}
                {/* lista de opções */}
                <div className="mb-1.5 flex flex-col gap-1.5 border-b border-border pb-1.5">
                  <Link href="/profile"
                    className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2.5 text-left text-xs font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                  >
                    <User size={15} />
                    <span>Meu perfil</span>
                  </Link>

                </div>
                <div className="mb-1.5 flex flex-col gap-1.5 border-b border-border pb-1.5">
                <ThemePicker />
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2.5 text-left text-xs font-medium text-muted-foreground transition hover:bg-danger/10 hover:text-danger disabled:cursor-wait disabled:opacity-50"
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
