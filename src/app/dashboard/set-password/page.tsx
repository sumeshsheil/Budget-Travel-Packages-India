"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  CheckCircle,
  Plane,
  Calendar,
  CreditCard,
  Gift,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import logo from "@/../public/images/logo/footer-logo.svg";

/**
 * Full-fidelity Dashboard Overview skeleton rendered as a static background.
 * This mimics the real dashboard layout (sidebar + overview content) at full
 * opacity, so a blur overlay on top produces the same effect as the homepage
 * login popup where the actual page is visible but blurred behind the modal.
 */
const DashboardOverviewBg = () => (
  <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden bg-slate-50">
    <div className="flex h-full w-full">
      {/* ───── Sidebar ───── */}
      <div className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col shrink-0">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <div className="w-36 h-10 bg-gray-200 rounded-lg" />
        </div>
        {/* Nav items */}
        <div className="p-5 space-y-2">
          {["Overview", "Bookings", "Profile", "Support"].map((label, i) => (
            <div
              key={label}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                i === 0 ? "bg-emerald-50 border border-emerald-200" : ""
              }`}
            >
              <div
                className={`w-5 h-5 rounded ${i === 0 ? "bg-emerald-500" : "bg-gray-300"}`}
              />
              <span
                className={`text-sm font-medium ${i === 0 ? "text-emerald-700" : "text-gray-500"}`}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ───── Main Content ───── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header bar */}
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
          <div className="w-48 h-7 bg-gray-200 rounded-lg" />
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-200" />
            <div className="w-28 h-9 bg-gray-200 rounded-lg" />
          </div>
        </div>

        {/* Overview Content */}
        <div className="flex-1 p-8 overflow-hidden">
          {/* Greeting area */}
          <div className="flex justify-between items-end mb-8">
            <div className="space-y-2">
              <div className="w-36 h-4 bg-gray-200 rounded-full" />
              <div className="w-72 h-9 bg-gray-300 rounded-xl" />
            </div>
            <div className="w-36 h-11 rounded-full bg-gray-900 flex items-center justify-center gap-2">
              <Plane className="h-4 w-4 text-white" />
              <span className="text-xs font-medium text-white">
                Plan New Trip
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2/3 */}
            <div className="lg:col-span-2 space-y-8">
              {/* Hero Trip Card */}
              <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 shadow-sm h-72">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                  <Plane className="h-40 w-40 text-emerald-900 -rotate-12" />
                </div>
                <div className="relative z-10 flex flex-col h-full justify-end">
                  <div className="w-28 h-7 bg-emerald-100 rounded-full mb-4" />
                  <div className="w-48 h-5 bg-gray-200 rounded mb-1" />
                  <div className="w-64 h-14 bg-gray-200 rounded-xl mb-6" />
                  <div className="grid grid-cols-2 gap-6 border-t border-gray-100 pt-5 max-w-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        <div className="w-10 h-3 bg-gray-200 rounded" />
                      </div>
                      <div className="w-28 h-5 bg-gray-200 rounded" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <CreditCard className="h-3.5 w-3.5 text-gray-400" />
                        <div className="w-14 h-3 bg-gray-200 rounded" />
                      </div>
                      <div className="w-20 h-5 bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-6 border-t border-gray-100 pt-6">
                {[
                  { label: "Total Bookings", value: "3", sub: "Trips" },
                  {
                    label: "Active",
                    value: "1",
                    sub: "Ongoing",
                    color: "text-emerald-500",
                  },
                  {
                    label: "Pending",
                    value: "1",
                    sub: "Actions",
                    color: "text-amber-500",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl border border-gray-200 bg-white p-4 flex flex-col items-center justify-center text-center"
                  >
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
                      {s.label}
                    </span>
                    <span
                      className={`text-3xl font-light ${s.color || "text-gray-800"}`}
                    >
                      {s.value}
                    </span>
                    <span className="text-xs text-gray-400 mt-1">{s.sub}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 1/3 – Profile Status */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 flex flex-col">
                {/* Dark profile card */}
                <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-3xl p-6 text-white relative overflow-hidden mb-6">
                  <div className="absolute top-0 right-0 -mr-8 -mt-8 w-28 h-28 bg-white/10 rounded-full blur-2xl" />
                  <div className="relative z-10 space-y-5">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-base">
                        Profile Status
                      </span>
                      <span className="text-2xl font-bold text-emerald-400">
                        75%
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2.5">
                      <div className="bg-emerald-500 h-2.5 rounded-full w-3/4 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    </div>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      Complete your profile for faster approvals.
                    </p>
                    <div className="w-full h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">
                        Complete Profile
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rewards teaser */}
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-5 text-center">
                  <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-widest uppercase mb-2">
                    <Sparkles className="h-2.5 w-2.5" />
                    Coming Soon
                  </div>
                  <p className="text-xs font-semibold text-gray-800">
                    Travel Rewards
                  </p>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    Earn points on every trip
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

function SetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing token. Please check your email link.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to set password.");
      } else {
        const result = await signIn("credentials", {
          email: data.email,
          password: password,
          redirect: false,
        });

        if (result?.error) {
          setError(
            "Password set, but auto-login failed. Please log in manually.",
          );
          setTimeout(() => {
            router.push("/dashboard/login");
          }, 3000);
        } else {
          setSuccess(true);
          setTimeout(() => {
            router.push("/dashboard");
          }, 3000);
        }
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Layer 1: Full dashboard skeleton background */}
        <DashboardOverviewBg />

        {/* Layer 2: Blur overlay */}
        <div className="absolute inset-0 z-1 backdrop-blur-md bg-black/30" />

        {/* Layer 3: Form card */}
        <div className="relative z-2 min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-2xl border border-white/30 bg-white/95 backdrop-blur-xl text-center">
            <CardContent className="pt-12 pb-12 space-y-8">
              <div className="mx-auto flex justify-center mb-6">
                <Image
                  src={logo}
                  alt="Budget Travel Packages"
                  width={240}
                  height={80}
                  className="h-16 w-auto object-contain"
                  priority
                />
              </div>
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100/60 shadow-inner">
                <CheckCircle className="h-12 w-12 text-emerald-600" />
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                  Access Granted!
                </h2>
                <p className="text-lg text-secondary-text px-4 font-medium">
                  Your portal is being prepared. Redirecting to your personal
                  dashboard...
                </p>
              </div>
              <Link href="/dashboard" className="block px-6 pb-2">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-lg font-bold shadow-xl shadow-emerald-600/30 transition-all hover:scale-[1.03] active:scale-95">
                  Enter Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Layer 1: Full dashboard skeleton background */}
      <DashboardOverviewBg />

      {/* Layer 2: Blur overlay */}
      <div className="absolute inset-0 z-1 backdrop-blur-md bg-black/30" />

      {/* Layer 3: Form card */}
      <div className="relative z-2 min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border border-white/30 bg-white/95 backdrop-blur-xl">
          <CardHeader className="text-center space-y-6 pb-2 pt-10">
            <div className="mx-auto flex justify-center mb-2">
              <Image
                src={logo}
                alt="Budget Travel Packages"
                width={260}
                height={90}
                className="h-16 w-auto object-contain"
                priority
              />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-extrabold tracking-tight text-gray-900 leading-tight">
                Create Your Password
              </CardTitle>
              <CardDescription className="text-base text-secondary-text font-medium">
                Secure your account to begin your journey with us.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-6 pb-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50/80 text-red-700 text-sm p-4 rounded-xl border border-red-200/50 font-medium animate-in slide-in-from-top-2">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label
                  className="text-sm font-bold text-gray-800 ml-1"
                  htmlFor="password"
                >
                  New Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 8 strong characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="h-12 pr-12 bg-white/50 border-gray-200/60 focus:bg-white transition-all text-base rounded-xl"
                    disabled={!token}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  className="text-sm font-bold text-gray-800 ml-1"
                  htmlFor="confirmPassword"
                >
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  className="h-12 bg-white/50 border-gray-200/60 focus:bg-white transition-all text-base rounded-xl"
                  disabled={!token}
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-95"
                disabled={loading || !token}
              >
                {loading ? "Securing Account..." : "Activate My Account"}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground font-medium">
                Returning Member?{" "}
                <Link
                  href="/dashboard/login"
                  className="text-emerald-600 hover:text-emerald-700 font-bold transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
        </div>
      }
    >
      <SetPasswordForm />
    </Suspense>
  );
}
