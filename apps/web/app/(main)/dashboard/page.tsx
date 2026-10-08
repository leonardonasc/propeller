import {
  ArrowUpRight,
  CheckCircle2,
  Circle,
  FolderKanban,
  ListTodo,
} from "lucide-react";
import StatCard from "./_components/stat-card";
import Activity from "./_components/activity";
import { getProjects } from "../../src/services/projects";
import YourProjects from "./_components/your-projects";
import Link from "next/link";

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
  const projects = await getProjects();
  const tasks = projects.flatMap((project) => project.tasks || []);

  return (
    <main className="min-h-screen bg-[#080d1a] text-slate-100">
      <div>
        {/* Header */}
        <header className="mb-8">
          <p className="mb-1 text-sm font-medium text-blue-400">
            Visão geral
          </p>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-white">
                {dayGreeting()}, Leonardo 👋
              </h1>

              <p className="mt-1 text-sm text-slate-400">
                Aqui está o resumo do seu workspace.
              </p>
            </div>

            <button className="inline-flex items-center gap-2 self-start rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 sm:self-auto">
              Novo projeto
              <ArrowUpRight size={15} />
            </button>
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
            value={tasks.filter((task) => task.status === "done").length.toString()}
            icon={<CheckCircle2 size={18} />}
          />
        </section>


      </div>
    </main>
  );
}




