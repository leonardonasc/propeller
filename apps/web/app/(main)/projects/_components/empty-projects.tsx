import ProjectCreateButton from "../project-create-button";

export function EmptyProjects() {
  return (
    <section className="flex min-h-80 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 text-center">
      <div className="mb-4 grid size-12 place-items-center rounded-xl bg-primary/10 text-2xl text-primary">+</div>
      <h2 className="font-semibold">Nenhum projeto ainda</h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
        Crie seu primeiro projeto para organizar tarefas e acompanhar o progresso.
      </p>
      <div className="mt-5"><ProjectCreateButton /></div>
    </section>
  );
}
