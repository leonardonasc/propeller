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
            className={`group rounded-lg border border-slate-800 bg-[#101827] p-4 transition hover:border-slate-700 ${isDragging && !isOverlay ? "z-10 opacity-0" : ""
                } ${isOverlay ? "w-full cursor-grabbing shadow-2xl shadow-black/30" : ""
                }`}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                    <h3 className="text-sm leading-5 font-medium text-slate-200">
                        {task.title}
                    </h3>
                    {/* <span className="w-fit items-center gap-1 rounded-full bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-400">
                        {task.priority}
                    </span> */}
                </div>
                

                <button
                    type="button"
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={() => onEdit(task)}
                    aria-label={`Opções da tarefa ${task.title}`}
                    className="shrink-0 rounded p-1 text-slate-600 opacity-100 transition hover:bg-slate-800 hover:text-slate-300 sm:opacity-0 sm:group-hover:opacity-100"
                >
                    <MoreHorizontal size={17} />
                </button>
            </div>

            {task.description && (
                <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-400">
                    {task.description}
                </p>
            )}
            
            {task.dueDate && (
                <p className="mt-2 text-xs leading-5 text-slate-400 border-t border-slate-800 pt-2">
                    Data de entrega:{" "}
                    {task.dueDate.toLocaleDateString("pt-BR")}
                </p>
            )}
        </article>
    )
}