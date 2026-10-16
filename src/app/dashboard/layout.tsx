import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardNav } from "@/components/dashboard-nav"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardNav />
      <SidebarInset className="min-w-0">
        <header className="sticky top-0 z-30 h-14 sm:h-16 border-b bg-card/95 backdrop-blur flex items-center gap-3 px-4 sm:px-8 shrink-0">
          <SidebarTrigger aria-label="Toggle navigation" />
          <h1 className="text-lg sm:text-xl font-headline font-semibold text-primary">Portal Dashboard</h1>
        </header>
        <main className="p-4 sm:p-6 md:p-10 flex-1 min-w-0">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
