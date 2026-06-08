
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Building2, 
  Calculator, 
  TrendingUp, 
  UserCircle,
  LogOut,
  BarChart3
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from "@/components/ui/sidebar"

const mainNavItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Properties", href: "/dashboard/properties", icon: Building2 },
  { name: "Calculators", href: "/dashboard/calculators", icon: Calculator },
  { name: "Market Trends", href: "/dashboard/market", icon: TrendingUp },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="py-6 px-4">
        <div className="flex items-center gap-2">
          <div className="bg-accent rounded-lg p-2 flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-headline font-bold text-white group-data-[collapsible=icon]:hidden">
            Property<span className="text-accent">IQ</span>
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/60">Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.name}
                    className={cn(
                      "transition-all duration-200",
                      pathname === item.href 
                        ? "bg-accent text-white hover:bg-accent/90" 
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <Link href={item.href}>
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="text-white/80 hover:bg-white/10 hover:text-white">
              <UserCircle className="w-5 h-5" />
              <span>My Profile</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="text-white/80 hover:bg-white/10 hover:text-white">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
