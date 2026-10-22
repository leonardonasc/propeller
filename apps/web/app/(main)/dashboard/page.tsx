import { CheckCircle2, CircleAlert, ClipboardList, FolderKanban, ListTodo } from "lucide-react";
import Link from "next/link";
import { headers } from "next/headers";
import { getProjects } from "../../src/services/projects";
import { getUser } from "../../src/services/users";
import type { Task } from "../../src/schemas/tasks";
import type { DashboardTask } from "../../src/types";
import { DashboardHeader } from "./_components/dashboard-header";

const dateLabel = new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "short" });

export default async function DashboardPage() {
  const cookie = (await headers()).get("cookie") || "";
  const [user, projects] = await Promise.all([getUser({ cookie }), getProjects()]);
  const tasks = projects.flatMap((project) => (project.tasks ?? []).map((task) => ({ ...task, projectName: project.name, projectId: project.id })));
  const completed = tasks.filter((task) => task.status === "completed").length;
  const dueTasks = tasks.filter((task) => task.status !== "completed" && task.dueDate && task.dueDate.getTime() <= Date.now());
  const upcomingTasks = tasks.filter((task) => task.status !== "completed" && task.dueDate && task.dueDate.getTime() > Date.now())
    .sort((a, b) => a.dueDate!.getTime() - b.dueDate!.getTime()).slice(0, 5);
  const completion = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  return (
    <div className="space-y-8">
      <DashboardHeader userName={user?.name ?? "Olá"} />
      <section aria-label="Resumo do workspace" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Projetos ativos" value={String(projects.length)} detail="Projetos em andamento" icon={<FolderKanban size={18} />} href="/projects" />
        <SummaryCard label="Tarefas no total" value={String(tasks.length)} detail={`${tasks.length - completed} ainda abertas`} icon={<ListTodo size={18} />} href="/projects" />
        <SummaryCard label="Concluídas" value={String(completed)} detail={`${completion}% das tarefas`} icon={<CheckCircle2 size={18} />} href="/projects" />
        <SummaryCard label="Precisam de atenção" value={String(dueTasks.length)} detail={dueTasks.length ? "Atrasadas ou para hoje" : "Nenhuma tarefa vencida"} icon={<CircleAlert size={18} />} href="/projects" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <article className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
            <div><h2 className="font-semibold">Seus projetos</h2><p className="mt-1 text-sm text-muted-foreground">Acompanhe o andamento do trabalho.</p></div>
            <Link href="/projects" className="text-sm font-medium text-primary hover:underline">Ver todos</Link>
          </div>
          {projects.length ? <ul className="divide-y divide-border">{projects.slice(0, 5).map((project) => {
            const projectTasks = project.tasks ?? [];
            const done = projectTasks.filter((task) => task.status === "completed").length;
            const progress = projectTasks.length ? Math.round(done / projectTasks.length * 100) : 0;
            return <li key={project.id}><Link href={`/projects/${project.id}`} className="block px-5 py-4 transition hover:bg-secondary/50 sm:px-6"><div className="flex items-center justify-between gap-4"><div className="min-w-0"><h3 className="truncate text-sm font-medium">{project.name}</h3><p className="mt-1 truncate text-xs text-muted-foreground">{project.description || `${projectTasks.length} tarefas`}</p></div><span className="shrink-0 text-xs font-semibold text-muted-foreground">{progress}%</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} /></div></Link></li>;
          })}</ul> : <div className="px-6 py-12 text-center"><FolderKanban className="mx-auto text-muted-foreground" size={24}/><p className="mt-3 text-sm font-medium">Nenhum projeto ainda</p><p className="mt-1 text-sm text-muted-foreground">Crie um projeto para começar a organizar suas tarefas.</p><Link href="/projects" className="mt-4 inline-flex text-sm font-semibold text-primary hover:underline">Criar primeiro projeto</Link></div>}
        </article>

        <article className="rounded-2xl border border-border bg-card">
          <div className="border-b border-border px-5 py-4 sm:px-6"><h2 className="font-semibold">Próximos prazos</h2><p className="mt-1 text-sm text-muted-foreground">Tarefas abertas com data definida.</p></div>
          {upcomingTasks.length ? <ul className="divide-y divide-border">{upcomingTasks.map((task) => <UpcomingTask key={task.id} task={task} />)}</ul> : <div className="px-6 py-12 text-center"><ClipboardList className="mx-auto text-muted-foreground" size={24}/><p className="mt-3 text-sm font-medium">Agenda livre</p><p className="mt-1 text-sm text-muted-foreground">Tarefas com prazo vão aparecer aqui.</p></div>}
        </article>
      </section>
    </div>
  );
}

function SummaryCard({ label, value, detail, icon, href }: { label: string; value: string; detail: string; icon: React.ReactNode; href: string }) {
  return <Link href={href} className="group rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary/40"><div className="flex items-start justify-between"><div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">{icon}</div><span className="text-3xl font-semibold tracking-tight">{value}</span></div><p className="mt-5 text-sm font-medium">{label}</p><p className="mt-1 text-xs text-muted-foreground">{detail}</p></Link>;
}

function UpcomingTask({ task }: { task: DashboardTask }) {
  return <li><Link href={`/projects/${task.projectId}`} className="flex items-center gap-3 px-5 py-4 transition hover:bg-secondary/50 sm:px-6"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"><ClipboardList size={16}/></span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{task.title}</span><span className="mt-1 block truncate text-xs text-muted-foreground">{task.projectName}</span></span><time className="shrink-0 text-xs font-medium text-muted-foreground">{dateLabel.format(task.dueDate!)}</time></Link></li>;
}
