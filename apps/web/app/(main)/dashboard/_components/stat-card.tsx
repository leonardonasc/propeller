
interface StatCardProps {
    label: string;
    value: string;
    icon: React.ReactNode;
}

export default function StatCard({ label, value, icon }: StatCardProps) {
    return (
        <div className="h-full rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40">
            <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {icon}
            </div>

            <p className="text-xs font-medium text-muted-foreground">{label}</p>

            <p className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
                {value}
            </p>
        </div>
    );
}
