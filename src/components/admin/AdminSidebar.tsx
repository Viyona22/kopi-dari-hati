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
import { BarChart3, Users, ShoppingBag, UtensilsCrossed, Settings, Tag, TrendingUp } from "lucide-react"
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
    title: "Menu Analytics",
    url: "/admin/analytics",
    icon: TrendingUp,
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
    <Sidebar className="border-r border-gray-200 bg-white shadow-lg">
      <SidebarHeader className="border-b border-gray-100 p-6 bg-gradient-to-r from-white to-gray-50">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <img 
              src="https://cdn.builder.io/api/v1/image/assets/6881c5c08f454e4a8f857991aba7c465/840f8e820466cd972c9227284f37450b12ef6ca7?placeholderIfAbsent=true" 
              alt="Kopi dari Hati Logo" 
              className="w-12 h-12 rounded-full object-cover shadow-md ring-2 ring-[#d4462d]/20"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-gray-900 leading-tight">
              Kopi dari Hati
            </h1>
            <p className="text-sm text-[#d4462d] font-medium">
              Admin Panel
            </p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-3 py-6 bg-gradient-to-b from-gray-50/50 to-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-4 px-3">
            Navigasi
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    className="w-full group transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 data-[active=true]:bg-gradient-to-r data-[active=true]:from-[#d4462d] data-[active=true]:to-[#c23e2d] data-[active=true]:text-white data-[active=true]:shadow-lg rounded-xl mx-2 px-4 py-3"
                  >
                    <Link to={item.url} className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5 text-gray-600 group-hover:text-gray-800 group-data-[active=true]:text-white transition-all duration-300 group-data-[active=true]:scale-110" />
                      <span className="font-medium text-gray-700 group-hover:text-gray-900 group-data-[active=true]:text-white transition-all duration-300">
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
