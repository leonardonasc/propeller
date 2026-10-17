"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import ProjectModal, {
    type ProjectFormData,
} from "./[id]/_components/project-modal"
import { createProject } from "../../src/services/projects-client"

export default function ProjectCreateButton() {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)

    async function handleSubmit(data: ProjectFormData) {
        try {
            await createProject(data)
            toast.success("Projeto criado com sucesso!")
            setIsOpen(false)
            router.push("/projects")
        } catch (err) {
            toast.error("Não foi possível criar o projeto")
        }
    }

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-accent"
            >
                Novo projeto
            </button>

            <ProjectModal
                open={isOpen}
                project={null}
                onClose={() => setIsOpen(false)}
                onSubmit={handleSubmit}
            />
        </>
    )
}