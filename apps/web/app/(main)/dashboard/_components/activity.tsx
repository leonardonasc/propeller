
interface ActivityProps {
    title: string;
    description: string;
    time: string;
}

export default function Activity({ title, description, time }: ActivityProps) {
    return (
        <div className="flex gap-3">
            <div className="mt-1 size-2 shrink-0 rounded-full bg-blue-500" />

            <div className="min-w-0">
                <p className="text-sm font-medium text-slate-200">{title}</p>

                <p className="mt-0.5 text-xs text-slate-500">
                    {description}
                </p>

                <p className="mt-1 text-[11px] text-slate-600">{time}</p>
            </div>
        </div>
    );
}