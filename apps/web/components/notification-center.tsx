"use client";

import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { API_BASE_PATH } from "../app/src/services/api";

type Notification = { id: string; title: string; message: string; createdAt: string; readAt: string | null };

export function NotificationCenter() {
  const [items, setItems] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    let active = true;
    fetch(`${API_BASE_PATH}/notifications`, { credentials: "include", cache: "no-store" })
      .then((response) => response.ok ? response.json() as Promise<Notification[]> : [])
      .then((result) => { if (active) setItems(result); })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);

  async function markRead(item: Notification) {
    if (item.readAt) return;
    try {
      const response = await fetch(`${API_BASE_PATH}/notifications/${item.id}/read`, { method: "PATCH", credentials: "include" });
      if (!response.ok) throw new Error();
      setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, readAt: new Date().toISOString() } : entry));
    } catch { toast.error("Não foi possível atualizar a notificação."); }
  }

  async function clearNotifications() {
    setClearing(true);
    try {
      const response = await fetch(`${API_BASE_PATH}/notifications`, { method: "DELETE", credentials: "include" });
      if (!response.ok) throw new Error();
      setItems([]);
      toast.success("Notificações limpas.");
    } catch { toast.error("Não foi possível limpar as notificações."); }
    finally { setClearing(false); }
  }

  const unreadCount = items.filter((item) => !item.readAt).length;

  return <div className="relative">
    <button type="button" aria-label={`Notificações${unreadCount ? `, ${unreadCount} não lidas` : ""}`} aria-expanded={open} onClick={() => setOpen((value) => !value)} className="relative grid size-10 place-items-center rounded-xl border border-border bg-card text-muted-foreground shadow-sm transition hover:border-primary/40 hover:text-foreground">
      <Bell size={17}/>{unreadCount > 0 && <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold leading-5 text-primary-foreground">{unreadCount > 9 ? "9+" : unreadCount}</span>}
    </button>
    {open && <section aria-label="Notificações" className="absolute right-0 top-12 z-[60] w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-border bg-popover text-popover-foreground shadow-2xl">
      <header className="flex items-center justify-between border-b border-border px-4 py-3"><div><h2 className="text-sm font-semibold">Notificações</h2><p className="text-xs text-muted-foreground">{unreadCount ? `${unreadCount} não lidas` : "Tudo em dia"}</p></div><div className="flex items-center gap-2">{items.length > 0 && <button type="button" onClick={() => void clearNotifications()} disabled={clearing} className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition hover:bg-danger/10 hover:text-danger disabled:opacity-50" aria-label="Limpar todas as notificações"><Trash2 size={13}/>{clearing ? "Limpando…" : "Limpar"}</button>}<CheckCheck size={17} className="text-primary" aria-hidden="true"/></div></header>
      {items.length ? <ul className="max-h-[min(65vh,28rem)] divide-y divide-border overflow-y-auto">{items.map((item) => <li key={item.id}><button type="button" onClick={() => void markRead(item)} className={`w-full px-4 py-3 text-left transition hover:bg-secondary/70 ${item.readAt ? "opacity-70" : ""}`}><span className="flex items-start gap-2"><span className={`mt-1.5 size-2 shrink-0 rounded-full ${item.readAt ? "bg-transparent" : "bg-primary"}`} /><span className="min-w-0"><span className="block text-sm font-semibold">{item.title}</span><span className="mt-1 block text-xs leading-5 text-muted-foreground">{item.message}</span><time className="mt-2 block text-[10px] text-muted-foreground">{new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(item.createdAt))}</time></span></span></button></li>)}</ul> : <p className="px-5 py-9 text-center text-sm text-muted-foreground">Você ainda não recebeu notificações.</p>}
    </section>}
  </div>;
}
