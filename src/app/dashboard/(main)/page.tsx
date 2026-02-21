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
} from "lucide-react";
import {
  getStageColor,
  getStageLabel,
  getPaymentColor,
} from "@/lib/dashboard-utils";

export default async function DashboardOverviewPage() {
  const session = await requireCustomerAuth();
  await connectDB();

  // Fetch User for Profile Completeness
  const user = (await User.findById(session.user.id).lean()) as IUser;

  // Calculate Profile Completeness
  let completenessScore = 0;
  if (user.name) completenessScore += 25;
  if (user.phone) completenessScore += 25;
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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">
            {format(new Date(), "EEEE, MMMM do")}
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome back, {session.user.name}
          </h1>
        </div>
        <Button
          asChild
          className="rounded-full bg-black text-white hover:bg-gray-800 shadow-lg shadow-gray-200/50"
        >
          <Link href="/" className="flex items-center gap-2">
            <Plane className="h-4 w-4" />
            <span>Plan New Trip</span>
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Hero Card & Stats */}
        <div className="lg:col-span-2 space-y-8">
          {/* NEXT TRIP HERO CARD - CLEAN & AIRY */}
          {nextTrip ? (
            <div className="relative overflow-hidden rounded-3xl border bg-white p-8 md:p-10 shadow-sm transition-all hover:shadow-md">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Plane className="h-48 w-48 text-emerald-900 -rotate-12" />
              </div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-0 px-3 py-1 font-medium">
                    Upcoming Trip
                  </Badge>
                </div>

                <div className="space-y-1 mb-8">
                  <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">
                    Destination
                  </p>
                  <h2 className="text-5xl md:text-6xl font-serif font-medium tracking-tight text-gray-900 mb-2">
                    {nextTrip.destination}
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8 border-t border-gray-100 pt-6 max-w-md">
                  <div>
                    <div className="flex items-center gap-2 mb-1 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span className="text-xs uppercase tracking-wider font-semibold">
                        Dates
                      </span>
                    </div>
                    <p className="text-lg font-medium text-gray-900">
                      {format(new Date(nextTrip.createdAt), "MMMM d, yyyy")}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1 text-muted-foreground">
                      <UserIcon className="h-4 w-4" />
                      <span className="text-xs uppercase tracking-wider font-semibold">
                        Travelers
                      </span>
                    </div>
                    <p className="text-lg font-medium text-gray-900">
                      {nextTrip.guests} Guests
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    className="rounded-full bg-gray-900 text-white hover:bg-black px-8 h-12 text-base"
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
            <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50/30 p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-sm border mb-6">
                <Plane className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No upcoming trips
              </h3>
              <p className="text-muted-foreground max-w-sm mx-auto mb-8">
                Your itinerary is empty. Browse our curated packages to find
                your next adventure.
              </p>
              <Button
                asChild
                className="rounded-full bg-black text-white px-8 h-12"
              >
                <Link href="/">Browse Packages</Link>
              </Button>
            </div>
          )}

          {/* QUICK STATS ROW - MINIMAL */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 border-t pt-8">
            <div className="rounded-2xl border bg-white p-4 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Total Bookings
              </span>
              <span className="text-3xl font-light text-gray-900">
                {totalBookings}
              </span>
              <span className="text-sm text-muted-foreground mt-1">Trips</span>
            </div>
            <div className="rounded-2xl border bg-white p-4 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Active
              </span>
              <span className="text-3xl font-light text-emerald-600">
                {activeTrips}
              </span>
              <span className="text-sm text-muted-foreground mt-1">
                Ongoing
              </span>
            </div>
            <div className="rounded-2xl border bg-white p-4 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Pending
              </span>
              <span className="text-3xl font-light text-amber-600">
                {pendingPayments}
              </span>
              <span className="text-sm text-muted-foreground mt-1">
                Actions
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Profile Status & Rewards Teaser */}
        <div className="lg:h-full lg:min-h-[500px]">
          {completenessScore < 100 ? (
            <div className="bg-white rounded-3xl border shadow-sm p-6 h-full flex flex-col">
              {/* Profile Status Card */}
              <div className="flex-1 flex flex-col mb-8">
                <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden flex-1 flex flex-col justify-center">
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

                    <p className="text-gray-300 text-sm leading-relaxed">
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
                <div className="relative bg-emerald-50/30 border border-emerald-100 rounded-3xl p-6 text-center overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Gift className="h-16 w-16 text-emerald-900 rotate-12" />
                  </div>
                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-widest uppercase mb-3">
                      Coming Soon
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">
                      Travel Rewards
                    </h4>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Earn points on every trip and unlock benefits.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Full Hero Rewards Teaser as Only Content */
            <div className="bg-white rounded-3xl border shadow-sm p-10 h-full flex flex-col items-center justify-center text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
              <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>

              <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700">
                <Gift className="h-64 w-64 text-emerald-900 rotate-12" />
              </div>

              <div className="relative z-10 space-y-8 max-w-[280px]">
                <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase border border-emerald-200">
                  <Sparkles className="h-3 w-3" />
                  Coming Soon
                </div>

                <div className="space-y-4">
                  <div className="h-20 w-20 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-sm border border-emerald-100 border-dashed">
                    <Gift className="h-10 w-10 text-emerald-600" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-serif font-medium tracking-tight text-gray-900">
                      Travel Rewards
                    </h3>
                    <p className="text-muted-foreground text-base leading-relaxed">
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
                    <div className="h-1 w-8 bg-emerald-100 rounded-full overflow-hidden">
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
