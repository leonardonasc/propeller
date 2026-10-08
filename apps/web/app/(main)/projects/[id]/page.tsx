import { getProjectById } from "../../../src/services/projects"
import  ProjectWorkspace  from "./_components/project-workspace"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ProjectOverviewPage({ params }: PageProps) {
  const { id } = await params
  const project = await getProjectById(id)

  return <ProjectWorkspace project={project} />
}