
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { BarChart3, Users, ShoppingBag, UtensilsCrossed, Settings, Tag } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

const menuItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: BarChart3,
  },
  {
    title: "Reservasi",
    url: "/admin/reservations",
    icon: Users,
  },
  {
    title: "Pembelian",
    url: "/admin/purchases",
    icon: ShoppingBag,
  },
  {
    title: "Menu",
    url: "/admin/menu",
    icon: UtensilsCrossed,
  },
  {
    title: "Kategori",
    url: "/admin/categories",
    icon: Tag,
  },
  {
    title: "Pengaturan",
    url: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const location = useLocation()

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[#d4462d] font-bold">
            Admin Panel
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
