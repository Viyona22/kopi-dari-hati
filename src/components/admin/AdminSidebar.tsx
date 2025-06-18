
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
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
    <Sidebar className="border-r border-gray-200 bg-white">
      <SidebarHeader className="border-b border-gray-100 p-6">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <img 
              src="/lovable-uploads/62d3ac6a-c98d-422a-967e-a7656fee38a2.png" 
              alt="Kopi dari Hati Logo" 
              className="w-12 h-12 rounded-full object-cover shadow-sm"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-gray-900 leading-tight">
              Kopi dari Hati
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              Admin Panel
            </p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-4 py-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 px-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    className="w-full group transition-all duration-200 ease-in-out hover:bg-gray-50 data-[active=true]:bg-[#d4462d] data-[active=true]:text-white rounded-lg px-3 py-2.5"
                  >
                    <Link to={item.url} className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5 text-gray-600 group-hover:text-gray-900 group-data-[active=true]:text-white transition-colors" />
                      <span className="font-medium text-gray-700 group-hover:text-gray-900 group-data-[active=true]:text-white transition-colors">
                        {item.title}
                      </span>
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
