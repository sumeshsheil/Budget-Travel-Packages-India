"use client";

import Image from "next/image";
import logo from "@/../public/images/logo/footer-logo.svg";
import { LoginForm } from "@/components/admin/auth/LoginForm";
import {
  Users,
  TrendingUp,
  Banknote,
  Activity,
  PieChart,
  Shield,
  Settings,
  LayoutDashboard,
} from "lucide-react";

/**
 * Full-fidelity Admin Dashboard skeleton rendered as a static background (Light Version).
 */
const AdminOverviewBg = () => (
  <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden bg-[#f8fafc]">
    <div className="flex h-full w-full">
      {/* ───── Sidebar ───── */}
      <div className="w-64 bg-white border-r border-gray-100 hidden lg:flex flex-col shrink-0">
        <div className="p-6 border-b border-gray-100 mb-8">
          <div className="w-36 h-10 bg-emerald-500/10 rounded-lg border border-dashed border-emerald-500/20 flex items-center justify-center">
            <div className="w-24 h-4 bg-emerald-500/20 rounded-full" />
          </div>
        </div>
        <div className="px-5 space-y-6">
          {[
            { label: "Dashboard", Icon: LayoutDashboard, active: true },
            { label: "Leads / Inquiries", Icon: TrendingUp },
            { label: "Agents", Icon: Users },
            { label: "Reports", Icon: PieChart },
            { label: "Security", Icon: Shield },
          ].map((item, i) => (
            <div
              key={item.label}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                item.active
                  ? "bg-emerald-50 border border-emerald-100 shadow-sm"
                  : "opacity-30"
              }`}
            >
              <item.Icon
                className={`w-5 h-5 ${item.active ? "text-emerald-500" : "text-gray-400"}`}
              />
              <div
                className={`h-4 rounded-full ${item.active ? "bg-emerald-200 w-24" : "bg-gray-200 w-20"}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ───── Main Admin Content ───── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <div className="h-16 border-b border-gray-100 flex items-center justify-between px-8 shrink-0 bg-white">
          <div className="w-48 h-6 bg-gray-100 rounded-full" />
          <div className="flex items-center gap-4">
            <div className="w-32 h-9 bg-emerald-50 rounded-lg border border-dashed border-emerald-200" />
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20" />
          </div>
        </div>

        {/* Dashboard Content Area */}
        <div className="flex-1 p-10 overflow-hidden space-y-10">
          {/* Greeting area */}
          <div className="flex justify-between items-end">
            <div className="space-y-3">
              <div className="w-64 h-10 bg-gray-900/5 rounded-2xl" />
              <div className="w-96 h-4 bg-gray-400/10 rounded-full" />
            </div>
          </div>

          {/* 4 Stats Cards */}
          <div className="grid grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-3xl border border-gray-100 bg-white p-6 space-y-5 shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <div className="w-20 h-3 bg-gray-100 rounded-full" />
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <div className="w-4 h-4 bg-emerald-500/20 rounded-sm" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div
                    className={`h-9 bg-gray-900/4 rounded-xl ${i % 2 === 0 ? "w-16" : "w-24"}`}
                  />
                  <div className="w-32 h-2.5 bg-gray-100 rounded-full" />
                </div>
              </div>
            ))}
          </div>

          {/* Activity / Charts Area */}
          <div className="grid grid-cols-7 gap-8">
            {/* Chart/Activity (4/7) */}
            <div className="col-span-4 rounded-[2.5rem] border border-gray-100 bg-white p-8 space-y-8 shadow-sm relative overflow-hidden h-80">
              <div className="flex justify-between items-center">
                <div className="w-40 h-6 bg-gray-100 rounded-lg" />
                <div className="w-24 h-8 bg-emerald-50 rounded-full" />
              </div>

              {/* Fake Chart bars */}
              <div className="flex items-end gap-4 h-40 pt-4">
                {[40, 70, 45, 90, 65, 80, 55, 75, 50, 85].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-emerald-500/10 border-t-2 border-emerald-500/20 rounded-t-lg transition-all"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Quick Actions (3/7) */}
            <div className="col-span-3 rounded-[2.5rem] border border-emerald-100 bg-emerald-50/20 p-8 space-y-8 relative overflow-hidden">
              <div className="w-36 h-6 bg-emerald-900/10 rounded-lg" />
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-12 bg-white rounded-2xl border border-dashed border-emerald-200 flex items-center px-4 gap-3"
                  >
                    <div className="w-5 h-5 bg-emerald-100 rounded-lg" />
                    <div className="w-32 h-3 bg-emerald-50 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-white text-slate-900">
      {/* Layer 1: Admin Dashboard Skeleton Background (Light) */}
      <AdminOverviewBg />

      {/* Layer 2: Premium White Blur Overlay */}
      <div className="absolute inset-0 z-1 backdrop-blur-sm bg-white/20" />

      {/* Layer 3: Central Login Container (Popup Style) */}
      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-white/50 overflow-hidden relative">
          {/* Close button placeholder to match image (non-functional for full page login) */}
          <div className="absolute top-6 right-8 text-gray-400 opacity-60">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <div className="pt-12 pb-6 text-center">
            <div className="flex justify-center mb-6 px-10">
              <Image
                src={logo}
                alt="Budget Travel Packages"
                width={200}
                height={80}
                className="h-14 w-auto object-contain"
                priority
              />
            </div>
            <div className="space-y-1 mt-8">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight text-center">
                Admin Panel
              </h1>
              <p className="text-gray-500 text-sm font-medium text-center">
                Please sign in to continue
              </p>
            </div>
          </div>

          <LoginForm />

          <div className="pb-10" />
        </div>
      </div>
    </div>
  );
}
