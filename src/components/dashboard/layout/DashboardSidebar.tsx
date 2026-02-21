"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Home, Plane, CreditCard, UserIcon, Users } from "lucide-react";
import Image from "next/image";
import logo from "@/../public/images/logo/footer-logo.svg";

import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "motion/react";

export function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { state } = useSidebar();

  const user = {
    name: session?.user?.name || "Guest",
    email: session?.user?.email || "",
  };

  const navItems = [
    {
      title: "Overview",
      url: "/dashboard",
      icon: Home,
      isActive: pathname === "/dashboard",
    },
    {
      title: "My Bookings",
      url: "/dashboard/bookings",
      icon: Plane,
      isActive: pathname.startsWith("/dashboard/bookings"),
    },
    {
      title: "Profile",
      url: "/dashboard/profile",
      icon: UserIcon,
      isActive: pathname.startsWith("/dashboard/profile"),
    },
  ];

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="hover:bg-transparent"
            >
              <Link href="/dashboard" className="flex items-center">
                <AnimatePresence mode="wait" initial={false}>
                  {isCollapsed ? (
                    <motion.div
                      key="icon"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                      className="flex aspect-square size-8 items-center justify-center rounded-lg bg-linear-to-br from-emerald-500 to-emerald-700 text-white shadow-sm"
                    >
                      <Plane className="size-4" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="logo"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-1 items-center"
                    >
                      <Image
                        src={logo}
                        alt="Budget Travel Packages"
                        width={180}
                        height={60}
                        className="h-10 w-auto object-contain"
                        priority
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 mb-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={item.isActive}
                    className="transition-all duration-200 py-6"
                  >
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon className="size-5!" />
                      <span className="text-base font-medium">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </motion.div>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg bg-emerald-600 text-white font-medium">
                  {user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight ml-1">
                <span className="truncate font-semibold text-base">
                  {user.name}
                </span>
                <span className="truncate text-sm text-muted-foreground">
                  {user.email}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
