import { requireCustomerAuth } from "@/lib/customer-auth-guard";
import { connectDB } from "@/lib/db/mongoose";
import Lead from "@/lib/db/models/Lead";
import Link from "next/link";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plane, ArrowRight, MapPin, Users, IndianRupee } from "lucide-react";
import {
  getStageColor,
  getStageLabel,
  getPaymentColor,
} from "@/lib/dashboard-utils";

export default async function BookingsPage() {
  const session = await requireCustomerAuth();
  await connectDB();

  const leads = await Lead.find({ customerId: session.user.id })
    .sort({ createdAt: -1 })
    .lean();

  const serialized = JSON.parse(JSON.stringify(leads));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          My Bookings
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Track all your travel inquiries and bookings
        </p>
      </div>

      {serialized.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="text-center py-12">
            <Plane className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-30" />
            <h3 className="text-lg font-semibold">No bookings yet</h3>
            <p className="text-muted-foreground mt-1 mb-4">
              Start your travel journey by exploring our packages!
            </p>
            <Button
              asChild
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Link href="/">Browse Packages</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {serialized.map(
            (booking: {
              _id: string;
              destination: string;
              departureCity: string;
              tripType: string;
              travelDate: string;
              duration: string;
              guests: number;
              budget: number;
              stage: string;
              paymentStatus: string;
              createdAt: string;
            }) => (
              <Link
                key={booking._id}
                href={`/dashboard/bookings/${booking._id}`}
                className="block group"
              >
                <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-700 transition-all duration-200">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg font-bold truncate text-slate-900 dark:text-white">
                            {booking.destination}
                          </h3>
                          <Badge
                            className={`text-xs border ${getStageColor(booking.stage)}`}
                          >
                            {getStageLabel(booking.stage)}
                          </Badge>
                          <Badge
                            className={`text-xs capitalize border ${getPaymentColor(booking.paymentStatus)}`}
                          >
                            {booking.paymentStatus}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {booking.departureCity} → {booking.destination}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />
                            {booking.guests} guests
                          </span>
                          <span className="flex items-center gap-1">
                            <IndianRupee className="h-3.5 w-3.5" />₹
                            {booking.budget?.toLocaleString("en-IN")}
                          </span>
                        </div>

                        <p className="text-xs text-muted-foreground mt-2">
                          {booking.tripType} • {booking.duration} • Travel:{" "}
                          {booking.travelDate} • Booked:{" "}
                          {format(new Date(booking.createdAt), "MMM d, yyyy")}
                        </p>
                      </div>

                      <div className="flex items-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300"
                        >
                          View Details
                          <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ),
          )}
        </div>
      )}
    </div>
  );
}
