"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { Project } from "../../../../src/schemas/project";
import type { Task } from "../../../../src/schemas/tasks";
import { createTask, deleteTask, updateTask } from "../../../../src/services/tasks";
import {
    Circle,
    CircleCheck,
    Clock3,
    Filter,
    Plus,
    Settings,
} from "lucide-react";
import TaskCard from "./task-card";
import TaskModal, { type TaskFormData } from "./task-model";
import { toast } from "sonner";
import {
    DndContext,
    DragOverlay,
    DragEndEvent,
    DragStartEvent,
    closestCorners,
    useDroppable,
} from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import ProjectModal, { ProjectFormData } from "./project-modal";
import {
    createProject,
    deleteProject,
    updateProject,
} from "../../../../src/services/projects-client";
import Link from "next/link";

type TaskStatus = Task["status"];
interface ProjectWorkspaceProps {
    project: Project;
}

const columns = [
    {
        id: "todo",
        title: "A fazer",
        icon: Circle,
        color: "text-slate-400",
    },
    {
        id: "in_progress",
        title: "Em andamento",
        icon: Clock3,
        color: "text-blue-400",
    },
    {
        id: "completed",
        title: "Concluído",
        icon: CircleCheck,
        color: "text-emerald-400",
    },
] as const;

interface TaskColumnProps {
    column: (typeof columns)[number];
    children: ReactNode;
}

function TaskColumn({ column, children }: TaskColumnProps) {
    const { isOver, setNodeRef } = useDroppable({ id: column.id });

    return (
        <section
            ref={setNodeRef}
            className={`flex min-h-0 min-w-0 flex-col rounded-xl border p-3 transition-colors ${isOver
                ? "border-blue-500/70 bg-blue-500/10"
                : "border-slate-800/80 bg-[#0b1220]"
                }`}
            style={{ maxHeight: "calc(100dvh - 280px)" }}
        >
            {children}
        </section>
    );
}

export default function ProjectWorkspace({
    project,
}: ProjectWorkspaceProps) {
    const router = useRouter();
    const [currentProject, setCurrentProject] = useState(project);
    const [tasks, setTasks] = useState<Task[]>(project.tasks ?? []);
    const [activeModal, setActiveModal] = useState<"task" | "project" | null>(null);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
    const activeTask = tasks.find((task) => task.id === activeTaskId);

    function openCreateModal() {
        setSelectedTask(null);
        setSelectedProject(null);
        setError(null);
        setActiveModal("task");
    }

    function openEditProjectModal(project: Project) {
        setSelectedProject(project);
        setSelectedTask(null);
        setError(null);
        setActiveModal("project");
    }

    function openEditModal(task: Task) {
        setSelectedTask(task);
        setSelectedProject(null);
        setError(null);
        setActiveModal("task");
    }

    function closeModal() {
        setActiveModal(null);
        setSelectedProject(null);
        setSelectedTask(null);
    }

    function handleDragStart(event: DragStartEvent) {
        setActiveTaskId(String(event.active.id));
    }

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        setActiveTaskId(null);

        if (!over || active.id === over.id) return;

        const activeTask = tasks.find(
            (task) => task.id === String(active.id),
        );

        const overTask = tasks.find(
            (task) => task.id === String(over.id),
        );

        if (!activeTask) return;



        const destinationStatus: TaskStatus | undefined = columns.some(
            (column) => column.id === over.id,
        )
            ? (over.id as TaskStatus)
            : overTask?.status;

        const previousTasks = tasks;

        // Ordena as tarefas de origem e destino pela posição atual.
        const sourceTasks = tasks
            .filter((task) => task.status === activeTask.status)
            .sort((a, b) => a.position - b.position);

        const destinationTasks =
            activeTask.status === destinationStatus
                ? sourceTasks
                : tasks
                    .filter((task) => task.status === destinationStatus)
                    .sort((a, b) => a.position - b.position);

        // Remove a tarefa da coluna de origem.
        const sourceWithoutActive = sourceTasks.filter(
            (task) => task.id !== activeTask.id,
        );

        // Se soltou sobre uma tarefa, insere antes dela.
        // Se soltou sobre a coluna, adiciona ao final.
        const overIndex = overTask
            ? destinationTasks.findIndex(
                (task) => task.id === overTask.id,
            )
            : destinationTasks.length;

        const insertIndex = Math.max(
            0,
            overTask
                ? overIndex
                : destinationTasks.length,
        );

        let newSourceTasks = sourceWithoutActive;
        let newDestinationTasks: Task[];

        if (activeTask.status === destinationStatus) {
            newDestinationTasks = [...sourceWithoutActive];
            newDestinationTasks.splice(insertIndex, 0, activeTask);
            newSourceTasks = newDestinationTasks;
        } else {
            newDestinationTasks = [...destinationTasks];
            newDestinationTasks.splice(insertIndex, 0, activeTask);
        }

        // Recalcula as posições das tarefas afetadas.
        const updatedById = new Map<string, Task>();

        newSourceTasks.forEach((task, index) => {
            updatedById.set(task.id, {
                ...task,
                position: index,
            });
        });

        if (activeTask.status !== destinationStatus) {
            newDestinationTasks.forEach((task, index) => {
                updatedById.set(task.id, {
                    ...task,
                    status: destinationStatus as TaskStatus,
                    position: index,
                });
            });
        }

        const nextTasks = tasks.map(
            (task) => updatedById.get(task.id) ?? task,
        );

        // Atualiza a interface imediatamente.
        setTasks(nextTasks);

        try {
            // Persiste apenas as tarefas que realmente mudaram.
            const changedTasks = nextTasks.filter((task) => {
                const previous = previousTasks.find(
                    (item) => item.id === task.id,
                );

                return previous && (
                    previous.status !== task.status ||
                    previous.position !== task.position
                );
            });

            await Promise.all(
                changedTasks.map((task) =>
                    updateTask(project.id, task.id, {
                        status: task.status,
                        position: task.position,
                    }),
                ),
            );
        } catch {
            setTasks(previousTasks);
            toast.error(
                "Não foi possível reordenar as tarefas. Tente novamente.",
            );
        }
    }

    async function handleSubmitProject(data: ProjectFormData) {
        try {
            if (selectedProject) {
                const updatedProject = await updateProject(selectedProject.id, data);
                setCurrentProject((current) => ({
                    ...current,
                    ...updatedProject,
                }));
                toast.success("Projeto atualizado com sucesso!");
            } else {
                const newProject = await createProject(data);
                setCurrentProject(newProject);
                toast.success("Projeto criado com sucesso!");
            }

        } catch {
            setError("Não foi possível salvar o projeto. Tente novamente.");
            toast.error("Não foi possível salvar o projeto. Tente novamente.");
        } finally {
            closeModal();
        }
    }

    async function handleDeleteProject() {
        if (!selectedProject) return;

        try {
            await deleteProject(selectedProject.id);
            toast.success("Projeto excluído com sucesso!");
            router.push("/projects");
        } catch {
            setError("Não foi possível excluir o projeto. Tente novamente.");
            toast.error("Não foi possível excluir o projeto. Tente novamente.");
        }
    }

    async function handleSubmitTask(data: TaskFormData) {
        try {
            if (selectedTask) {
                const updatedTask = await updateTask(project.id, selectedTask.id, data);
                setTasks((prevTasks) =>
                    prevTasks.map((task) =>
                        task.id === updatedTask.id ? updatedTask : task,
                    ),
                );
                toast.success("Tarefa atualizada com sucesso!");
            } else {
                const newTask = await createTask(project.id, {
                    ...data,
                    // todo: get priority
                    priority: "low",
                    projectId: project.id,
                    dueDate: data.dueDate || null, // Ensure dueDate is either a Date or null
                });
                setTasks((prevTasks) => [...prevTasks, newTask]);
                toast.success("Tarefa criada com sucesso!");
            }
        } catch {
            setError("Não foi possível salvar a tarefa. Tente novamente.");
            toast.error("Não foi possível salvar a tarefa. Tente novamente.");
            console.log("Error saving task:", error);
        } finally {
            closeModal();
        }
    }

    async function handleDelete() {
        if (!selectedTask) return;

        try {
            await deleteTask(project.id, selectedTask.id);
            setTasks((prevTasks) =>
                prevTasks.filter((task) => task.id !== selectedTask.id),
            );
            toast.success("Tarefa excluída com sucesso!");
        } catch {
            setError("Não foi possível excluir a tarefa. Tente novamente.");
            toast.error("Não foi possível excluir a tarefa. Tente novamente.");
        } finally {
            closeModal();
        }

    }

    return (
        <div className="min-h-full space-y-8 text-slate-100">
            {/* Header */}
            <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start shrink-0">
                <div className="min-w-0">
                    <p className="mb-2 text-sm text-slate-500">
                        <Link href="/projects" className="hover:underline">
                            Projetos
                        </Link>
                        <span className="mx-2">/</span> {currentProject.name}
                    </p>

                    <h1 className="text-2xl font-semibold tracking-tight">
                        {currentProject.name}
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                        {currentProject.description || "Organize as tarefas deste projeto."}
                    </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                    <button
                        type="button"
                        onClick={() => openEditProjectModal(currentProject)}
                        aria-label="Editar projeto"
                        className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium transition hover:bg-blue-500"
                    >
                        <Settings size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={openCreateModal}
                        className="inline-flex shrink-0 h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium transition hover:bg-blue-500"
                    >
                        <Plus size={16} />
                        Nova tarefa
                    </button>
                </div>
            </header>

            {/* Summary */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-slate-800 pb-5 text-sm">
                <span className="font-medium text-slate-200">Quadro</span>
                <span className="text-slate-500">
                    {tasks.length} {tasks.length === 1 ? "tarefa" : "tarefas"}
                </span>
            </div>

            {error && (
                <p role="alert" className="rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                    {error}
                </p>
            )}

            {/* Kanban */}
            <DndContext
                id="project-workspace-dnd"
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragCancel={() => setActiveTaskId(null)}
            >
                <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-3">
                    {columns.map((column) => {
                        const Icon = column.icon;
                        const columnTasks = tasks
                            .filter((task) => task.status === column.id)
                            .sort((a, b) => a.position - b.position);

                        return <TaskColumn key={column.id} column={column}>
                            {/* Column header */}
                            <div className="mb-4 flex items-center justify-between px-1 py-1">
                                <div className="flex items-center gap-2.5">
                                    <Icon size={17} className={column.color} />

                                    <h2 className="text-sm font-semibold text-slate-200">
                                        {column.title}
                                    </h2>

                                    <span className="rounded-md bg-slate-800/80 px-2 py-0.5 text-xs text-slate-400">
                                        {columnTasks.length}
                                    </span>
                                </div>

                                <div className="flex items-center gap-1">
                                    <button
                                        type="button">
                                        <Filter size={25} className="rounded-md p-1.5 text-slate-500 transition hover:bg-slate-800 hover:text-white" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={openCreateModal}
                                        aria-label={`Adicionar tarefa em ${column.title}`}
                                        className="rounded-md p-1.5 text-slate-500 transition hover:bg-slate-800 hover:text-white"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Task cards */}
                            <SortableContext
                                items={columnTasks.map((task) => task.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain pr-1">
                                    {columnTasks.length > 0 ? (
                                        columnTasks.map((task) => (
                                            <TaskCard
                                                key={task.id}
                                                task={task}
                                                onEdit={openEditModal}
                                            />
                                        ))
                                    ) : (
                                        <div className="flex min-h-28 flex-col items-center justify-center rounded-lg border border-dashed border-slate-800 px-4 py-6 text-center">
                                            <p className="text-xs text-slate-500">
                                                Nenhuma tarefa por aqui
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </SortableContext>

                            <button
                                type="button"
                                onClick={openCreateModal}
                                className="mt-3 flex w-full shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-slate-500 transition hover:bg-slate-800/60 hover:text-slate-300"
                            >
                                <Plus size={15} />
                                Adicionar tarefa
                            </button>
                        </TaskColumn>;
                    })}
                </div>
                <DragOverlay dropAnimation={null}>
                    {activeTask ? (
                        <TaskCard
                            task={activeTask}
                            onEdit={openEditModal}
                            isOverlay
                        />
                    ) : null}
                </DragOverlay>
            </DndContext>

            <TaskModal
                open={activeModal === "task"}
                task={selectedTask}
                onClose={closeModal}
                onSubmit={handleSubmitTask}
                onDelete={selectedTask ? handleDelete : undefined}
            />

            <ProjectModal
                open={activeModal === "project"}
                project={selectedProject}
                onClose={closeModal}
                onSubmit={handleSubmitProject}
                onDelete={handleDeleteProject}
            />
        </div>
    );
}