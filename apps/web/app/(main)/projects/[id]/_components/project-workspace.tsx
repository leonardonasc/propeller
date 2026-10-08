"use client"

import { useState } from "react"

import type { Project } from "../../../../src/schemas/project"
import Link from "next/link"

interface ProjectWorkspaceProps {
    project: Project
}

type Tab = "overview" | "board" | "todo"

export default function ProjectWorkspace({ project }: ProjectWorkspaceProps) {
    const [activeTab, setActiveTab] = useState<Tab>("overview")

    return (
        <>
            {/* header */}
            <div>

                <h1 className="text-2xl font-bold">{project.name}</h1>
                <h2 className="text-lg text-gray-600">{project.description}</h2>
            </div>

            {/* tasks, if tasks <= 0 no tasks available */}
            <div className="mt-4">
                {project.tasks && project.tasks.length > 0 ? (
                    <ul>
                        {project.tasks.map((task) => (
                            <li key={task.id}>
                                <Link href={`/projects/${project.id}/tasks/${task.id}`}>
                                    {task.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Nenhuma tarefa encontrada</p>
                )}
            </div>
        </>
    )
}
