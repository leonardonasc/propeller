"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { AlertTriangle, Bell, CheckCircle2, ChevronLeft, ChevronRight, Pencil, Plus, RefreshCw, Send, ShieldCheck, Trash2, Users, X } from "lucide-react";
import { PageHeader } from "../_components/page-header";
import { toast } from "sonner";
import { API_BASE_PATH } from "../../src/services/api";

type UserRecord = {
  id: string; name: string; email: string; role: "user" | "admin"; plan: "free" | "premium";
  isBanned: boolean; bannedUntil: string | null; deletedAt: string | null; createdAt: string;
};
type ProjectRecord = { id: string; name: string; description: string | null; tasks: { id: string }[] };
type UserDetails = UserRecord & { projects: ProjectRecord[] };
type UserPage = { users: UserRecord[]; total: number; page: number; pageSize: number };
type RoadmapRecord = { id: string; title: string; description: string | null; status: "planned" | "in_progress" | "completed"; category: "feature" | "improvement" | "bug"; position: number };
type RoadmapDraft = Omit<RoadmapRecord, "id">;

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_PATH}${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Erro ${response.status}`);
  }
  return response.json() as Promise<T>;
}

const buttonClass = "inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-medium transition hover:border-primary/50 hover:bg-secondary disabled:opacity-50";
const inputClass = "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary";

export default function AdminPage() {
  const [tab, setTab] = useState<"users" | "roadmap" | "notifications">("users");
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const [deleteChoice, setDeleteChoice] = useState<"soft" | "permanent" | null>(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [roadmap, setRoadmap] = useState<RoadmapRecord[]>([]);
  const [roadmapDraft, setRoadmapDraft] = useState<RoadmapDraft | null>(null);
  const [editingRoadmapId, setEditingRoadmapId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersRefreshKey, setUsersRefreshKey] = useState(0);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const pageSize = 10;

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("section") === "roadmap") setTab("roadmap");
  }, []);

  useEffect(() => {
    let active = true;
    setUsersLoading(true);
    const timeout = window.setTimeout(() => {
      const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize), search });
      api<UserPage>(`/admin/users?${params}`).then((result) => {
        if (active) { setUsers(result.users); setTotalUsers(result.total); }
      }).catch(() => { if (active) toast.error("Não foi possível carregar os usuários. Confirme sua permissão de administrador."); })
        .finally(() => { if (active) setUsersLoading(false); });
    }, 180);
    return () => { active = false; window.clearTimeout(timeout); };
  }, [page, search, usersRefreshKey]);

  useEffect(() => {
    if (tab !== "roadmap") return;
    api<RoadmapRecord[]>("/roadmap").then(setRoadmap).catch(() => toast.error("Não foi possível carregar o roadmap."));
  }, [tab]);

  const pageCount = Math.max(1, Math.ceil(totalUsers / pageSize));

  async function openUser(id: string) {
    setLoadingUser(true);
    try { setSelectedUser(await api<UserDetails>(`/admin/users/${id}`)); }
    catch { toast.error("Não foi possível abrir os dados deste usuário."); }
    finally { setLoadingUser(false); }
  }

  async function saveUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!selectedUser) return;
    const form = new FormData(event.currentTarget);
    const banType = String(form.get("banType"));
    const dateValue = String(form.get("bannedUntil") ?? "");
    if (banType === "custom" && !dateValue) {
      toast.error("Informe a data de término do banimento temporário.");
      return;
    }
    const payload = {
      name: String(form.get("name")), email: String(form.get("email")),
      role: String(form.get("role")), plan: String(form.get("plan")),
      isBanned: banType !== "none",
      bannedUntil: banType === "custom" && dateValue ? new Date(dateValue).toISOString() : ["3d", "7d", "30d"].includes(banType) ? new Date(Date.now() + Number.parseInt(banType) * 86400000).toISOString() : null,
    };
    setSaving(true);
    try {
      await api(`/admin/users/${selectedUser.id}`, { method: "PATCH", body: JSON.stringify(payload) });
      toast.success("Usuário atualizado."); setSelectedUser(null);
      setUsersRefreshKey((value) => value + 1);
    } catch (error) { toast.error(error instanceof Error ? error.message : "Não foi possível salvar o usuário."); }
    finally { setSaving(false); }
  }

  async function deleteSelectedUser() {
    if (!selectedUser || !deleteChoice) return;
    setSaving(true);
    try {
      await api(`/admin/users/${selectedUser.id}${deleteChoice === "permanent" ? "/permanent" : ""}`, { method: "DELETE" });
      if (deleteChoice === "soft") {
        setUsers((current) => current.map((user) => user.id === selectedUser.id ? { ...user, isBanned: true, deletedAt: new Date().toISOString() } : user));
      } else {
        setUsers((current) => current.filter((user) => user.id !== selectedUser.id));
        setTotalUsers((current) => Math.max(0, current - 1));
      }
      setSelectedUser(null); setDeleteChoice(null);
      toast.success(deleteChoice === "permanent" ? "Usuário excluído permanentemente." : "Usuário desativado. Os dados foram preservados e o acesso foi bloqueado.");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Não foi possível excluir o usuário."); }
    finally { setSaving(false); }
  }

  async function reactivateSelectedUser() {
    if (!selectedUser) return;
    setSaving(true);
    try {
      await api(`/admin/users/${selectedUser.id}`, { method: "PATCH", body: JSON.stringify({ isBanned: false }) });
      setSelectedUser(null);
      setUsersRefreshKey((value) => value + 1);
      toast.success("Conta reativada. O usuário poderá entrar novamente.");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Não foi possível reativar a conta."); }
    finally { setSaving(false); }
  }

  function startRoadmapEdit(item?: RoadmapRecord) {
    setEditingRoadmapId(item?.id ?? null);
    setRoadmapDraft(item ? { title: item.title, description: item.description ?? "", status: item.status, category: item.category, position: item.position } : {
      title: "", description: "", status: "planned", category: "feature", position: roadmap.length,
    });
  }

  async function saveRoadmap(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!roadmapDraft) return;
    setSaving(true);
    try {
      const body = JSON.stringify({ ...roadmapDraft, description: roadmapDraft.description || null });
      const saved = await api<RoadmapRecord>(editingRoadmapId ? `/roadmap/${editingRoadmapId}` : "/roadmap", { method: editingRoadmapId ? "PATCH" : "POST", body });
      setRoadmap((items) => editingRoadmapId ? items.map((item) => item.id === saved.id ? saved : item).sort((a,b) => a.position-b.position) : [...items, saved].sort((a,b) => a.position-b.position));
      setRoadmapDraft(null); setEditingRoadmapId(null); toast.success("Roadmap atualizado.");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Não foi possível salvar o item."); }
    finally { setSaving(false); }
  }

  async function removeRoadmap(item: RoadmapRecord) {
    try { await api(`/roadmap/${item.id}`, { method: "DELETE" }); setRoadmap((items) => items.filter((entry) => entry.id !== item.id)); toast.success("Item removido do roadmap."); }
    catch { toast.error("Não foi possível remover o item."); }
  }

  async function sendNotification(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    try {
      const result = await api<{ recipients: number }>("/notifications/broadcast", { method: "POST", body: JSON.stringify({ title: notificationTitle, message: notificationMessage }) });
      toast.success(`Notificação enviada para ${result.recipients} contas.`);
      setNotificationTitle(""); setNotificationMessage("");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Não foi possível enviar a notificação."); }
    finally { setSaving(false); }
  }

  const tabs = useMemo(() => [
    { id: "users" as const, label: "Usuários", icon: Users },
    { id: "roadmap" as const, label: "Roadmap", icon: ShieldCheck },
    { id: "notifications" as const, label: "Notificações", icon: Bell },
  ], []);

  return (
    <div className="space-y-7">
      <PageHeader eyebrow="Workspace" icon={ShieldCheck} title="Administração" description="Gerencie contas, projetos e o roadmap do Propeller." />
      <nav aria-label="Seções administrativas" className="flex gap-2 border-b border-border">
        {tabs.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setTab(id)} className={`inline-flex items-center gap-2 border-b-2 px-3 py-3 text-sm font-medium transition ${tab === id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}><Icon size={16}/>{label}</button>)}
      </nav>

      {tab === "users" ? (
        <section className="space-y-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div><h2 className="text-lg font-semibold">Usuários</h2><p className="mt-1 text-sm text-muted-foreground">{totalUsers} contas cadastradas</p></div>
            <div className="flex w-full gap-2 sm:w-auto"><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Buscar nome ou e-mail" aria-label="Buscar usuários" className={`${inputClass} min-w-0 flex-1 sm:w-72`} /><button type="button" onClick={() => setUsersRefreshKey((value) => value + 1)} disabled={usersLoading} className={buttonClass} aria-label="Atualizar lista de usuários" title="Atualizar lista de usuários"><RefreshCw size={16} className={usersLoading ? "animate-spin" : ""}/><span className="sr-only">Atualizar</span></button></div>
          </div>
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="hidden grid-cols-[1.2fr_1.5fr_110px_100px_120px] gap-4 border-b border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground md:grid"><span>Usuário</span><span>E-mail</span><span>Perfil</span><span>Plano</span><span>Status</span></div>
            {users.map((user) => {
              const activeBan = user.isBanned && (!user.bannedUntil || new Date(user.bannedUntil).getTime() > Date.now());
              return <button type="button" key={user.id} onClick={() => openUser(user.id)} className="grid w-full grid-cols-1 gap-1 border-b border-border px-4 py-3 text-left transition last:border-0 hover:bg-secondary/60 md:grid-cols-[1.2fr_1.5fr_110px_100px_120px] md:items-center md:gap-4">
                <span className="font-medium">{user.name}</span><span className="text-sm text-muted-foreground">{user.email}</span><span className="text-sm capitalize">{user.role === "admin" ? "Administrador" : "Usuário"}</span><span className="text-sm capitalize">{user.plan}</span><span className={`inline-flex items-center gap-1.5 text-xs font-medium ${user.deletedAt || activeBan ? "text-danger" : "text-success"}`}>{(user.deletedAt || activeBan) && <AlertTriangle size={13}/ >}{user.deletedAt ? "Desativado" : activeBan ? "Banido" : "Ativo"}</span>
              </button>;
            })}
            {users.length === 0 && <p className="px-4 py-10 text-center text-sm text-muted-foreground">Nenhum usuário encontrado.</p>}
          </div>
          {totalUsers > pageSize && <div className="flex items-center justify-center gap-4"><button type="button" className={buttonClass} disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value-1))}><ChevronLeft size={16}/>Anterior</button><span className="text-sm text-muted-foreground">Página {page} de {pageCount}</span><button type="button" className={buttonClass} disabled={page >= pageCount} onClick={() => setPage((value) => Math.min(pageCount, value+1))}>Próxima<ChevronRight size={16}/></button></div>}
        </section>
      ) : tab === "roadmap" ? (
        <section className="space-y-5">
          <div className="flex items-center justify-between gap-3"><div><h2 className="text-lg font-semibold">Itens do roadmap</h2><p className="mt-1 text-sm text-muted-foreground">Crie, edite e ordene o que estamos construindo.</p></div><button type="button" className={buttonClass} onClick={() => startRoadmapEdit()}><Plus size={16}/>Novo item</button></div>
          <div className="space-y-3">{roadmap.map((item) => <article key={item.id} className="flex items-start justify-between gap-4 rounded-xl border border-border bg-card p-4"><div><h3 className="font-semibold">{item.title}</h3>{item.description && <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>}<p className="mt-2 text-xs capitalize text-muted-foreground">{item.category.replace("_", " ")} · {item.status.replace("_", " ")} · posição {item.position}</p></div><div className="flex shrink-0 gap-2"><button type="button" onClick={() => startRoadmapEdit(item)} aria-label={`Editar ${item.title}`} className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"><Pencil size={15}/></button><button type="button" onClick={() => removeRoadmap(item)} aria-label={`Excluir ${item.title}`} className="rounded-lg border border-border p-2 text-danger hover:bg-danger/10"><Trash2 size={15}/></button></div></article>)}</div>
        </section>
      ) : (
        <section className="max-w-2xl rounded-2xl border border-border bg-card p-5 sm:p-7">
          <div className="mb-6"><h2 className="text-lg font-semibold">Enviar notificação</h2><p className="mt-1 text-sm text-muted-foreground">A mensagem será entregue na central de notificações de todas as contas ativas.</p></div>
          <form onSubmit={sendNotification} className="space-y-4"><label className="block space-y-1.5 text-sm font-medium">Título<input value={notificationTitle} onChange={(event) => setNotificationTitle(event.target.value)} required maxLength={120} className={inputClass}/></label><label className="block space-y-1.5 text-sm font-medium">Mensagem<textarea value={notificationMessage} onChange={(event) => setNotificationMessage(event.target.value)} required maxLength={2000} rows={5} className="w-full rounded-lg border border-input bg-background p-3 text-sm outline-none focus:border-primary"/></label><div className="flex items-center justify-between gap-3"><p className="text-xs text-muted-foreground">{notificationMessage.length}/2000 caracteres</p><button type="submit" disabled={saving || !notificationTitle.trim() || !notificationMessage.trim()} className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-50"><Send size={15}/>{saving ? "Enviando…" : "Enviar para todos"}</button></div></form>
        </section>
      )}

      {(loadingUser || selectedUser) && <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-3" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedUser(null); }}><section role="dialog" aria-modal="true" aria-labelledby="admin-user-title" className="max-h-[90dvh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-border bg-card p-5 text-left shadow-2xl sm:p-7">{loadingUser ? <p className="py-10 text-center text-sm text-muted-foreground">Carregando usuário…</p> : selectedUser && <><div className="mb-5 flex items-start justify-between gap-4"><div><h2 id="admin-user-title" className="text-xl font-semibold">Editar usuário</h2><p className="mt-1 text-sm text-muted-foreground">Confira os projetos e atualize os dados da conta.</p>{selectedUser.deletedAt && <p className="mt-2 text-xs font-semibold text-danger">Conta desativada · dados preservados</p>}</div><button type="button" aria-label="Fechar" onClick={() => setSelectedUser(null)} className="rounded-lg p-2 text-muted-foreground hover:bg-secondary"><X size={18}/></button></div><div className="mb-4 flex flex-wrap gap-2">{selectedUser.deletedAt ? <button type="button" onClick={() => void reactivateSelectedUser()} disabled={saving} className="inline-flex h-9 items-center gap-2 rounded-lg border border-success/40 px-3 text-sm font-medium text-success hover:bg-success/10 disabled:opacity-50"><CheckCircle2 size={14}/>Reativar conta</button> : <button type="button" onClick={() => setDeleteChoice("soft")} className="inline-flex h-9 items-center gap-2 rounded-lg border border-danger/40 px-3 text-sm font-medium text-danger hover:bg-danger/10"><Trash2 size={14}/>Desativar conta</button>}<button type="button" onClick={() => setDeleteChoice("permanent")} className="inline-flex h-9 items-center rounded-lg px-3 text-sm font-medium text-danger underline underline-offset-4">Excluir permanentemente</button></div><form onSubmit={saveUser} className="grid gap-4 sm:grid-cols-2"><label className="space-y-1.5 text-sm font-medium">Nome<input name="name" defaultValue={selectedUser.name} required maxLength={100} className={inputClass}/></label><label className="space-y-1.5 text-sm font-medium">E-mail<input name="email" type="email" defaultValue={selectedUser.email} required className={inputClass}/></label><label className="space-y-1.5 text-sm font-medium">Permissão<select name="role" defaultValue={selectedUser.role} className={inputClass}><option value="user">Usuário</option><option value="admin">Administrador</option></select></label><label className="space-y-1.5 text-sm font-medium">Plano<select name="plan" defaultValue={selectedUser.plan} className={inputClass}><option value="free">Free</option><option value="premium">Premium</option></select></label><label className="space-y-1.5 text-sm font-medium sm:col-span-2">Banimento<select name="banType" defaultValue={selectedUser.isBanned && (!selectedUser.bannedUntil || new Date(selectedUser.bannedUntil).getTime() > Date.now()) ? selectedUser.bannedUntil ? "custom" : "permanent" : "none"} className={inputClass}><option value="none">Sem banimento</option><option value="3d">3 dias</option><option value="7d">7 dias</option><option value="30d">30 dias</option><option value="custom">Até uma data</option><option value="permanent">Permanente</option></select></label><label className="space-y-1.5 text-sm font-medium sm:col-span-2">Banir até<input name="bannedUntil" type="datetime-local" defaultValue={selectedUser.bannedUntil && new Date(selectedUser.bannedUntil).getTime() > Date.now() ? new Date(selectedUser.bannedUntil).toISOString().slice(0,16) : ""} className={inputClass}/><span className="block text-xs font-normal text-muted-foreground">Preencha esta data quando o banimento for temporário.</span></label><div className="flex justify-end gap-2 sm:col-span-2"><button type="button" className={buttonClass} onClick={() => setSelectedUser(null)}>Cancelar</button><button type="submit" disabled={saving} className="inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-50">{saving ? "Salvando…" : "Salvar alterações"}</button></div></form><div className="mt-7 border-t border-border pt-5"><h3 className="font-semibold">Projetos ({selectedUser.projects.length})</h3>{selectedUser.projects.length ? <ul className="mt-3 space-y-2">{selectedUser.projects.map((project) => <li key={project.id} className="flex items-center justify-between gap-4 rounded-lg border border-border bg-background/50 px-3 py-2.5"><span className="min-w-0"><span className="block font-medium">{project.name}</span><code className="mt-1 block break-all font-mono text-[11px] text-muted-foreground">ID: {project.id}</code></span><span className="shrink-0 text-xs text-muted-foreground">{project.tasks.length} tarefas</span></li>)}</ul> : <p className="mt-2 text-sm text-muted-foreground">Este usuário ainda não criou projetos.</p>}</div></>}</section></div>}

      {roadmapDraft && <div className="fixed inset-0 z-[60] grid place-items-center bg-black/60 p-3" onMouseDown={(event) => { if (event.target === event.currentTarget) setRoadmapDraft(null); }}><form onSubmit={saveRoadmap} className="w-full max-w-xl space-y-4 rounded-2xl border border-border bg-card p-6 shadow-2xl"><div className="flex items-center justify-between"><h2 className="text-lg font-semibold">{editingRoadmapId ? "Editar item" : "Novo item do roadmap"}</h2><button type="button" onClick={() => setRoadmapDraft(null)} aria-label="Fechar" className="rounded-lg p-2 text-muted-foreground hover:bg-secondary"><X size={17}/></button></div><label className="block space-y-1.5 text-sm font-medium">Título<input value={roadmapDraft.title} onChange={(e) => setRoadmapDraft({...roadmapDraft,title:e.target.value})} required maxLength={50} className={inputClass}/></label><label className="block space-y-1.5 text-sm font-medium">Descrição<textarea value={roadmapDraft.description ?? ""} onChange={(e) => setRoadmapDraft({...roadmapDraft,description:e.target.value})} maxLength={1000} rows={3} className="w-full rounded-lg border border-input bg-background p-3 text-sm outline-none focus:border-primary"/></label><div className="grid gap-3 sm:grid-cols-3"><label className="space-y-1.5 text-sm font-medium">Status<select value={roadmapDraft.status} onChange={(e) => setRoadmapDraft({...roadmapDraft,status:e.target.value as RoadmapDraft["status"]})} className={inputClass}><option value="planned">Planejado</option><option value="in_progress">Em andamento</option><option value="completed">Concluído</option></select></label><label className="space-y-1.5 text-sm font-medium">Categoria<select value={roadmapDraft.category} onChange={(e) => setRoadmapDraft({...roadmapDraft,category:e.target.value as RoadmapDraft["category"]})} className={inputClass}><option value="feature">Funcionalidade</option><option value="improvement">Melhoria</option><option value="bug">Correção</option></select></label><label className="space-y-1.5 text-sm font-medium">Posição<input type="number" value={roadmapDraft.position} onChange={(e) => setRoadmapDraft({...roadmapDraft,position:Number(e.target.value)})} className={inputClass}/></label></div><div className="flex justify-end gap-2"><button type="button" className={buttonClass} onClick={() => setRoadmapDraft(null)}>Cancelar</button><button type="submit" disabled={saving} className="h-10 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-50">Salvar</button></div></form></div>}
      {deleteChoice && selectedUser && <div className="fixed inset-0 z-[70] grid place-items-center bg-black/70 p-4"><section role="alertdialog" aria-modal="true" aria-labelledby="delete-user-title" className="w-full max-w-md space-y-4 rounded-2xl border border-border bg-card p-6 shadow-2xl"><div className="flex items-start gap-3"><AlertTriangle className="mt-0.5 shrink-0 text-danger"/><div><h2 id="delete-user-title" className="font-semibold">{deleteChoice === "permanent" ? "Excluir usuário permanentemente?" : "Desativar usuário?"}</h2><p className="mt-2 text-sm text-muted-foreground">{deleteChoice === "permanent" ? `A conta de ${selectedUser.name}, incluindo projetos e dados associados, será apagada sem possibilidade de recuperação.` : `${selectedUser.name} perderá o acesso; os dados da conta serão mantidos.`}</p></div></div><div className="flex justify-end gap-2"><button type="button" className={buttonClass} disabled={saving} onClick={() => setDeleteChoice(null)}>Cancelar</button><button type="button" disabled={saving} onClick={deleteSelectedUser} className="h-10 rounded-lg bg-danger px-4 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Excluindo…" : deleteChoice === "permanent" ? "Excluir permanentemente" : "Desativar conta"}</button></div></section></div>}
    </div>
  );
}
