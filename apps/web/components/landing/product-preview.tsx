import { Clock3, FolderKanban, LayoutDashboard, ListTodo } from "lucide-react";
import PropellerIcon from "../propeller-icon";

const previewNavigation = [
  { icon: LayoutDashboard, label: "Visão geral", active: true },
  { icon: FolderKanban, label: "Projetos", active: false },
  { icon: ListTodo, label: "Tarefas", active: false },
  { icon: Clock3, label: "Calendário", active: false },
];

export default function ProductPreview() {
  return <div className="relative mx-auto my-40 max-w-6xl sm:mt-24">
    <div className="absolute -inset-8 rounded-[40px] bg-blue-500/10 blur-3xl" />
    <div className="relative overflow-hidden rounded-2xl border border-slate-700/70 bg-[#0d1424] shadow-2xl shadow-black/40">
      <div className="flex h-11 items-center border-b border-slate-800 px-4"><div className="flex gap-1.5"><span className="size-2.5 rounded-full bg-slate-700"/><span className="size-2.5 rounded-full bg-slate-700"/><span className="size-2.5 rounded-full bg-slate-700"/></div><div className="mx-auto hidden rounded-md border border-slate-800 bg-[#080d1a] px-20 py-1 text-[10px] text-slate-400 sm:block">propeller.app</div><div className="w-10"/></div>
      <div className="grid min-h-[460px] grid-cols-1 md:grid-cols-[210px_1fr]">
        <aside className="hidden border-r border-slate-800 bg-[#0b1120] p-4 md:block"><div className="mb-8 flex items-center gap-2 text-sm font-semibold text-white"><div className="flex size-7 items-center justify-center rounded-lg bg-blue-600"><PropellerIcon size={15}/></div>Propeller</div><div className="space-y-1">{previewNavigation.map(({icon: Icon,label,active})=><div key={label} className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs ${active ? "bg-blue-500/10 text-blue-300" : "text-slate-400"}`}><Icon size={14}/>{label}</div>)}</div></aside>
        <div className="p-5 sm:p-7"><div className="flex items-end justify-between"><div><p className="text-xs text-slate-400">Segunda-feira, 6 de outubro</p><h2 className="mt-1 text-xl font-medium text-white">Bom dia, Usuário 👋</h2></div></div>
          <div className="mt-7 grid gap-3 sm:grid-cols-3">{[["Projetos","8","2 em andamento"],["Tarefas","24","7 para hoje"],["Concluídos","42","este mês"]].map(([title,value,caption])=><div key={title} className="rounded-xl border border-slate-800 bg-[#101827] p-4"><p className="text-[11px] text-slate-300">{title}</p><p className="mt-2 text-2xl font-medium text-white">{value}</p><p className="mt-1 text-[10px] text-slate-400">{caption}</p></div>)}</div>
          <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]"><div className="rounded-xl border border-slate-800 bg-[#101827] p-4"><div className="flex items-center justify-between"><p className="text-xs font-medium text-slate-300">Projetos recentes</p><span className="text-[10px] text-slate-400">Ver todos</span></div><div className="mt-5 space-y-5">{[["Website redesign",78],["Mobile app",52],["Marketing",31]].map(([name,progress])=><div key={String(name)}><div className="mb-2 flex justify-between text-[10px]"><span className="text-slate-400">{name}</span><span className="text-slate-300">{progress}%</span></div><div className="h-1.5 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-blue-500" style={{width:`${progress}%`}}/></div></div>)}</div></div>
            <div className="rounded-xl border border-slate-800 bg-[#101827] p-4"><p className="text-xs font-medium text-slate-300">Próximas tarefas</p><div className="mt-4 space-y-3">{["Revisar landing page","Enviar proposta","Finalizar documentação"].map((task,index)=><div key={task} className="flex items-center gap-3 rounded-lg bg-[#0d1424] p-3"><div className={`size-3.5 rounded-full border ${index===0?"border-blue-400 bg-blue-500/10":"border-slate-700"}`}/><span className="text-[10px] text-slate-400">{task}</span></div>)}</div></div></div>
        </div>
      </div>
    </div>
  </div>;
}
