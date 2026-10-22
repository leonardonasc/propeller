// apps/web/app/src/services/tasks.ts

import { taskCommentSchema } from "../schemas/tasks";
import type { CreateTaskInput, TaskComment, UpdateTaskInput } from "../schemas/tasks";
import { API_BASE_PATH } from "./api";

export async function createTask(projectId: string, data: CreateTaskInput) {
    const response = await fetch(`${API_BASE_PATH}/projects/${projectId}/tasks`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Failed to create task");
    }

    return response.json();
}
export async function getTasks(projectId: string) {
    const response = await fetch(`${API_BASE_PATH}/projects/${projectId}/tasks`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch tasks");
    }

    return response.json();
}
export async function getTask(projectId: string, taskId: string) {
    const response = await fetch(`${API_BASE_PATH}/projects/${projectId}/tasks/${taskId}`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch task");
    }

    return response.json();
}
export async function updateTask(
    projectId: string,
    taskId: string,
    data: UpdateTaskInput,
) {
    const response = await fetch(`${API_BASE_PATH}/projects/${projectId}/tasks/${taskId}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Failed to update task");
    }
    return response.json();
}
export async function deleteTask(projectId: string, taskId: string) {
    const response = await fetch(`${API_BASE_PATH}/projects/${projectId}/tasks/${taskId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to delete task");
    }

}

export async function getTaskComments(projectId: string, taskId: string): Promise<TaskComment[]> {
    const response = await fetch(`${API_BASE_PATH}/projects/${projectId}/tasks/${taskId}/comments`, { credentials: "include", cache: "no-store" });
    if (!response.ok) throw new Error("Não foi possível carregar os comentários");
    return taskCommentSchema.array().parse(await response.json());
}

export async function createTaskComment(projectId: string, taskId: string, content: string): Promise<TaskComment> {
    const response = await fetch(`${API_BASE_PATH}/projects/${projectId}/tasks/${taskId}/comments`, {
        method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content }),
    });
    if (!response.ok) throw new Error("Não foi possível adicionar o comentário");
    return taskCommentSchema.parse(await response.json());
}

export async function updateTaskComment(projectId: string, taskId: string, commentId: string, content: string): Promise<TaskComment> {
    const response = await fetch(`${API_BASE_PATH}/projects/${projectId}/tasks/${taskId}/comments/${commentId}`, {
        method: "PATCH", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content }),
    });
    if (!response.ok) throw new Error("Não foi possível editar o comentário");
    return taskCommentSchema.parse(await response.json());
}

export async function deleteTaskComment(projectId: string, taskId: string, commentId: string) {
    const response = await fetch(`${API_BASE_PATH}/projects/${projectId}/tasks/${taskId}/comments/${commentId}`, { method: "DELETE", credentials: "include" });
    if (!response.ok) throw new Error("Não foi possível excluir o comentário");
}
