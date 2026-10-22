interface ProfileSummaryProps {
  name: string;
  email: string;
  username: string;
  role: string;
  plan: string;
}

export function ProfileSummary({ name, username, email, role, plan }: ProfileSummaryProps) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex items-center gap-4 border-b border-border p-6 sm:p-8">
      <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-primary/10 text-xl font-semibold text-primary">
        {initials}
      </div>
      <div className="min-w-0">
        <h2 className="truncate text-lg font-semibold">{name}</h2>
        <p className="truncate text-sm text-muted-foreground">@{username} ? {email}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {role === "admin" ? "Administrador" : "Usuário"}
          </span>
          <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-medium capitalize text-success">
            Plano {plan}
          </span>
        </div>
      </div>
    </div>
  );
}
