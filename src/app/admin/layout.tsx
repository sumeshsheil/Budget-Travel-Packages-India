import { AdminProviders } from "@/components/admin/AdminProviders";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProviders>
      <div className="font-sans antialiased text-slate-900 bg-slate-50 dark:bg-slate-950 dark:text-slate-50 min-h-screen">
        {children}
      </div>
    </AdminProviders>
  );
}
