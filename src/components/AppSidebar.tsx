import { useState } from "react"
import { Mail, BarChart3, Key, Settings, Send, Clock, Server, Shield, LogOut, User, Users } from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"

const navigation = [
  { title: "Dashboard", url: "/", icon: BarChart3 },
  { title: "Send Email", url: "/send", icon: Send },
  { title: "Contacts", url: "/contacts", icon: Users },
  { title: "Infrastructure", url: "/infrastructure", icon: Server },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Enterprise", url: "/enterprise", icon: Shield },
  { title: "Email Logs", url: "/logs", icon: Clock },
  { title: "API Keys", url: "/api-keys", icon: Key },
  { title: "Settings", url: "/settings", icon: Settings },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname
  const isCollapsed = state === "collapsed"
  const { user, signOut } = useAuth()

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/"
    }
    return currentPath.startsWith(path)
  }

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium border-r-2 border-sidebar-primary" 
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground"

  return (
    <Sidebar
      className={isCollapsed ? "w-14" : "w-64"}
      collapsible="icon"
    >
      <SidebarContent className="bg-sidebar border-r border-sidebar-border">
        {/* Logo/Brand */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-lg font-bold text-sidebar-foreground">LocalMail</h1>
                <p className="text-xs text-sidebar-foreground/60">Email Platform</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup className="px-4 py-4">
          <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs font-medium mb-4">
            {!isCollapsed ? "Navigation" : ""}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/"}
                      className={getNavCls}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {!isCollapsed && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User section */}
        <div className="mt-auto p-4 border-t border-sidebar-border">
          {isCollapsed ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full p-2">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 text-primary-foreground" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem disabled>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user?.email || 'User'}</span>
                    <span className="text-xs text-muted-foreground">Signed in</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={signOut} className="text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start p-3 h-auto">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-sidebar-foreground truncate">
                        {user?.email || 'User'}
                      </p>
                      <p className="text-xs text-sidebar-foreground/60">Signed in</p>
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem onClick={signOut} className="text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  )
}