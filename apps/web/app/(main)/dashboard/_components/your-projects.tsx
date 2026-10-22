'use client'
import { useRouter } from "next/navigation";
import type { Project } from "../../../src/schemas/project";

interface ProjectCardProps {
    // como eu recebo mais de um projeto, eu preciso tipar como um array de projetos
    projects: Project[];
}

export default function YourProjects({ projects }: ProjectCardProps) {

    const router = useRouter();
    const handleProjectClick = (id: string) => {
        router.push(`/projects/${id}`);
    };

    return (
        <div className="divide-y divide-border">
            {projects.map((project) => (
                <div
                    key={project.id}
                    onClick={() => handleProjectClick(project.id)}
                    className="px-5 py-4 transition hover:cursor-pointer hover:bg-secondary"
                >
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h3 className="text-sm font-medium text-foreground">
                                {project.name}
                            </h3>

                            <p className="mt-1 text-xs text-muted-foreground">
                                {project.description}
                            </p>
                        </div>

                        <span className="text-xs font-medium text-muted-foreground">
                            {/* {project}% */} 10%
                        </span>
                    </div>

                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
                        <div
                            className="h-full rounded-full bg-primary transition-all"
                            // style={{ width: `${project.progress}%` }}
                            style={{ width: 20 }}
                        />
                    </div>
                </div>
            ))}
        </div>
    )
}
