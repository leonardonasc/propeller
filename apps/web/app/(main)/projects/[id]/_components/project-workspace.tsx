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
    FolderKanban,
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
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
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
import { PageHeader } from "../../../_components/page-header";

type TaskStatus = Task["status"];
interface ProjectWorkspaceProps {
    project: Project;
}

const columns = [
    {
        id: "todo",
        title: "A fazer",
        icon: Circle,
        color: "text-muted-foreground",
    },
    {
        id: "in_progress",
        title: "Em andamento",
        icon: Clock3,
        color: "text-primary",
    },
    {
        id: "completed",
        title: "Concluído",
        icon: CircleCheck,
        color: "text-success",
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
            className={`max-h-[420px] w-[min(85vw,360px)] shrink-0 flex min-h-0 min-w-0 flex-col rounded-xl border p-3 transition-colors md:max-h-[calc(100dvh-310px)] md:w-auto md:flex-1 ${isOver
                ? "border-primary/70 bg-primary/10"
                : "border-border bg-card"
                }`}
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
    const [pendingDelete, setPendingDelete] = useState<"task" | "project" | null>(null);
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
        useSensor(KeyboardSensor),
    );
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
        setPendingDelete("project");
    }

    function confirmDelete() {
        if (pendingDelete === "project" && selectedProject) {
        const target = selectedProject;
        setPendingDelete(null);
        closeModal();
        let undone = false;
        const timer = window.setTimeout(async () => {
            if (undone) return;
            try { await deleteProject(target.id); toast.success("Projeto excluído."); router.push("/projects"); }
            catch { toast.error("Não foi possível excluir o projeto."); }
        }, 7000);
        toast("Projeto será excluído em 7 segundos.", { duration: 7000, action: { label: "Desfazer", onClick: () => { undone = true; window.clearTimeout(timer); toast.success("Exclusão cancelada."); } } });
        }
        if (pendingDelete === "task" && selectedTask) {
            const target = selectedTask;
            setPendingDelete(null);
            setTasks((items) => items.filter((task) => task.id !== target.id));
            closeModal();
            let undone = false;
            const timer = window.setTimeout(async () => {
                if (undone) return;
                try { await deleteTask(project.id, target.id); toast.success("Tarefa excluída."); }
                catch { setTasks((items) => [...items, target]); toast.error("Não foi possível excluir a tarefa."); }
            }, 7000);
            toast("Tarefa será excluída em 7 segundos.", { duration: 7000, action: { label: "Desfazer", onClick: () => { undone = true; window.clearTimeout(timer); setTasks((items) => [...items, target]); toast.success("Exclusão cancelada."); } } });
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
        setPendingDelete("task");

    }

    return (
        <div className="min-h-0 space-y-6 text-foreground">
            <PageHeader
                eyebrow="Projeto"
                icon={FolderKanban}
                title={currentProject.name}
                description={currentProject.description || "Organize as tarefas deste projeto."}
                className="shrink-0"
                actions={(
                    <>
                        <button
                            type="button"
                            onClick={() => openEditProjectModal(currentProject)}
                            aria-label="Editar projeto"
                            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground shadow-sm transition hover:border-primary/50 hover:bg-secondary"
                        >
                            <Settings size={16} />
                        </button>
                        <button
                            type="button"
                            onClick={openCreateModal}
                            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition hover:-translate-y-0.5 hover:brightness-110"
                        >
                            <Plus size={16} />
                            Nova tarefa
                        </button>
                    </>
                )}
            />

            {/* Summary */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-border pb-5 text-sm">
                <span className="font-medium text-foreground">Quadro</span>
                <span className="text-muted-foreground">
                    {tasks.length} {tasks.length === 1 ? "tarefa" : "tarefas"}
                </span>
            </div>

            {error && (
                <p role="alert" className="rounded-lg border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
                    {error}
                </p>
            )}

            {/* Kanban */}
            <DndContext
                id="project-workspace-dnd"
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragCancel={() => setActiveTaskId(null)}
            >
                <div className="flex min-w-0 items-start gap-5 overflow-x-auto pb-2">
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

                                    <h2 className="text-sm font-semibold text-card-foreground">
                                        {column.title}
                                    </h2>

                                    <span className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                                        {columnTasks.length}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={openCreateModal}
                                    aria-label={`Adicionar tarefa em ${column.title}`}
                                    className="rounded-lg border border-border p-1.5 text-muted-foreground transition hover:border-primary/50 hover:bg-secondary hover:text-foreground"
                                >
                                    <Plus size={16} />
                                </button>
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
                                        <div className="flex min-h-28 flex-col items-center justify-center rounded-lg border border-dashed border-border px-4 py-6 text-center">
                                            <p className="text-xs text-muted-foreground">
                                                Nenhuma tarefa por aqui
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </SortableContext>

                            <button
                                type="button"
                                onClick={openCreateModal}
                                className="mt-3 flex w-full shrink-0 items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:border-primary/60 hover:bg-primary/5 hover:text-primary"
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
                projectId={project.id}
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
            {pendingDelete && <div className="fixed inset-0 z-[70] grid place-items-center bg-black/65 p-4 backdrop-blur-sm"><section role="alertdialog" aria-modal="true" className="w-full max-w-md rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-2xl"><h2 className="text-lg font-semibold">Excluir {pendingDelete === "task" ? "tarefa" : "projeto"}?</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{pendingDelete === "task" ? `A tarefa “${selectedTask?.title}” será removida.` : `O projeto “${selectedProject?.name}” e suas tarefas serão removidos.`} Você terá 7 segundos para desfazer.</p><div className="mt-6 flex justify-end gap-2"><button type="button" onClick={() => setPendingDelete(null)} className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium hover:bg-secondary">Cancelar</button><button type="button" onClick={confirmDelete} className="rounded-lg bg-danger px-4 py-2.5 text-sm font-semibold text-white hover:brightness-110">Excluir</button></div></section></div>}
        </div>
    );
}
