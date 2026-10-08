import { DashboardSidebar } from "../../components/dashboard-sidebar"

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex h-dvh overflow-hidden">
      <DashboardSidebar />

      <main className="min-w-0 flex-1 overflow-y-auto bg-background px-0 py-8 text-foreground sm:px-8">
        {children}
      </main>
    </div>
  )
}