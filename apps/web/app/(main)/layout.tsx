import { DashboardSidebar } from "../../components/dashboard-sidebar";

export default function MainLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex max-h-screen">
      <DashboardSidebar />
     <main className="flex-1 min-h-screen overflow-auto mt-12 md:mt-0">
         {children}
     </main>
    </div>
  );
}