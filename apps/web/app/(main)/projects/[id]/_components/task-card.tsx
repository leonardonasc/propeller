"use client"

import { MoreHorizontal } from "lucide-react"
import { useSortable } from "@dnd-kit/sortable"
import type { Task } from "../../../../src/schemas/tasks"

interface TaskCardProps {
    task: Task
    onEdit: (task: Task) => void
    isOverlay?: boolean
}

export default function TaskCard({ task, onEdit, isOverlay = false }: TaskCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id, disabled: isOverlay })

    return (
        <article
            ref={setNodeRef}
            style={{
                transform: !isOverlay && transform
                    ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
                    : undefined,
                transition: isOverlay
                    ? undefined
                    : transition ?? "transform 180ms cubic-bezier(0.2, 0.8, 0.2, 1)",
                willChange: !isOverlay && isDragging ? "transform" : undefined,
            }}
            {...attributes}
            {...listeners}
            tabIndex={isOverlay ? -1 : 0}
            onClick={() => {
                if (!isOverlay) onEdit(task);
            }}
            onKeyDown={(event) => {
                if (!isOverlay && event.target === event.currentTarget && event.key === "Enter") {
                    event.preventDefault();
                    onEdit(task);
                    return;
                }
                listeners?.onKeyDown?.(event);
            }}
            className={`group rounded-xl border border-border bg-background p-4 text-foreground shadow-sm transition hover:border-primary/40 hover:shadow-md ${isDragging && !isOverlay ? "z-10 opacity-0" : ""
                } ${isOverlay ? "w-full cursor-grabbing shadow-2xl shadow-black/30" : "cursor-pointer hover:bg-card"
                }`}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                    <h3 className="text-sm leading-5 font-medium text-foreground">
                        {task.title}
                    </h3>
                    {/* <span className="w-fit items-center gap-1 rounded-full bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-400">
                        {task.priority}
                    </span> */}
                </div>


                <button
                    type="button"
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={(event) => {
                        event.stopPropagation();
                        onEdit(task);
                    }}
                    aria-label={`Opções da tarefa ${task.title}`}
                    className="shrink-0 rounded p-1 text-muted-foreground opacity-100 transition hover:bg-secondary hover:text-foreground sm:opacity-0 sm:group-hover:opacity-100"
                >
                    <MoreHorizontal size={17} />
                </button>
            </div>

            {task.description && (
                <p className="mt-2 line-clamp-3 text-xs leading-5 text-muted-foreground">
                    {task.description}
                </p>
            )}

            {task.dueDate && (
                // validate if the date is before today, if so, show in red
                <p
                    className={`mt-2 text-xs leading-5 ${new Date(task.dueDate) < new Date() ? "text-red-500" : "text-muted-foreground"
                        }`}
                >
                    {new Date(task.dueDate).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                    })}
                </p>
            )}
        </article>
    )
}
