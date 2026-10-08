import { getRoadmap } from "../../src/services/roadmaps"
import RoadmapList from "./_components/roadmap-list"


export default async function RoadmapPage() {
  const roadmap = await getRoadmap()

  return (
    <main className="py-8">
      <header className="mb-8">
        <p className="mb-2 text-sm font-medium text-primary">
          Roadmap
        </p>

        <h1 className="text-3xl font-semibold tracking-tight">
          O que estamos construindo
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Acompanhe o que está planejado, em desenvolvimento e concluído.
        </p>
      </header>

      <RoadmapList roadmap={roadmap} />
    </main>
  )
}