
interface ActivityProps {
    title: string;
    description: string;
    time: string;
}

export default function Activity({ title, description, time }: ActivityProps) {
    return (
        <div className="flex gap-3">
            <div className="mt-1 size-2 shrink-0 rounded-full bg-primary" />

            <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">{title}</p>

                <p className="mt-0.5 text-xs text-muted-foreground">
                    {description}
                </p>

                <p className="mt-1 text-[11px] text-muted-foreground">{time}</p>
            </div>
        </div>
    );
}
