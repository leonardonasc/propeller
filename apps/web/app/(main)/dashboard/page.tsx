import {
  ArrowUpRight,
  CheckCircle2,
  Circle,
  FolderKanban,
  ListTodo,
} from "lucide-react";
import StatCard from "./_components/stat-card";
import Activity from "./_components/activity";

const projects = [
  {
    name: "Website",
    description: "Redesign do site institucional",
    progress: 80,
  },
  {
    name: "Propeller",
    description: "Aplicação de produtividade",
    progress: 50,
  },
  {
    name: "Landing Page",
    description: "Página de lançamento",
    progress: 30,
  },
];

const tasks = [
  {
    title: "Finalizar dashboard",
    date: "Hoje",
  },
  {
    title: "Revisar documentação",
    date: "Amanhã",
  },
  {
    title: "Criar página de configurações",
    date: "03 Out",
  },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#080d1a] text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        {/* Header */}
        <header className="mb-8">
          <p className="mb-1 text-sm font-medium text-blue-400">
            Visão geral
          </p>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-white">
                Bom dia, Leonardo 👋
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
          <StatCard
            label="Projetos"
            value="6"
            icon={<FolderKanban size={18} />}
          />

          <StatCard
            label="Em andamento"
            value="3"
            icon={<ListTodo size={18} />}
          />

          <StatCard
            label="Concluídos"
            value="12"
            icon={<CheckCircle2 size={18} />}
          />
        </section>

        {/* Main content */}
        <section className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* Projects */}
          <div className="rounded-xl border border-slate-800 bg-[#0d1424]">
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Projetos recentes
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Acompanhe o progresso dos seus projetos.
                </p>
              </div>

              <button className="text-xs font-medium text-blue-400 transition hover:text-blue-300">
                Ver todos
              </button>
            </div>

            <div className="divide-y divide-slate-800">
              {projects.map((project) => (
                <div
                  key={project.name}
                  className="px-5 py-4 transition hover:bg-slate-900/40"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-slate-100">
                        {project.name}
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        {project.description}
                      </p>
                    </div>

                    <span className="text-xs font-medium text-slate-400">
                      {project.progress}%
                    </span>
                  </div>

                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity */}
          <div className="rounded-xl border border-slate-800 bg-[#0d1424]">
            <div className="border-b border-slate-800 px-5 py-4">
              <h2 className="text-sm font-semibold text-white">
                Atividade recente
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                O que aconteceu no workspace.
              </p>
            </div>

            <div className="space-y-5 px-5 py-5">
              <Activity
                title="Tarefa concluída"
                description="Finalizar autenticação"
                time="2h atrás"
              />

              <Activity
                title="Projeto atualizado"
                description="Propeller"
                time="5h atrás"
              />

              <Activity
                title="Novo projeto criado"
                description="Landing Page"
                time="Ontem"
              />
            </div>
          </div>
        </section>

        {/* Tasks */}
        <section className="mt-6 rounded-xl border border-slate-800 bg-[#0d1424]">
          <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-white">
                Próximas tarefas
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                O que precisa da sua atenção.
              </p>
            </div>

            <button className="text-xs font-medium text-blue-400 transition hover:text-blue-300">
              Ver tarefas
            </button>
          </div>

          <div className="divide-y divide-slate-800">
            {tasks.map((task) => (
              <div
                key={task.title}
                className="flex items-center gap-3 px-5 py-4 transition hover:bg-slate-900/40"
              >
                <Circle size={16} className="text-slate-600" />

                <span className="flex-1 text-sm text-slate-300">
                  {task.title}
                </span>

                <span className="text-xs text-slate-500">
                  {task.date}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}




