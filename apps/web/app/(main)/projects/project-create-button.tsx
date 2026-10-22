"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Plus } from "lucide-react"
import ProjectModal, {
    type ProjectFormData,
} from "./[id]/_components/project-modal"
import { createProject } from "../../src/services/projects-client"

export default function ProjectCreateButton({ disabled = false }: { disabled?: boolean }) {
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
                onClick={() => setIsOpen(true)} disabled={disabled}
                title={disabled ? "Arquive um projeto para liberar uma vaga" : undefined}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
                <Plus size={16} />
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
