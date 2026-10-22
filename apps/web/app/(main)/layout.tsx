import type { Metadata } from "next";
import { DashboardSidebar } from "../../components/dashboard-sidebar"
import { ThemeInitializer } from "../../components/theme-picker"
import AppToaster from "../../components/app-toaster"
import { WorkspaceTopbar } from "../../components/workspace-topbar"

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div id="main-app" className="flex h-dvh overflow-hidden bg-background text-foreground">
      <ThemeInitializer />
      <AppToaster />
      <DashboardSidebar />

      <main className="mt-14 min-w-0 flex-1 overflow-y-auto px-4 pb-8 pt-4 sm:px-6 md:mt-0 md:px-8 md:pb-8 md:pt-5 xl:px-10">
        <div className="mx-auto w-full">
          <WorkspaceTopbar />
          {children}
        </div>
      </main>
    </div>
  )
}
