import { cookies } from "next/headers";
import { CreateProjectInput, createProjectSchema, projectSchema, projectsSchema } from "../schemas/project";
import { CreateRoadmapInput, createRoadmapSchema, roadmapsSchema } from "../schemas/roadmap";

const api_url = process.env.NEXT_PUBLIC_API_URL;

export async function createRoadmap(data: CreateRoadmapInput) {
    const body = createRoadmapSchema.parse(data);
    const response = await fetch(`${api_url}/roadmap`, {
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

export async function getRoadmap() {
    const cookieStore = await cookies();
    const response = await fetch(`${api_url}/roadmap`, {
        method: 'GET',
        headers: {
            Cookie: cookieStore.toString(),
        },
        cache: 'no-store',
    });

    const text = await response.text();

    if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${text}`);
    }
    const result: unknown = JSON.parse(text);

    return roadmapsSchema.parse(result);
}