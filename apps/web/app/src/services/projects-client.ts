import { createProjectSchema, projectSchema, type CreateProjectInput } from "../schemas/project";

const api_url = process.env.NEXT_PUBLIC_API_URL;

export async function createProject(data: CreateProjectInput) {
    const body = createProjectSchema.parse(data);

    const response = await fetch(`${api_url}/projects`, {
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
    const response = await fetch(`${api_url}/projects/${id}`, {
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
    const response = await fetch(`${api_url}/projects/${id}`, {
        method: "DELETE",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Não foi possível excluir o projeto");
    }
}