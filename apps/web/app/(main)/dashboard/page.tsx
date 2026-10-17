import {
  CheckCircle2,
  FolderKanban,
  ListTodo,
} from "lucide-react";
import StatCard from "./_components/stat-card";
import { getProjects } from "../../src/services/projects";
import Link from "next/link";
import ProjectCreateButton from "../projects/project-create-button";
import { headers } from "next/headers";
import { getUser } from "../../src/services/users";

const dayGreeting = () => {
  const currentHour = new Date().getHours();
  if (currentHour < 12) {
    return "Bom dia";
  }
  if (currentHour < 18) {
    return "Boa tarde";
  }
  return "Boa noite";
}

export default async function DashboardPage() {
  const header = (await headers()).get("cookie") || "";

  const user = await getUser({
    cookie: header,
  });

  const projects = await getProjects();
  const tasks = projects.flatMap((project) => project.tasks || []);

  return (
    <main className="bg-[#080d1a] text-slate-100">
      <div>
        {/* Header */}
        <header className="mb-8">
          <p className="mb-1 text-sm font-medium text-blue-400">
            Visão geral
          </p>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-white">
                {dayGreeting()}, {user.name.split(" ")[0]} 👋
              </h1>

              <p className="mt-1 text-sm text-slate-400">
                Aqui está o resumo do seu workspace.
              </p>
            </div>

            <ProjectCreateButton />
          </div>
        </header>

        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/projects">
            <StatCard
              label="Projetos"
              value={projects.length.toString()}
              icon={<FolderKanban size={18} />}
            />
          </Link>
          {/* TODO: arrumar as props */}
          <StatCard
            label="Em andamento"
            value={tasks.filter((task) => task.status === "in_progress").length.toString()}
            icon={<ListTodo size={18} />}
          />

          <StatCard
            label="Concluídos"
            value={tasks.filter((task) => task.status === "completed").length.toString()}
            icon={<CheckCircle2 size={18} />}
          />
        </section>


      </div>
    </main>
  );
}




