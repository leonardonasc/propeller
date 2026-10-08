"use client"

import { authClient } from "../../../../lib/auth-client"


interface RoadmapItem {
    id: string
    title: string
    description: string | null
    status: "planned" | "in_progress" | "completed"
    category: "feature" | "improvement" | "bug"
    position: number
}

interface RoadmapListProps {
    roadmap: RoadmapItem[]
}

export default function RoadmapList({
    roadmap,
}: RoadmapListProps) {
    const { data: session } = authClient.useSession()

    const isAdmin = session?.user.role === "admin"

    return (
        <div className="space-y-4">
            {roadmap.map((item) => (
                <article
                    key={item.id}
                    className="rounded-lg border border-border bg-card p-5"
                >
                    <div className="flex items-start justify-between gap-6">
                        <div>
                            <h2 className="font-semibold">
                                {item.title}
                            </h2>

                            {item.description && (
                                <p className="mt-2 text-sm text-muted-foreground">
                                    {item.description}
                                </p>
                            )}
                        </div>

                        {isAdmin && (
                            <button
                                type="button"
                                className="rounded-md border border-border px-3 py-2 text-sm hover:bg-muted"
                            >
                                Editar
                            </button>
                        )}
                    </div>
                </article>
            ))}
        </div>
    )
}