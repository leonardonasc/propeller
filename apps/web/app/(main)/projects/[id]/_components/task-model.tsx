"use client"

import { useEffect, useState } from "react"
import DatePicker from "react-datepicker";
import "../../../../datepicker.css";
import { Activity, LoaderCircle, MessageSquare, Pencil, Send, Trash2, X, Check } from "lucide-react"
import { createTaskComment, deleteTaskComment, getTaskComments, updateTaskComment } from "../../../../src/services/tasks";
import type { TaskComment } from "../../../../src/schemas/tasks";
import { toast } from "sonner";
import { authClient } from "../../../../../lib/auth-client";

export type TaskStatus = "todo" | "in_progress" | "completed"
export interface TaskFormData {
    title: string
    description: string
    status: TaskStatus
    priority: "low" | "medium" | "high"
    dueDate: Date | null
}
interface TaskModalProps {
    open: boolean; projectId: string; onClose: () => void; onSubmit: (data: TaskFormData) => void; onDelete?: () => void;
    task?: { id: string; title: string; description?: string | null; priority: "low" | "medium" | "high"; status: TaskStatus; dueDate: Date | null } | null
}
const initialForm: TaskFormData = { title: "", description: "", priority: "low", status: "todo", dueDate: null }

export default function TaskModal({ open, projectId, onClose, onSubmit, onDelete, task }: TaskModalProps) {
    const [form, setForm] = useState<TaskFormData>(initialForm)
    const [comments, setComments] = useState<TaskComment[]>([])
    const [comment, setComment] = useState("")
    const [loadingComments, setLoadingComments] = useState(false)
    const [sending, setSending] = useState(false)
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
    const [editingText, setEditingText] = useState("")
    const [isDeleting, setIsDeleting] = useState(false)
    const [commentToDelete, setCommentToDelete] = useState<TaskComment | null>(null)
    const [isDeletingComment, setIsDeletingComment] = useState(false)
    const isEditing = Boolean(task)
    const { data: session } = authClient.useSession()

    useEffect(() => {
        if (!open) return;
        setForm(task ? { title: task.title, description: task.description ?? "", status: task.status, priority: task.priority, dueDate: task.dueDate } : initialForm)
        setComments([]); setComment("");
        setEditingCommentId(null); setEditingText("");
        if (task) {
            setLoadingComments(true);
            getTaskComments(projectId, task.id).then(setComments).catch(() => toast.error("Não foi possível carregar os comentários.")).finally(() => setLoadingComments(false));
        }
    }, [open, task, projectId])

    if (!open) return null
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!form.title.trim()) return;
        onSubmit({ ...form, title: form.title.trim(), description: form.description.trim() })
    }
    async function handleComment(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault(); if (!task || !comment.trim()) return;
        setSending(true);
        try { const created = await createTaskComment(projectId, task.id, comment); setComments((items) => [...items, created]); setComment(""); }
        catch { toast.error("Não foi possível enviar o comentário."); }
        finally { setSending(false); }
    }
    async function saveComment(commentId: string) {
        if (!task || !editingText.trim()) return;
        try {
            const updated = await updateTaskComment(projectId, task.id, commentId, editingText);
            setComments((items) => items.map((item) => item.id === commentId ? updated : item));
            setEditingCommentId(null);
            setEditingText("");
            toast.success("Comentário atualizado.");
        } catch {
            toast.error("Não foi possível editar o comentário.");
        }
    }
    async function removeComment(commentId: string) {
        if (!task) return;
        setIsDeletingComment(true);
        try {
            await deleteTaskComment(projectId, task.id, commentId);
            setComments((items) => items.filter((item) => item.id !== commentId));
            setEditingCommentId(null);
            setCommentToDelete(null);
            toast.success("Coment\u00e1rio exclu\u00eddo.");
        } catch {
            toast.error("N\u00e3o foi poss\u00edvel excluir o comentário.");
        } finally {
            setIsDeletingComment(false);
        }
    }
    async function handleDelete() {
        if (!onDelete || !task) return;
        setIsDeleting(true); await onDelete(); setIsDeleting(false);
    }

    return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-3 backdrop-blur-sm sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
        <div role="dialog" aria-modal="true" aria-labelledby="task-modal-title" className="flex max-h-[min(88dvh,820px)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-2xl">
            <header className="flex shrink-0 items-center justify-between border-b border-border px-5 py-3 sm:px-7">
                <span className="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">{isEditing ? "Tarefa" : "Nova tarefa"}</span>
                <button type="button" onClick={onClose} aria-label="Fechar modal" className="rounded-lg p-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground"><X size={18}/></button>
            </header>
            <div className="grid min-h-0 flex-1 md:grid-cols-[1.2fr_0.88fr]">
                <form onSubmit={handleSubmit} className="flex min-h-0 flex-col overflow-y-auto p-5 sm:p-7">
                    <h2 id="task-modal-title" className="mb-5 text-xl font-semibold">{isEditing ? "Editar tarefa" : "Nova tarefa"}</h2>
                    <div className="space-y-2"><label htmlFor="task-title" className="text-sm font-medium">Título</label><input id="task-title" autoFocus required maxLength={100} value={form.title} onChange={(e) => setForm((v) => ({...v,title:e.target.value}))} placeholder="Ex.: Criar página de login" className="w-full rounded-lg border border-input bg-background px-3.5 py-3 text-base font-medium outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"/></div>
                    <div className="mt-6 space-y-2"><label htmlFor="task-description" className="flex items-center gap-2 text-sm font-semibold"><Activity size={16}/>Descrição</label><textarea id="task-description" rows={5} maxLength={1000} value={form.description} onChange={(e) => setForm((v) => ({...v,description:e.target.value}))} placeholder="Adicione uma descrição mais detalhada..." className="w-full resize-y rounded-lg border border-input bg-background px-3.5 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"/></div>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <label className="space-y-2 text-sm font-medium">Status<select value={form.status} onChange={(e) => setForm((v) => ({...v,status:e.target.value as TaskStatus}))} className="block w-full rounded-lg border border-input bg-background px-3 py-2.5 font-normal"><option value="todo">A fazer</option><option value="in_progress">Em andamento</option><option value="completed">Concluído</option></select></label>
                        <label className="space-y-2 text-sm font-medium">Prioridade<select value={form.priority} onChange={(e) => setForm((v) => ({...v,priority:e.target.value as TaskFormData["priority"]}))} className="block w-full rounded-lg border border-input bg-background px-3 py-2.5 font-normal"><option value="low">Baixa</option><option value="medium">Média</option><option value="high">Alta</option></select></label>
                        <div className="space-y-2 text-sm font-medium sm:col-span-2"><label htmlFor="task-due-date">Data de entrega</label><div className="flex items-center gap-3"><DatePicker id="task-due-date" selected={form.dueDate} onChange={(date: Date | null) => setForm((v) => ({...v,dueDate:date}))} dateFormat="dd/MM/yyyy" placeholderText="Selecione uma data" className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm font-normal"/><button type="button" onClick={() => setForm((v) => ({...v,dueDate:null}))} className="text-sm text-muted-foreground hover:text-primary">Limpar</button></div></div>
                    </div>
                    <footer className="mt-auto flex flex-col-reverse justify-between gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:mt-7">
                        {isEditing && onDelete ? <button type="button" onClick={handleDelete} disabled={isDeleting} className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-danger hover:bg-danger/10 disabled:opacity-50">{isDeleting ? <LoaderCircle size={16} className="animate-spin"/> : <Trash2 size={16}/>}Excluir tarefa</button> : <span/>}
                        <div className="flex justify-end gap-2"><button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium hover:bg-secondary">Cancelar</button><button type="submit" disabled={!form.title.trim()} className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-110 disabled:opacity-50">{isEditing ? "Salvar alterações" : "Criar tarefa"}</button></div>
                    </footer>
                </form>
                <aside className="flex min-h-[260px] min-w-0 flex-col border-t border-border bg-background/40 md:min-h-0 md:border-l md:border-t-0">
                    <div className="flex items-center gap-2 border-b border-border px-5 py-4 text-sm font-semibold"><MessageSquare size={17}/>Comentários e atividade</div>
                    <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
                        {isEditing ? loadingComments ? <p className="text-sm text-muted-foreground">Carregando comentários...</p> : comments.length ? comments.map((item) => <article key={item.id} className="flex gap-3"><div className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/15 text-xs font-semibold text-primary">{(item.author?.name ?? "U").slice(0,2).toUpperCase()}</div><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><p className="text-sm"><span className="font-semibold">{item.author?.name ?? "Usuário"}</span><span className="ml-2 text-xs text-muted-foreground">{new Intl.DateTimeFormat("pt-BR", {dateStyle:"medium",timeStyle:"short"}).format(item.createdAt)}</span></p>{item.userId === session?.user.id && editingCommentId !== item.id && <button type="button" onClick={() => { setEditingCommentId(item.id); setEditingText(item.content); }} aria-label="Editar comentário" className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"><Pencil size={14}/></button>}</div>{editingCommentId === item.id ? <div className="mt-2"><textarea autoFocus rows={3} maxLength={2000} value={editingText} onChange={(event) => setEditingText(event.target.value)} className="w-full resize-y rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"/><div className="mt-2 flex justify-end gap-2"><button type="button" onClick={() => setCommentToDelete(item)} className="mr-auto inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs text-danger hover:bg-danger/10"><Trash2 size={13}/>Excluir</button><button type="button" onClick={() => setEditingCommentId(null)} className="rounded-md border border-border px-2.5 py-1.5 text-xs">Cancelar</button><button type="button" onClick={() => saveComment(item.id)} disabled={!editingText.trim()} className="inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-50"><Check size={13}/>Salvar</button></div></div> : <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-card-foreground">{item.content}</p>}</div></article>) : <p className="text-sm text-muted-foreground">Ainda não há comentários. Comece a conversa.</p> : <p className="text-sm text-muted-foreground">Os comentários ficarão disponíveis depois de criar a tarefa.</p>}
                    </div>
                    {isEditing && <form onSubmit={handleComment} className="border-t border-border p-4"><textarea rows={2} maxLength={2000} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Escrever um comentário..." className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"/><div className="mt-2 flex justify-end"><button type="submit" disabled={!comment.trim() || sending} className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground transition hover:brightness-110 disabled:opacity-50">{sending ? <LoaderCircle size={15} className="animate-spin"/> : <Send size={15}/>}Comentar</button></div></form>}
                </aside>
            </div>
        </div>
        {commentToDelete && <div className="fixed inset-0 z-[60] grid place-items-center bg-black/70 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget && !isDeletingComment) setCommentToDelete(null); }}><section role="alertdialog" aria-modal="true" aria-labelledby="delete-comment-title" aria-describedby="delete-comment-description" className="w-full max-w-sm rounded-xl border border-border bg-card p-5 text-card-foreground shadow-2xl"><div className="flex items-start gap-3"><div className="grid size-9 shrink-0 place-items-center rounded-lg bg-danger/10 text-danger"><Trash2 size={17}/></div><div><h2 id="delete-comment-title" className="font-semibold">Excluir comentário?</h2><p id="delete-comment-description" className="mt-1 text-sm text-muted-foreground">Esta ação não pode ser desfeita.</p><p className="mt-3 line-clamp-3 whitespace-pre-wrap rounded-md bg-background/60 px-3 py-2 text-sm">{commentToDelete.content}</p></div></div><div className="mt-5 flex justify-end gap-2"><button type="button" disabled={isDeletingComment} onClick={() => setCommentToDelete(null)} className="rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-secondary disabled:opacity-50">Cancelar</button><button type="button" disabled={isDeletingComment} onClick={() => void removeComment(commentToDelete.id)} className="inline-flex items-center gap-2 rounded-lg bg-danger px-3 py-2 text-sm font-semibold text-white disabled:opacity-50">{isDeletingComment && <LoaderCircle size={15} className="animate-spin"/>}Excluir comentário</button></div></section></div>}
    </div>
}
