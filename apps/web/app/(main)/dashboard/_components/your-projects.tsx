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
        <div className="divide-y divide-slate-800">
            {projects.map((project) => (
                <div
                    key={project.id}
                    onClick={() => handleProjectClick(project.id)}
                    className="px-5 py-4 transition hover:bg-slate-900/40 hover:cursor-pointer hover:scale-095"
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
                            {/* {project}% */} 10%
                        </span>
                    </div>

                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
                        <div
                            className="h-full rounded-full bg-blue-600 transition-all"
                            // style={{ width: `${project.progress}%` }}
                            style={{ width: 20 }}
                        />
                    </div>
                </div>
            ))}
        </div>
    )
}