"use client"

import { useState } from "react"

import type { Project } from "../../../../src/schemas/project"
import Link from "next/link"

interface ProjectWorkspaceProps {
    project: Project
}

type Tab = "overview" | "board" | "todo"

const mockTasks = [
    {
        id: "1",
        title: "Criar estrutura do projeto",
        description: "Configurar a arquitetura inicial do projeto.",
        status: "todo",
        priority: "alta",
    },
    {
        id: "2",
        title: "Implementar autenticação",
        description: "Criar login e gerenciamento de sessão.",
        status: "progress",
        priority: "media",
    },
    {
        id: "3",
        title: "Criar dashboard",
        description: "Desenvolver o dashboard principal do projeto.",
        status: "progress",
        priority: "alta",
    },
    {
        id: "4",
        title: "Configurar banco de dados",
        description: "Conectar o projeto ao PostgreSQL.",
        status: "done",
        priority: "baixa",
    },
    {
        id: "5",
        title: "Adicionar layout responsivo",
        description: "Adaptar a interface para diferentes tamanhos de tela.",
        status: "done",
        priority: "media",
    },
]

export default function ProjectWorkspace({
    project,
}: ProjectWorkspaceProps) {
    const [activeTab, setActiveTab] = useState<Tab>("overview")

    const currentProject = project

    const completedTasks = mockTasks.filter(
        (task) => task.status === "done",
    ).length

    const progress =
        mockTasks.length > 0
            ? Math.round((completedTasks / mockTasks.length) * 100)
            : 0

    if (!currentProject) {
        return (
            <main className="min-h-screen bg-background text-foreground">
                <div className="py-8">
                    <p className="text-sm text-muted-foreground">
                        Projeto não encontrado.
                    </p>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-background text-foreground">
            <div className="py-8">
                <header className="mb-8">
                    <div className="mb-5 flex items-center gap-3">
                        <Link
                            href="/projects"
                            aria-label="Voltar para projetos"
                            className="flex size-9 items-center justify-center rounded-md border border-border bg-secondary text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                            ←
                        </Link>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Projetos</span>
                            <span>/</span>
                            <span className="text-foreground">
                                {currentProject.name}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-end justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-semibold tracking-tight">
                                {currentProject.name}
                            </h1>

                            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                                {currentProject.description}
                            </p>
                        </div>

                        <button
                            type="button"
                            className="h-10 shrink-0 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-accent"
                        >
                            Editar projeto
                        </button>
                    </div>
                </header>

                <nav className="mb-8 border-b border-border">
                    <div className="flex gap-6">
                        <TabButton
                            active={activeTab === "overview"}
                            onClick={() => setActiveTab("overview")}
                        >
                            Visão geral
                        </TabButton>

                        <TabButton
                            active={activeTab === "board"}
                            onClick={() => setActiveTab("board")}
                        >
                            Quadro
                        </TabButton>

                        <TabButton
                            active={activeTab === "todo"}
                            onClick={() => setActiveTab("todo")}
                        >
                            Tarefas
                        </TabButton>
                    </div>
                </nav>

                {activeTab === "overview" && (
                    <Overview
                        project={currentProject}
                        completedTasks={completedTasks}
                        progress={progress}
                    />
                )}

                {activeTab === "board" && <Board />}

                {activeTab === "todo" && <Todo />}
            </div>
        </main>
    )
}

function TabButton({
    active,
    onClick,
    children,
}: {
    active: boolean
    onClick: () => void
    children: React.ReactNode
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`relative pb-3 text-sm font-medium transition-colors ${active
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
                }`}
        >
            {children}

            {active && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary" />
            )}
        </button>
    )
}

function Overview({
    project,
    completedTasks,
    progress,
}: {
    project: Project
    completedTasks: number
    progress: number
}) {
    return (
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
            <section className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-3">
                    <ProjectStat
                        label="Tarefas"
                        value={mockTasks.length.toString()}
                    />

                    <ProjectStat
                        label="Concluídas"
                        value={completedTasks.toString()}
                    />

                    <ProjectStat
                        label="Progresso"
                        value={`${progress}%`}
                    />
                </div>

                <div className="rounded-lg border border-border bg-card p-6">
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h2 className="font-semibold">Progresso do projeto</h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Acompanhe o andamento geral do projeto.
                            </p>
                        </div>

                        <span className="text-sm font-medium">
                            {progress}%
                        </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

            </section>

            <aside>
                <div className="rounded-lg border border-border bg-card p-6">
                    <h2 className="mb-5 text-sm font-semibold">
                        Detalhes do projeto
                    </h2>

                    <div className="space-y-5">
                        <Detail label="Status">
                            <span className="flex items-center gap-2 text-sm text-emerald-400">
                                <span className="size-2 rounded-full bg-emerald-400" />
                                Ativo
                            </span>
                        </Detail>

                        <Detail label="Tarefas">
                            <span className="text-sm text-muted-foreground">
                                {mockTasks.length}
                            </span>
                        </Detail>

                        <Detail label="Concluídas">
                            <span className="text-sm text-muted-foreground">
                                {completedTasks}
                            </span>
                        </Detail>

                        <Detail label="Progresso">
                            <span className="text-sm text-muted-foreground">
                                {progress}%
                            </span>
                        </Detail>
                    </div>
                </div>
            </aside>
        </div>
    )
}
function Board() {
    const columns = [
        {
            id: "todo",
            title: "A fazer",
            tasks: mockTasks.filter((task) => task.status === "todo"),
        },
        {
            id: "progress",
            title: "Em andamento",
            tasks: mockTasks.filter((task) => task.status === "progress"),
        },
        {
            id: "done",
            title: "Concluído",
            tasks: mockTasks.filter((task) => task.status === "done"),
        },
    ]

    return (
        <section>
            <div className="mb-6 flex items-end justify-between">
                <div>
                    <h2 className="text-xl font-semibold">Quadro</h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Organize as tarefas e acompanhe o andamento do projeto.
                    </p>
                </div>

                <button
                    type="button"
                    className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-accent"
                >
                    Nova tarefa
                </button>
            </div>

            <div className="grid min-h-[500px] gap-4 lg:grid-cols-3">
                {columns.map((column) => (
                    <div
                        key={column.id}
                        className="rounded-lg border border-border bg-muted/30 p-4"
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-sm font-semibold">
                                {column.title}
                            </h3>

                            <span className="rounded-md bg-secondary px-2 py-1 text-xs text-muted-foreground">
                                {column.tasks.length}
                            </span>
                        </div>

                        <div className="space-y-3">
                            {column.tasks.map((task) => (
                                <BoardCard key={task.id} task={task} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

function Todo() {
    return (
        <section>
            <div className="mb-6 flex items-end justify-between">
                <div>
                    <h2 className="text-xl font-semibold">Tarefas</h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Gerencie todas as tarefas do projeto.
                    </p>
                </div>

                <button
                    type="button"
                    className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-accent"
                >
                    Nova tarefa
                </button>
            </div>

            <div className="overflow-hidden rounded-lg border border-border bg-card">
                {mockTasks.map((task) => (
                    <TodoRow key={task.id} task={task} />
                ))}
            </div>
        </section>
    )
}

function ProjectStat({
    label,
    value,
}: {
    label: string
    value: string
}) {
    return (
        <div className="rounded-lg border border-border bg-card p-5">
            <p className="text-xs text-muted-foreground">{label}</p>

            <p className="mt-2 text-2xl font-semibold tracking-tight">
                {value}
            </p>
        </div>
    )
}

function Detail({
    label,
    children,
}: {
    label: string
    children: React.ReactNode
}) {
    return (
        <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-muted-foreground">
                {label}
            </span>

            {children}
        </div>
    )
}
function TaskRow({
    task,
}: {
    task: (typeof mockTasks)[number]
}) {
    return (
        <div className="flex items-center justify-between gap-4 py-4">
            <div className="flex min-w-0 items-center gap-3">
                <span
                    className={`size-2 shrink-0 rounded-full ${task.status === "done"
                        ? "bg-emerald-400"
                        : task.status === "progress"
                            ? "bg-blue-400"
                            : "bg-slate-500"
                        }`}
                />

                <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                        {task.title}
                    </p>

                    <p className="mt-1 truncate text-xs text-muted-foreground">
                        {task.description}
                    </p>
                </div>
            </div>

            <Priority priority={task.priority} />
        </div>
    )
}

function BoardCard({
    task,
}: {
    task: (typeof mockTasks)[number]
}) {
    return (
        <div className="cursor-pointer rounded-md border border-border bg-card p-4 transition-colors hover:border-primary/40">
            <div className="mb-3 flex items-start justify-between gap-3">
                <h4 className="text-sm font-medium leading-5">
                    {task.title}
                </h4>

                <span className="text-muted-foreground">•••</span>
            </div>

            <p className="mb-4 text-xs leading-5 text-muted-foreground">
                {task.description}
            </p>

            <Priority priority={task.priority} />
        </div>
    )
}

function TodoRow({
    task,
}: {
    task: (typeof mockTasks)[number]
}) {
    return (
        <div className="flex items-center gap-4 border-b border-border px-5 py-4 last:border-b-0">
            <button
                type="button"
                className={`size-4 shrink-0 rounded border transition-colors ${task.status === "done"
                    ? "border-primary bg-primary"
                    : "border-muted-foreground/40 hover:border-primary"
                    }`}
                aria-label={`Concluir ${task.title}`}
            />

            <div className="min-w-0 flex-1">
                <p
                    className={`text-sm font-medium ${task.status === "done"
                        ? "text-muted-foreground line-through"
                        : ""
                        }`}
                >
                    {task.title}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                    {task.description}
                </p>
            </div>

            <Priority priority={task.priority} />

            <span className="hidden text-xs capitalize text-muted-foreground sm:block">
                {getStatusLabel(task.status)}
            </span>
        </div>
    )
}

function Priority({
    priority,
}: {
    priority: string
}) {
    const styles = {
        alta: "border-red-400/20 bg-red-400/10 text-red-400",
        media: "border-amber-400/20 bg-amber-400/10 text-amber-400",
        baixa: "border-slate-400/20 bg-slate-400/10 text-slate-400",
    }

    return (
        <span
            className={`rounded-md border px-2 py-1 text-[10px] font-medium ${styles[priority as keyof typeof styles]
                }`}
        >
            {priority}
        </span>
    )
}

function getStatusLabel(status: string) {
    if (status === "todo") return "A fazer"
    if (status === "progress") return "Em andamento"
    if (status === "done") return "Concluído"

    return status
}