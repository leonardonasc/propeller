"use client";

import "../../datepicker.css";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Plus, Trash2, X } from "lucide-react";
import { PageHeader } from "../_components/page-header";
import { toast } from "sonner";
import { API_BASE_PATH } from "../../src/services/api";

type EventItem = { id: string; title: string; description: string | null; startsAt: string; allDay: boolean };
const pad = (value: number) => String(value).padStart(2, "0");
const localInput = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
const formatDate = (date: Date) => new Intl.DateTimeFormat("pt-BR", { dateStyle: "full", timeStyle: "short" }).format(date);

export default function CalendarPage() {
  const [month, setMonth] = useState(() => new Date());
  const [events, setEvents] = useState<EventItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const start = useMemo(() => new Date(month.getFullYear(), month.getMonth(), 1), [month]);
  const end = useMemo(() => new Date(month.getFullYear(), month.getMonth() + 1, 1), [month]);
  const from = useMemo(() => new Date(start.getFullYear(), start.getMonth(), 1 - start.getDay()), [start]);
  const to = useMemo(() => new Date(end.getFullYear(), end.getMonth(), (7 - end.getDay()) % 7), [end]);
  const days = useMemo(() => Array.from({ length: Math.round((to.getTime() - from.getTime()) / 86400000) }, (_, index) => new Date(from.getFullYear(), from.getMonth(), from.getDate() + index)), [from, to]);

  async function load() {
    try {
      const response = await fetch(`${API_BASE_PATH}/calendar/events?from=${encodeURIComponent(from.toISOString())}&to=${encodeURIComponent(to.toISOString())}`, { credentials: "include", cache: "no-store" });
      if (!response.ok) throw new Error();
      setEvents(await response.json());
    } catch { toast.error("N?o foi poss?vel carregar a agenda."); }
  }

  useEffect(() => { void load(); }, [from, to]);

  async function createEvent(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE_PATH}/calendar/events`, {
        method: "POST", credentials: "include", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: data.get("title"), description: data.get("description"), startsAt: new Date(String(data.get("startsAt"))).toISOString() }),
      });
      if (!response.ok) throw new Error();
      toast.success("Compromisso adicionado.");
      setShowForm(false);
      await load();
    } catch { toast.error("Confira o t?tulo e a data de in?cio do compromisso."); }
    finally { setSaving(false); }
  }

  async function removeEvent(id: string) {
    try {
      const response = await fetch(`${API_BASE_PATH}/calendar/events/${id}`, { method: "DELETE", credentials: "include" });
      if (!response.ok) throw new Error();
      setEvents((items) => items.filter((item) => item.id !== id));
      toast.success("Compromisso removido.");
    } catch { toast.error("N?o foi poss?vel remover o compromisso."); }
  }

  const selectedMonthEvents = events.filter((event) => {
    const date = new Date(event.startsAt);
    return date.getMonth() === month.getMonth() && date.getFullYear() === month.getFullYear();
  }).sort((a, b) => a.startsAt.localeCompare(b.startsAt));

  return <div className="space-y-5">
    <PageHeader eyebrow="Planejamento" icon={CalendarDays} title="Agenda" description="Veja seus compromissos e datas importantes." actions={<button onClick={() => setShowForm(true)} className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110"><Plus size={15} />Adicionar</button>} />
    <section className="overflow-hidden rounded-xl border border-border bg-card">
      <header className="flex items-center justify-between border-b border-border px-3 py-2.5 sm:px-4"><div><h2 className="text-sm font-semibold capitalize">{new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(month)}</h2><p className="mt-0.5 text-[11px] text-muted-foreground">{selectedMonthEvents.length} compromissos</p></div><div className="flex gap-1.5"><button aria-label="M?s anterior" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} className="grid size-8 place-items-center rounded-md border border-border hover:bg-secondary"><ChevronLeft size={16} /></button><button onClick={() => setMonth(new Date())} className="rounded-md border border-border px-2.5 text-xs hover:bg-secondary">Hoje</button><button aria-label="Pr?ximo m?s" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} className="grid size-8 place-items-center rounded-md border border-border hover:bg-secondary"><ChevronRight size={16} /></button></div></header>
      <div className="grid grid-cols-7">{["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "S?b"].map((day) => <div key={day} className="border-b border-border py-1.5 text-center text-[10px] font-semibold text-muted-foreground sm:py-2 sm:text-xs">{day}</div>)}{days.map((day) => {
        const dayEvents = events.filter((event) => new Date(event.startsAt).toDateString() === day.toDateString());
        const today = day.toDateString() === new Date().toDateString();
        return <div key={day.toISOString()} className={`min-h-16 overflow-hidden border-b border-r border-border p-1 sm:min-h-20 sm:p-1.5 ${day.getMonth() !== month.getMonth() ? "bg-background/40" : ""}`}>
          <span className={`grid size-6 place-items-center rounded-full text-[10px] sm:size-7 sm:text-xs ${today ? "bg-primary font-semibold text-primary-foreground" : day.getMonth() === month.getMonth() ? "text-foreground" : "text-muted-foreground"}`}>{day.getDate()}</span>
          <div className="mt-0.5 space-y-0.5">{dayEvents.slice(0, 1).map((item) => <div key={item.id} title={item.title} className="truncate rounded bg-primary/15 px-1 py-0.5 text-[9px] font-medium text-primary sm:text-[10px]">{item.title}</div>)}{dayEvents.length > 1 && <p className="px-1 text-[9px] text-muted-foreground">+{dayEvents.length - 1}</p>}</div>
        </div>;
      })}</div>
    </section>
    <section className="space-y-2"><h2 className="text-sm font-semibold">Compromissos do m?s</h2>{selectedMonthEvents.length ? selectedMonthEvents.map((event) => <article key={event.id} className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5"><div className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-center text-[10px] font-bold leading-tight text-primary">{new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(new Date(event.startsAt))}</div><div className="min-w-0 flex-1"><h3 className="truncate text-sm font-medium">{event.title}</h3><p className="text-[11px] text-muted-foreground">{formatDate(new Date(event.startsAt))}</p>{event.description && <p className="truncate text-xs text-muted-foreground">{event.description}</p>}</div><button onClick={() => void removeEvent(event.id)} aria-label="Excluir compromisso" className="rounded-md p-1.5 text-muted-foreground hover:bg-danger/10 hover:text-danger"><Trash2 size={15} /></button></article>) : <p className="rounded-lg border border-dashed border-border p-5 text-center text-xs text-muted-foreground">Nenhum compromisso neste m?s.</p>}</section>
    {showForm && <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowForm(false); }}><form onSubmit={createEvent} className="w-full max-w-md space-y-3 rounded-xl border border-border bg-card p-5 shadow-xl"><div className="flex items-center justify-between"><h2 className="text-base font-semibold">Novo compromisso</h2><button type="button" onClick={() => setShowForm(false)} aria-label="Fechar" className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary"><X size={17} /></button></div><label className="block space-y-1 text-xs font-medium">T?tulo<input required name="title" maxLength={160} autoFocus placeholder="Ex.: Reuni?o de planejamento" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-normal" /></label><label className="block space-y-1 text-xs font-medium">Descri??o <span className="font-normal text-muted-foreground">(opcional)</span><textarea name="description" maxLength={2000} rows={2} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-normal" /></label><label className="block space-y-1 text-xs font-medium">Data e hora de in?cio<input required name="startsAt" type="datetime-local" defaultValue={localInput(new Date(Date.now() + 3600000))} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-normal" /></label><div className="flex justify-end gap-2 pt-1"><button type="button" onClick={() => setShowForm(false)} className="rounded-md border border-border px-3 py-2 text-xs">Cancelar</button><button disabled={saving} className="rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-50">{saving ? "Salvando?" : "Salvar"}</button></div></form></div>}
  </div>;
}
import "../../datepicker.css";
