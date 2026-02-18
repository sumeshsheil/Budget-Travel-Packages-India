import { requireCustomerAuth } from "@/lib/customer-auth-guard";
import { connectDB } from "@/lib/db/mongoose";
import Lead from "@/lib/db/models/Lead";
import Link from "next/link";
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
import { Plane, CreditCard, Clock, ArrowRight } from "lucide-react";
import { getStageColor, getStageLabel } from "@/lib/dashboard-utils";

export default async function DashboardOverviewPage() {
  const session = await requireCustomerAuth();
  await connectDB();

  const leads = await Lead.find({ customerId: session.user.id })
    .sort({ createdAt: -1 })
    .lean();

  const serialized = JSON.parse(JSON.stringify(leads));

  const totalBookings = serialized.length;
  const activeTrips = serialized.filter(
    (l: { stage: string }) => !["won", "lost", "stale"].includes(l.stage),
  ).length;
  const pendingPayments = serialized.filter(
    (l: { paymentStatus: string }) => l.paymentStatus === "pending",
  ).length;

  const recentBookings = serialized.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-linear-to-r from-emerald-600 to-emerald-800 rounded-xl p-6 md:p-8 text-white">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Welcome back, {session.user.name}! 👋
        </h1>
        <p className="mt-2 text-emerald-100 text-sm md:text-base">
          Track your bookings, manage payments, and stay updated on your travel
          plans.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Bookings
            </CardTitle>
            <Plane className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalBookings}</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Trips
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">
              {activeTrips}
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Payments
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">
              {pendingPayments}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Recent Bookings</CardTitle>
            <CardDescription>Your latest travel inquiries</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/bookings">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentBookings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Plane className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p>No bookings yet. Start your travel journey!</p>
              <Button
                asChild
                className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Link href="/">Browse Packages</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentBookings.map(
                (booking: {
                  _id: string;
                  destination: string;
                  tripType: string;
                  guests: number;
                  budget: number;
                  stage: string;
                  paymentStatus: string;
                  createdAt: string;
                }) => (
                  <Link
                    key={booking._id}
                    href={`/dashboard/bookings/${booking._id}`}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold truncate">
                          {booking.destination}
                        </p>
                        <Badge
                          className={`text-xs border ${getStageColor(booking.stage)}`}
                        >
                          {getStageLabel(booking.stage)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {booking.tripType} • {booking.guests} guests • ₹
                        {booking.budget?.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="text-right ml-4 shrink-0">
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(booking.createdAt), "MMM d, yyyy")}
                      </p>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform ml-auto mt-1" />
                    </div>
                  </Link>
                ),
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
