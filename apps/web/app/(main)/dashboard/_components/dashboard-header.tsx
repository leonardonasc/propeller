import ProjectCreateButton from "../../projects/project-create-button";
import { PageHeader } from "../../_components/page-header";
import { LayoutDashboard } from "lucide-react";

function getDayGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export function DashboardHeader({ userName }: { userName: string }) {
  return (
    <PageHeader
      eyebrow="Visão geral"
      title={`${getDayGreeting()}, ${userName.split(" ")[0]} 👋`}
      description="Aqui está o resumo do seu workspace."
      actions={<ProjectCreateButton />}
      showBack={false}
      icon={LayoutDashboard}
      className="mb-8"
    />
  );
}
