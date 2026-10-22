"use client"

import { useEffect, useState } from "react"
import { LoaderCircle, Trash2, X } from "lucide-react"

export interface ProjectFormData {
    name: string
    description: string
}

interface ProjectModalProps {
    open: boolean
    onClose: () => void
    onSubmit: (data: ProjectFormData) => void
    onDelete?: () => void
    project?: {
        id: string
        name: string
        description?: string | null
    } | null
}

const initialForm: ProjectFormData = {
    name: "",
    description: "",
}

export default function ProjectModal({
    open,
    onClose,
    onSubmit,
    onDelete,
    project,
}: ProjectModalProps) {
    const [form, setForm] = useState<ProjectFormData>(initialForm)
    const [isDeleting, setIsDeleting] = useState(false)

    const isEditing = Boolean(project)

    useEffect(() => {
        if (open) {
            setForm(
                project
                    ? {
                        name: project.name,
                        description: project.description ?? "",
                    }
                    : initialForm
            )
        }
    }, [open, project])

    if (!open) return null

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!form.name.trim()) return

        onSubmit({
            ...form,
            name: form.name.trim(),
            description: form.description.trim(),
        })
    }

    async function handleDelete() {
        if (!onDelete || !project) return

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
                aria-labelledby="project-modal-title"
                className="w-full max-w-lg rounded-2xl border border-border bg-card text-card-foreground shadow-2xl"
            >
                <div className="flex items-center justify-between border-b border-border px-6 py-5">
                    <div>
                        <h2
                            id="project-modal-title"
                            className="text-lg font-semibold text-card-foreground"
                        >
                            {isEditing ? "Editar projeto" : "Novo projeto"}
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            {isEditing
                                ? "Atualize as informações do projeto."
                                : "Adicione um projeto ao seu espaço."}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Fechar modal"
                        className="rounded-lg p-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 p-6">
                    <div className="space-y-2">
                        <label
                            htmlFor="project-name"
                            className="text-sm font-medium text-foreground"
                        >
                            Título <span className="text-primary">*</span>
                        </label>

                        <input
                            id="project-name"
                            autoFocus
                            required
                            maxLength={100}
                            value={form.name}
                            onChange={(event) =>
                                setForm((current) => ({
                                    ...current,
                                    name: event.target.value,
                                }))
                            }
                            placeholder="Ex.: Projeto de Desenvolvimento"
                            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="project-description"
                            className="text-sm font-medium text-foreground"
                        >
                            Descrição
                        </label>

                        <textarea
                            id="project-description"
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
                            className="w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                    </div>

                    <div className="flex flex-col-reverse justify-between gap-3 border-t border-border pt-5 sm:flex-row sm:items-center">
                        {isEditing && onDelete ? (
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-danger transition hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isDeleting ? <LoaderCircle size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                Excluir projeto
                            </button>
                        ) : <span />}

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-secondary"
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                className="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isEditing ? "Salvar alterações" : "Criar projeto"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
