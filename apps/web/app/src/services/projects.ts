import { cookies } from "next/headers";
import { CreateProjectInput, createProjectSchema, projectSchema, projectsSchema } from "../schemas/project";

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

export async function getProjects() {
  const cookieStore = await cookies();

  const response = await fetch(`${api_url}/projects`, {
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

  return projectsSchema.parse(result);
}

export async function getProjectById(id: string) {
  const cookieStore = await cookies();

  const response = await fetch(`${api_url}/projects/${id}`, {
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

  const result = JSON.parse(text);

  return projectSchema.parse(result);
}