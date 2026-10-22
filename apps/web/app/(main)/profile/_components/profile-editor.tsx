"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, LoaderCircle, Pencil } from "lucide-react";
import { toast } from "sonner";

const api = process.env.NEXT_PUBLIC_API_URL;

export function ProfileEditor({ initialName, initialUsername }: { initialName: string; initialUsername: string }) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [username, setUsername] = useState(initialUsername);
  const [availability, setAvailability] = useState<"idle" | "checking" | "available" | "taken" | "invalid">("available");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const normalized = username.trim().replace(/^@/, "").toLowerCase();
    if (!/^[a-z0-9_]{3,20}$/.test(normalized)) {
      setAvailability("invalid");
      return;
    }
    setAvailability("checking");
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(`${api}/users/username-availability?username=${encodeURIComponent(normalized)}`, { credentials: "include", cache: "no-store" });
        if (!response.ok) throw new Error();
        const result: { available: boolean; valid: boolean } = await response.json();
        setAvailability(result.valid && result.available ? "available" : "taken");
      } catch {
        setAvailability("idle");
      }
    }, 350);
    return () => window.clearTimeout(timer);
  }, [username]);

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (availability !== "available") return;
    setSaving(true);
    try {
      const response = await fetch(`${api}/users/me`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username: username.trim().replace(/^@/, "").toLowerCase() }),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.message ?? "N?o foi poss?vel atualizar o perfil.");
      }
      toast.success("Perfil atualizado.");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "N?o foi poss?vel atualizar o perfil.");
    } finally {
      setSaving(false);
    }
  }

  const unchanged = name.trim() === initialName && username.trim().replace(/^@/, "").toLowerCase() === initialUsername;
  return (
    <form onSubmit={save} className="space-y-4 rounded-xl border border-border/70 bg-background/40 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold"><Pencil size={15} className="text-primary" /> Editar perfil</div>
      <label className="block space-y-1.5 text-sm font-medium">Nome<input required maxLength={80} value={name} onChange={(event) => setName(event.target.value)} className="h-10 w-full rounded-lg border border-input bg-background px-3 font-normal outline-none focus:border-primary" /></label>
      <label className="block space-y-1.5 text-sm font-medium">@usuário<input required minLength={3} maxLength={21} value={`@${username.replace(/^@/, "")}`} onChange={(event) => setUsername(event.target.value.replace(/^@/, "").toLowerCase())} className="h-10 w-full rounded-lg border border-input bg-background px-3 font-normal outline-none focus:border-primary" /><span className="block text-xs text-muted-foreground">3 a 20 caracteres: letras, números e _.</span></label>
      {availability === "checking" && <p className="text-xs text-muted-foreground">Verificando disponibilidade…</p>}
      {availability === "available" && <p className="inline-flex items-center gap-1 text-xs text-success"><Check size={13} /> @ disponível</p>}
      {availability === "taken" && <p className="text-xs text-danger">Este @ já está em uso.</p>}
      {availability === "invalid" && <p className="text-xs text-danger">Use de 3 a 20 letras minúsculas, números ou _.</p>}
      <div className="flex justify-end"><button type="submit" disabled={saving || availability !== "available" || unchanged || !name.trim()} className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-50">{saving && <LoaderCircle size={15} className="animate-spin" />}Salvar alterações</button></div>
    </form>
  );
}
