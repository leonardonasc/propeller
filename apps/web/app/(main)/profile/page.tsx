import { headers } from "next/headers";
import { CalendarDays, Mail, ShieldCheck, UserRound } from "lucide-react";
import { getUser } from "../../src/services/users";
import { ProfileSummary } from "./_components/profile-summary";
import { ProfileEditor } from "./_components/profile-editor";
import { PageHeader } from "../_components/page-header";

export default async function ProfilePage() {
  const cookie = (await headers()).get("cookie") || "";
  const user = await getUser({ cookie });

  if (!user) return <p className="text-muted-foreground">Usuário não encontrado.</p>;

  const accountDetails = [
    { label: "Nome", value: user.name, icon: UserRound },
    { label: "E-mail", value: user.email, icon: Mail },
    { label: "Permissão", value: user.role === "admin" ? "Administrador" : "Usuário", icon: ShieldCheck },
    {
      label: "Membro desde",
      value: new Date(user.createdAt).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
      icon: CalendarDays,
    },
  ];

  return (
    <div className="w-full space-y-8">
      <PageHeader
        eyebrow="Sua conta"
        icon={UserRound}
        title="Meu perfil"
        description="Gerencie suas informações pessoais e consulte os dados da sua conta."
      />

      <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl shadow-black/5">
        <ProfileSummary name={user.name} username={user.username} email={user.email} role={user.role} plan={user.plan} />
        <div className="space-y-5 p-6 sm:p-8">
          <ProfileEditor initialName={user.name} initialUsername={user.username} />
          <div>
            <h2 className="text-sm font-semibold">Informações da conta</h2>
            <p className="mt-1 text-xs text-muted-foreground">Dados associados ao seu acesso.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {accountDetails.map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex min-w-0 items-start gap-3 rounded-xl border border-border/70 bg-background/40 p-4">
                <Icon className="mt-0.5 size-4 shrink-0 text-primary" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="mt-1 wrap-break-word text-sm font-medium">{value}</p>
                  {label === "E-mail" && (
                    <p className={`mt-1 text-xs ${user.emailVerified ? "text-success" : "text-warning"}`}>
                      {user.emailVerified ? "E-mail verificado" : "E-mail não verificado"}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
