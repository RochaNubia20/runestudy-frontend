import { Home, BookOpen, Target, Gift, User } from "lucide-react";
import { NavLink } from "react-router-dom";
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
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { RuneLogo } from "./RuneLogo";

const menuItems = [
  { title: "Home", url: "/dashboard", icon: Home },
  { title: "Tarefas", url: "/tasks", icon: BookOpen },
  { title: "Habilidades", url: "/skills", icon: Target },
  { title: "Recompensas", url: "/rewards", icon: Gift },
  { title: "Perfil", url: "/profile", icon: User },
];

export function AppSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon" className="border-r-2 border-primary/30">
      <SidebarHeader className="border-b-2 border-primary/30 p-4">
        <div className="flex items-center gap-2 justify-between">
          {open && <RuneLogo size="sm" />}
          <SidebarTrigger className="ml-auto" />
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink 
                      to={item.url}
                      className={({ isActive }) =>
                        isActive 
                          ? "bg-primary/20 text-primary font-bold border-l-4 border-primary" 
                          : "hover:bg-muted/50"
                      }
                    >
                      <item.icon className="w-4 h-4" />
                      {open && <span className="text-xs">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
