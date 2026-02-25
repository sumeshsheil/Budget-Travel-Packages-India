import { requireCustomerAuth } from "@/lib/customer-auth-guard";
import { connectDB } from "@/lib/db/mongoose";
import Lead, { ILead } from "@/lib/db/models/Lead";
import Link from "next/link";
import User, { IUser } from "@/lib/db/models/User";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Plane,
  CreditCard,
  Calendar,
  ArrowRight,
  User as UserIcon,
  CheckCircle2,
  Gift,
  Sparkles,
  AlertTriangle,
  FileText,
} from "lucide-react";
import {
  getStageColor,
  getStageLabel,
  getPaymentColor,
} from "@/lib/dashboard-utils";
import { PlanTripButton } from "@/components/dashboard/PlanTripButton";

export default async function DashboardOverviewPage() {
  const session = await requireCustomerAuth();
  await connectDB();

  // Fetch User for Profile Completeness
  const user = (await User.findById(session.user.id).lean()) as IUser;

  // Profile is complete when phone is verified AND aadhaar is uploaded
  const isProfileComplete =
    user.isPhoneVerified && (user.documents?.aadharCard?.length || 0) > 0;

  // Prepare user data for UI components
  const uiUser = {
    name: user.name,
    email: user.email,
    phone: user.phone,
    gender: user.gender,
    isPhoneVerified: user.isPhoneVerified,
    isProfileComplete: !!isProfileComplete,
  };

  // Calculate Profile Completeness
  let completenessScore = 0;
  if (user.name) completenessScore += 25;
  if (user.isPhoneVerified) completenessScore += 25;
  if (user.gender) completenessScore += 25;
  if ((user.documents?.aadharCard?.length || 0) > 0) completenessScore += 25;

  const leads = await Lead.find({ customerId: session.user.id })
    .sort({ createdAt: -1 })
    .lean();

  const serialized = JSON.parse(JSON.stringify(leads));

  const totalBookings = serialized.length;
  // Active = not won, lost, stale. Pending or in progress.
  // Actually "won" implies a confirmed trip which might still be upcoming.
  // Let's count "Active" as anything not Lost or Stale for now, or maybe focused on "Upcoming Trips" (Won + Future Date).
  const activeTrips = serialized.filter(
    (l: { stage: string }) => !["lost", "stale"].includes(l.stage),
  ).length;

  const pendingPayments = serialized.filter(
    (l: { paymentStatus: string }) => l.paymentStatus === "pending",
  ).length;

  const nextTrip = serialized.find(
    (l: { stage: string }) => !["lost", "stale"].includes(l.stage),
  ); // First active/upcoming trip

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      {/* Profile Incomplete Banner for users with existing bookings */}
      {!isProfileComplete && totalBookings > 0 && (
        <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3 flex-1">
            <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center shrink-0">
              <FileText className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-900 dark:text-amber-200">
                Complete your profile & upload documents
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                We need Aadhaar for domestic trips and Aadhaar + Passport for
                international trips for each traveler.
              </p>
            </div>
          </div>
          <Button
            asChild
            size="sm"
            className="rounded-full bg-amber-600 hover:bg-amber-700 text-white border-none shrink-0 shadow-sm"
          >
            <Link href="/dashboard/profile">
              Complete Profile
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
            {format(new Date(), "EEEE, MMMM do")}
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome back, {session.user.name}
          </h1>
        </div>
        <PlanTripButton user={uiUser} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Hero Card & Stats */}
        <div className="lg:col-span-2 space-y-8">
          {/* NEXT TRIP HERO CARD - CLEAN & AIRY */}
          {nextTrip ? (
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 md:p-10 shadow-sm transition-all hover:shadow-md">
              <div className="absolute top-0 right-0 p-8 opacity-[0.04] dark:opacity-[0.07]">
                <Plane className="h-48 w-48 text-emerald-700 dark:text-emerald-400 -rotate-12" />
              </div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 hover:bg-emerald-200 border-0 px-3 py-1 font-medium">
                    Upcoming Trip
                  </Badge>
                </div>

                <div className="space-y-1 mb-8">
                  <p className="text-slate-500 dark:text-slate-400 font-medium uppercase tracking-widest text-xs">
                    Destination
                  </p>
                  <h2 className="text-5xl md:text-6xl font-serif font-medium tracking-tight text-slate-900 dark:text-white mb-2">
                    {nextTrip.destination}
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8 border-t border-slate-100 dark:border-slate-800 pt-6 max-w-md">
                  <div>
                    <div className="flex items-center gap-2 mb-1 text-slate-400 dark:text-slate-500">
                      <Calendar className="h-4 w-4" />
                      <span className="text-xs uppercase tracking-wider font-semibold">
                        Dates
                      </span>
                    </div>
                    <p className="text-lg font-medium text-slate-900 dark:text-white">
                      {format(new Date(nextTrip.createdAt), "MMMM d, yyyy")}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1 text-slate-400 dark:text-slate-500">
                      <UserIcon className="h-4 w-4" />
                      <span className="text-xs uppercase tracking-wider font-semibold">
                        Travelers
                      </span>
                    </div>
                    <p className="text-lg font-medium text-slate-900 dark:text-white">
                      {nextTrip.guests} Guests
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    className="rounded-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white px-8 h-12 text-base shadow-lg shadow-emerald-600/20"
                    asChild
                  >
                    <Link href={`/dashboard/bookings/${nextTrip._id}`}>
                      View Itinerary
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="h-20 w-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm border border-slate-200 dark:border-slate-700 mb-6">
                <Plane className="h-8 w-8 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-xl font-medium text-slate-900 dark:text-white mb-2">
                No upcoming trips
              </h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-8">
                Your itinerary is empty. Browse our curated packages to find
                your next adventure.
              </p>
              <Button
                asChild
                className="rounded-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white px-8 h-12"
              >
                <Link href="/">Browse Packages</Link>
              </Button>
            </div>
          )}

          {/* QUICK STATS ROW - MINIMAL */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 border-t border-slate-200 dark:border-slate-800 pt-8">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex flex-col items-center justify-center text-center shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                Total Bookings
              </span>
              <span className="text-3xl font-light text-slate-900 dark:text-white">
                {totalBookings}
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Trips
              </span>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex flex-col items-center justify-center text-center shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                Active
              </span>
              <span className="text-3xl font-light text-emerald-600 dark:text-emerald-400">
                {activeTrips}
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Ongoing
              </span>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex flex-col items-center justify-center text-center shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                Pending
              </span>
              <span className="text-3xl font-light text-orange-600 dark:text-orange-400">
                {pendingPayments}
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Actions
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Profile Status & Rewards Teaser */}
        <div className="lg:h-full lg:min-h-[500px]">
          {completenessScore < 100 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 h-full flex flex-col">
              {/* Profile Status Card */}
              <div className="flex-1 flex flex-col mb-6">
                <div className="bg-linear-to-br from-slate-800 to-slate-900 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden flex-1 flex flex-col justify-center">
                  <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>

                  <div className="relative z-10 space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-xl">Profile Status</h3>
                      <span className="text-3xl font-bold text-emerald-400">
                        {completenessScore}%
                      </span>
                    </div>

                    <div className="w-full bg-white/10 rounded-full h-3">
                      <div
                        className="bg-emerald-500 h-3 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                        style={{ width: `${completenessScore}%` }}
                      ></div>
                    </div>

                    <p className="text-slate-300 text-sm leading-relaxed">
                      Complete your profile for faster booking approvals and
                      personalized recommendations.
                    </p>

                    <Button
                      variant="secondary"
                      size="lg"
                      className="w-full rounded-full bg-emerald-500 text-white hover:bg-emerald-600 border-0 font-bold shadow-lg shadow-emerald-500/20"
                      asChild
                    >
                      <Link href="/dashboard/profile">Complete Profile</Link>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Minimal Rewards Teaser */}
              <div className="relative group transition-all duration-300">
                <div className="relative bg-emerald-50/30 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 rounded-3xl p-6 text-center overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Gift className="h-16 w-16 text-emerald-900 dark:text-emerald-400 rotate-12" />
                  </div>
                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-widest uppercase mb-3">
                      Coming Soon
                    </div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                      Travel Rewards
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      Earn points on every trip and unlock benefits.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Full Hero Rewards Teaser as Only Content */
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-10 h-full flex flex-col items-center justify-center text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-50 dark:bg-emerald-950/40 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
              <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-indigo-50 dark:bg-indigo-950/40 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>

              <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700">
                <Gift className="h-64 w-64 text-emerald-900 rotate-12" />
              </div>

              <div className="relative z-10 space-y-8 max-w-[280px]">
                <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase border border-emerald-200 dark:border-emerald-800">
                  <Sparkles className="h-3 w-3" />
                  Coming Soon
                </div>

                <div className="space-y-4">
                  <div className="h-20 w-20 bg-emerald-50 dark:bg-emerald-900/50 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-sm border border-dashed border-emerald-200 dark:border-emerald-800">
                    <Gift className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-serif font-medium tracking-tight text-slate-900 dark:text-white">
                      Travel Rewards
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
                      Your profile is set! We&apos;re now working on a special
                      rewards program just for you. Earn points on every trip to
                      unlock your next adventure.
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="text-[10px] font-bold text-emerald-600/40 uppercase tracking-[0.2em]">
                      Upcoming Feature
                    </span>
                    <div className="h-1 w-8 bg-emerald-100 dark:bg-emerald-900 rounded-full overflow-hidden">
                      <div className="h-full w-1/2 bg-emerald-500 rounded-full animate-shimmer"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
