import {
  Clock3,
  FolderKanban,
  LayoutDashboard,
  ListTodo,
} from "lucide-react";
import PropellerIcon from "../propeller-icon";

export default function ProductPreview() {
  const previewNavigation = [
    {
      icon: LayoutDashboard,
      label: "Visão geral",
      active: true,
    },
    {
      icon: FolderKanban,
      label: "Projetos",
      active: false,
    },
    {
      icon: ListTodo,
      label: "Tarefas",
      active: false,
    },
    {
      icon: Clock3,
      label: "Calendário",
      active: false,
    },
  ];

  return (
    <div className="relative mx-auto my-40 max-w-6xl sm:mt-24">
      <div className="absolute -inset-8 rounded-[40px] bg-blue-500/10 blur-3xl" />

      <div className="relative overflow-hidden rounded-2xl border border-slate-700/70 bg-[#0d1424] shadow-2xl shadow-black/40">
        {/* Browser bar */}
        <div className="flex h-11 items-center border-b border-slate-800 px-4">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
          </div>

          <div className="mx-auto hidden rounded-md border border-slate-800 bg-[#080d1a] px-20 py-1 text-[10px] text-slate-600 sm:block">
            app.propeller.so
          </div>

          <div className="w-10" />
        </div>

        <div className="grid min-h-[460px] grid-cols-1 md:grid-cols-[210px_1fr]">
          {/* Sidebar */}
          <aside className="hidden border-r border-slate-800 bg-[#0b1120] p-4 md:block">
            <div className="mb-8 flex items-center gap-2 text-sm font-semibold text-white">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600">
                <PropellerIcon size={15} />
              </div>

              Propeller
            </div>

            <div className="space-y-1">
              {previewNavigation.map(
                ({ icon: Icon, label, active }) => (
                  <div
                    key={label}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs ${active
                      ? "bg-blue-500/10 text-blue-400"
                      : "text-slate-500"
                      }`}
                  >
                    <Icon size={14} />
                    {label}
                  </div>
                ),
              )}
            </div>
          </aside>

          {/* Dashboard content */}
          <div className="p-5 sm:p-7">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-slate-500">
                  Segunda-feira, 6 de outubro
                </p>

                <h3 className="mt-1 text-xl font-medium text-white">
                  Bom dia, Leonardo.
                </h3>
              </div>

              <div className="hidden rounded-lg border border-slate-800 px-3 py-2 text-xs text-slate-400 sm:block">
                + Novo projeto
              </div>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {[
                ["Projetos", "8", "2 em andamento"],
                ["Tarefas", "24", "7 para hoje"],
                ["Concluídos", "42", "este mês"],
              ].map(([title, value, caption]) => (
                <div
                  key={title}
                  className="rounded-xl border border-slate-800 bg-[#101827] p-4"
                >
                  <p className="text-[11px] text-slate-500">
                    {title}
                  </p>

                  <p className="mt-2 text-2xl font-medium text-white">
                    {value}
                  </p>

                  <p className="mt-1 text-[10px] text-slate-600">
                    {caption}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
              {/* Projects */}
              <div className="rounded-xl border border-slate-800 bg-[#101827] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-slate-300">
                    Projetos recentes
                  </p>

                  <span className="text-[10px] text-slate-600">
                    Ver todos
                  </span>
                </div>

                <div className="mt-5 space-y-5">
                  {[
                    ["Website redesign", 78],
                    ["Mobile app", 52],
                    ["Marketing", 31],
                  ].map(([name, progress]) => (
                    <div key={String(name)}>
                      <div className="mb-2 flex justify-between text-[10px]">
                        <span className="text-slate-400">
                          {String(name)}
                        </span>

                        <span className="text-slate-600">
                          {progress}%
                        </span>
                      </div>

                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-blue-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tasks */}
              <div className="rounded-xl border border-slate-800 bg-[#101827] p-4">
                <p className="text-xs font-medium text-slate-300">
                  Próximas tarefas
                </p>

                <div className="mt-4 space-y-3">
                  {[
                    "Revisar landing page",
                    "Enviar proposta",
                    "Finalizar documentação",
                  ].map((task, index) => (
                    <div
                      key={task}
                      className="flex items-center gap-3 rounded-lg bg-[#0d1424] p-3"
                    >
                      <div
                        className={`h-3.5 w-3.5 rounded-full border ${index === 0
                          ? "border-blue-500 bg-blue-500/10"
                          : "border-slate-700"
                          }`}
                      />

                      <span className="text-[10px] text-slate-400">
                        {task}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}