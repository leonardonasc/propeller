// apps/web/app/src/services/tasks.ts

import { CreateTaskInput, UpdateTaskInput } from "../schemas/tasks";

const api_url = process.env.NEXT_PUBLIC_API_URL;

export async function createTask(projectId: string, data: CreateTaskInput) {
    const response = await fetch(`${api_url}/projects/${projectId}/tasks`, {
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
    const response = await fetch(`${api_url}/projects/${projectId}/tasks`, {
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
    const response = await fetch(`${api_url}/projects/${projectId}/tasks/${taskId}`, {
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
    const response = await fetch(`${api_url}/projects/${projectId}/tasks/${taskId}`, {
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
    const response = await fetch(`${api_url}/projects/${projectId}/tasks/${taskId}`, {
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