"use client";

import { LoginForm } from "@/components/admin/auth/LoginForm";
import { Briefcase } from "lucide-react";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen h-screen flex items-center justify-center bg-white p-6">
      <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        {/* Left: Title + Description */}
        <div className="flex-1 max-w-md space-y-6 text-center lg:text-left animate-in fade-in slide-in-from-left-4 duration-700">
          <div className="space-y-3">
            <h1 className="text-3xl xl:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
              Portal Dashboard
            </h1>
            <p className="text-slate-500 text-base leading-relaxed">
              Your central hub for managing travel bookings, coordinating with
              agents, and delivering exceptional travel experiences.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 justify-center lg:justify-start pt-2">
            <Briefcase className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-semibold text-amber-700">
              We&apos;re hiring travel agents — Sign up below!
            </span>
          </div>

          <p className="text-slate-300 text-xs pt-4 hidden lg:block">
            © {new Date().getFullYear()} Budget Travel Packages. All rights
            reserved.
          </p>
        </div>

        {/* Right: Login Card */}
        <div className="w-full max-w-md animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
