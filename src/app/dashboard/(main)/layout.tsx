import { SessionProvider } from "next-auth/react";
import { DashboardSidebar } from "@/components/dashboard/layout/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/layout/DashboardHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { requireCustomerAuth } from "@/lib/customer-auth-guard";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireCustomerAuth();

  return (
    <SessionProvider>
      <SidebarProvider className="customer-dashboard font-sans antialiased bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        <DashboardSidebar />
        <SidebarInset className="dark:bg-slate-950">
          <DashboardHeader />
          <main className="flex-1 p-4 md:p-6 overflow-y-auto w-full bg-white dark:bg-gray-900 text-slate-900 dark:text-slate-100">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </SessionProvider>
  );
}
