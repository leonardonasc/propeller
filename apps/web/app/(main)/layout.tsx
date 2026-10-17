import { DashboardSidebar } from "../../components/dashboard-sidebar"

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex h-dvh overflow-hidden">
      <DashboardSidebar />

      <main className="mx-auto w-full px-4 py-8 mt-10 md:mt-0 overflow-y-auto bg-background text-foreground">
        {children}
      </main>
    </div>
  )
}