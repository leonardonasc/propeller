"use client"

import { useEffect, useState } from "react"
import DatePicker from "react-datepicker";
import { LoaderCircle, Trash2, X } from "lucide-react"

export type TaskStatus = "todo" | "in_progress" | "completed"

export interface TaskFormData {
    title: string
    description: string
    status: TaskStatus
    priority: "low" | "medium" | "high"
    dueDate: Date | null
}

interface TaskModalProps {
    open: boolean
    onClose: () => void
    onSubmit: (data: TaskFormData) => void
    onDelete?: () => void
    task?: {
        id: string
        title: string
        description?: string | null
        priority: "low" | "medium" | "high"
        status: TaskStatus
        dueDate: Date | null
    } | null
}

const initialForm: TaskFormData = {
    title: "",
    description: "",
    priority: "low",
    status: "todo",
    dueDate: new Date(), // Initialize with today
}

export default function TaskModal({
    open,
    onClose,
    onSubmit,
    onDelete,
    task,
}: TaskModalProps) {
    const [form, setForm] = useState<TaskFormData>(initialForm)
    const [isDeleting, setIsDeleting] = useState(false)

    const isEditing = Boolean(task)

    useEffect(() => {
        if (open) {
            setForm(
                task
                    ? {
                        title: task.title,
                        description: task.description ?? "",
                        status: task.status,
                        priority: task.priority,
                        dueDate: task.dueDate,
                    }
                    : initialForm
            )
        }
    }, [open, task])

    if (!open) return null

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!form.title.trim()) return

        onSubmit({
            ...form,
            title: form.title.trim(),
            description: form.description.trim(),
            dueDate: form.dueDate,
        })
    }

    async function handleDelete() {
        if (!onDelete || !task) return

        setIsDeleting(true)
        await onDelete()
        setIsDeleting(false)
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose()
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="task-modal-title"
                className="w-full max-w-lg rounded-2xl border border-slate-800 bg-[#0d1424] shadow-2xl"
            >
                <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
                    <div>
                        <h2
                            id="task-modal-title"
                            className="text-lg font-semibold text-slate-100"
                        >
                            {isEditing ? "Editar tarefa" : "Nova tarefa"}
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                            {isEditing
                                ? "Atualize as informações da tarefa."
                                : "Adicione uma tarefa ao seu projeto."}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Fechar modal"
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 p-6">
                    <div className="space-y-2">
                        <label
                            htmlFor="task-title"
                            className="text-sm font-medium text-slate-200"
                        >
                            Título <span className="text-blue-400">*</span>
                        </label>

                        <input
                            id="task-title"
                            autoFocus
                            required
                            maxLength={100}
                            value={form.title}
                            onChange={(event) =>
                                setForm((current) => ({
                                    ...current,
                                    title: event.target.value,
                                }))
                            }
                            placeholder="Ex.: Criar página de login"
                            className="w-full rounded-xl border border-slate-700 bg-[#080d1a] px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="task-description"
                            className="text-sm font-medium text-slate-200"
                        >
                            Descrição
                        </label>

                        <textarea
                            id="task-description"
                            rows={4}
                            maxLength={1000}
                            value={form.description}
                            onChange={(event) =>
                                setForm((current) => ({
                                    ...current,
                                    description: event.target.value,
                                }))
                            }
                            placeholder="Descreva o que precisa ser feito..."
                            className="w-full resize-none rounded-xl border border-slate-700 bg-[#080d1a] px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>

                    {/* Date Picker */}
                    <div className="space-y-2 flex flex-col">
                        <label
                            htmlFor="task-due-date"
                            className="text-sm font-medium text-slate-200"
                        >
                            Data de entrega (dia/mês/ano)
                        </label>
                        <div className="flex">
                            <DatePicker
                                id="task-due-date"
                                selected={form.dueDate}
                                onChange={(date: Date | null) => {
                                    setForm((current) => ({
                                        ...current,
                                        dueDate: date || new Date(),
                                    }));
                                }}
                                dateFormat="dd/MM/yyyy"
                                className="w-[90%] rounded-xl border border-slate-700 bg-[#080d1a] px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setForm((current) => ({
                                        ...current,
                                        dueDate: null,
                                    }));
                                }}
                                className="text-sm hover:text-blue-400 transition ml-2 self-center"
                            >
                                Limpar
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="task-status"
                            className="text-sm font-medium text-slate-200"
                        >
                            Status
                        </label>

                        <select
                            id="task-status"
                            value={form.status}
                            onChange={(event) =>
                                setForm((current) => ({
                                    ...current,
                                    status: event.target.value as TaskStatus,
                                }))
                            }
                            className="w-full rounded-xl border border-slate-700 bg-[#080d1a] px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-blue-500"
                        >
                            <option value="todo">A fazer</option>
                            <option value="in_progress">Em andamento</option>
                            <option value="completed">Concluído</option>
                        </select>
                    </div>

                    <div className="flex flex-col-reverse justify-between gap-3 border-t border-slate-800 pt-5 sm:flex-row sm:items-center">
                        {isEditing && onDelete ? (
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-400/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isDeleting ? <LoaderCircle size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                Excluir tarefa
                            </button>
                        ) : <span />}

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                disabled={!form.title.trim()}
                                className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isEditing ? "Salvar alterações" : "Criar tarefa"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}