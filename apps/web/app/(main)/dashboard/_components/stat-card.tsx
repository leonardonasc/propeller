
interface StatCardProps {
    label: string;
    value: string;
    icon: React.ReactNode;
}

export default function StatCard({ label, value, icon }: StatCardProps) {
    return (
        <div className="rounded-xl border border-slate-800 bg-[#0d1424] p-5">
            <div className="mb-4 flex size-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                {icon}
            </div>

            <p className="text-xs font-medium text-slate-500">{label}</p>

            <p className="mt-1 text-2xl font-semibold tracking-tight text-white">
                {value}
            </p>
        </div>
    );
}