import { createProjectSchema, projectSchema, type CreateProjectInput } from "../schemas/project";
import { API_BASE_PATH } from "./api";

export async function createProject(data: CreateProjectInput) {
    const body = createProjectSchema.parse(data);

    const response = await fetch(`${API_BASE_PATH}/projects`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        throw new Error("Não foi possível criar o projeto");
    }

    const result: unknown = await response.json();

    return projectSchema.parse(result);
}

export async function updateProject(id: string, data: Partial<CreateProjectInput>) {
    const response = await fetch(`${API_BASE_PATH}/projects/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Não foi possível atualizar o projeto");
    }

    const result: unknown = await response.json();

    return projectSchema.parse(result);
}

export async function deleteProject(id: string) {
    const response = await fetch(`${API_BASE_PATH}/projects/${id}`, {
        method: "DELETE",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Não foi possível excluir o projeto");
    }
}

export async function setProjectArchived(id: string, archived: boolean) {
    const response = await fetch(`${API_BASE_PATH}/projects/${id}`, { method: "PATCH", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ archivedAt: archived ? new Date().toISOString() : null }) });
    if (!response.ok) throw new Error("Não foi possível atualizar o arquivamento do projeto");
}
