
import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  Calendar, 
  ShoppingBag, 
  UtensilsCrossed, 
  Settings 
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/admin",
  },
  {
    title: "Data Reservasi",
    icon: Calendar,
    url: "/admin/reservations",
  },
  {
    title: "Riwayat Pembelian",
    icon: ShoppingBag,
    url: "/admin/purchases",
  },
  {
    title: "Menu Makanan & Minuman",
    icon: UtensilsCrossed,
    url: "/admin/menu",
  },
  {
    title: "Pengaturan",
    icon: Settings,
    url: "/admin/settings",
  },
];

export function AdminSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r bg-white">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold">
            K
          </div>
          <div className="text-sm font-medium text-gray-900">
            Kopi dari Hati
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="w-full justify-start">
                      <a 
                        href={item.url} 
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg",
                          isActive && "bg-gray-200 text-gray-900 font-medium"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="text-sm">{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
