import Link from "next/link";
import { ArrowLeft, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: ReactNode;
  description: ReactNode;
  eyebrow?: string;
  icon?: LucideIcon;
  backHref?: string;
  showBack?: boolean;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  eyebrow,
  icon: Icon,
  backHref = "/dashboard",
  showBack = true,
  actions,
  className = "",
}: PageHeaderProps) {
  return (
    <header className={`flex flex-col justify-between gap-5 sm:flex-row sm:items-start ${className}`}>
      <div className="flex min-w-0 items-start gap-3">
        {showBack && (
          <Link
            href={backHref}
            aria-label="Voltar"
            title="Voltar"
            className="mt-1 inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground shadow-sm transition hover:border-primary/50 hover:bg-secondary hover:text-foreground"
          >
            <ArrowLeft size={17} />
          </Link>
        )}
        <div className="min-w-0">
          {eyebrow && (
            <p className="mb-1.5 flex items-center gap-2 text-sm font-medium text-primary">
              {Icon && <Icon size={16} aria-hidden="true" />}
              {eyebrow}
            </p>
          )}
          <h1 className="break-words text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
      </div>
      {actions && <div className="flex shrink-0 items-center gap-3 sm:pt-1">{actions}</div>}
    </header>
  );
}
