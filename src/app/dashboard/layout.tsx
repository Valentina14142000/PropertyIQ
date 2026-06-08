
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { DashboardNav } from "@/components/dashboard-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <DashboardNav />
        <SidebarInset className="flex flex-col flex-1 overflow-auto">
          <header className="h-16 border-b bg-card flex items-center px-8 shrink-0">
            <h1 className="text-xl font-headline font-semibold text-primary">Portal Dashboard</h1>
          </header>
          <main className="p-6 md:p-10 flex-1">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
