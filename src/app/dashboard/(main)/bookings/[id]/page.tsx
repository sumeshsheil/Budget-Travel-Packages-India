import { requireCustomerAuth } from "@/lib/customer-auth-guard";
import { connectDB } from "@/lib/db/mongoose";
import Lead from "@/lib/db/models/Lead";
import LeadActivity from "@/lib/db/models/LeadActivity";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  MapPin,
  Users,
  IndianRupee,
  Calendar,
  Clock,
  Plane,
  CreditCard,
  CheckCircle2,
  Circle,
  FileText,
  Hotel,
  Download,
  Receipt,
  FileCheck,
  File,
  UtensilsCrossed,
  Bus,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { USER_PROGRESS_STAGES, getPaymentColor } from "@/lib/dashboard-utils";

const STAGES = USER_PROGRESS_STAGES;

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireCustomerAuth();
  const { id } = await params;

  await connectDB();

  const lead = await Lead.findOne({
    _id: id,
    customerId: session.user.id,
  }).lean();
  if (!lead) {
    notFound();
  }

  const booking = JSON.parse(JSON.stringify(lead));

  // Fetch activity timeline
  const rawActivities = await LeadActivity.find({ leadId: id })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();
  const activities = JSON.parse(JSON.stringify(rawActivities));

  const currentStageIndex = STAGES.findIndex((s) => s.key === booking.stage);
  const isLostOrStale = ["lost", "stale"].includes(booking.stage);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" size="sm" asChild>
        <Link href="/dashboard/bookings">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Bookings
        </Link>
      </Button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {booking.destination}
          </h1>
          <p className="text-muted-foreground mt-1">
            {booking.tripType} trip • Booked on{" "}
            {format(new Date(booking.createdAt), "MMMM d, yyyy")}
          </p>
        </div>
        <Badge
          className={`text-sm capitalize border ${getPaymentColor(booking.paymentStatus)}`}
        >
          Payment: {booking.paymentStatus}
        </Badge>
      </div>

      {/* Progress Stepper */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Booking Progress</CardTitle>
        </CardHeader>
        <CardContent>
          {isLostOrStale ? (
            <div className="text-center py-4">
              <Badge className="bg-red-100 text-red-700 border border-red-200 text-sm capitalize">
                {booking.stage === "lost"
                  ? "Booking Cancelled"
                  : "Booking Expired"}
              </Badge>
              <p className="text-muted-foreground mt-2 text-sm">
                Please contact us if you&apos;d like to resubmit your inquiry.
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between overflow-x-auto pb-2">
              {STAGES.map((stage, index) => {
                const isCompleted = index <= currentStageIndex;
                const isCurrent = index === currentStageIndex;

                return (
                  <div
                    key={stage.key}
                    className="flex items-center flex-1 min-w-0"
                  >
                    <div className="flex flex-col items-center text-center min-w-[70px]">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all ${
                          isCompleted
                            ? "bg-emerald-600 border-emerald-600 text-white"
                            : "border-gray-300 text-gray-400"
                        } ${isCurrent ? "ring-4 ring-emerald-100" : ""}`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <Circle className="h-4 w-4" />
                        )}
                      </div>
                      <span
                        className={`text-xs mt-1.5 font-medium ${
                          isCompleted ? "text-emerald-700" : "text-gray-400"
                        }`}
                      >
                        {stage.label}
                      </span>
                    </div>
                    {index < STAGES.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-1 ${
                          index < currentStageIndex
                            ? "bg-emerald-500"
                            : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Trip Details */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Plane className="h-5 w-5 text-emerald-600" />
              Trip Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Route</p>
                <p className="font-medium">
                  {booking.departureCity} → {booking.destination}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Travel Date</p>
                <p className="font-medium">{booking.travelDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium">{booking.duration}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Guests</p>
                <p className="font-medium">{booking.guests} person(s)</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <IndianRupee className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Budget</p>
                <p className="font-medium">
                  ₹{booking.budget?.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
            {booking.specialRequests && (
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">
                  Special Requests
                </p>
                <p className="text-sm">{booking.specialRequests}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Section */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-emerald-600" />
              Payment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge
                  className={`capitalize border ${getPaymentColor(
                    booking.paymentStatus,
                  )}`}
                >
                  {booking.paymentStatus}
                </Badge>
              </div>
              {booking.paymentAmount && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Amount Paid
                  </span>
                  <span className="font-semibold">
                    ₹{booking.paymentAmount?.toLocaleString("en-IN")}
                  </span>
                </div>
              )}
            </div>

            {booking.paymentStatus !== "paid" &&
              booking.stage !== "lost" &&
              booking.stage !== "stale" && (
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  disabled
                >
                  Pay Now (Coming Soon)
                </Button>
              )}

            <p className="text-xs text-muted-foreground text-center">
              Payment integration will be available soon. Contact us for manual
              payment options.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Hotel & Inclusions/Exclusions */}
      {(booking.hotelName ||
        (booking.inclusions && booking.inclusions.length > 0) ||
        (booking.exclusions && booking.exclusions.length > 0)) && (
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Hotel className="h-5 w-5 text-emerald-600" />
              What&apos;s Included
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {booking.hotelName && (
              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                <Hotel className="h-5 w-5 text-amber-600 shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">Accommodation</p>
                  <p className="font-semibold">
                    {booking.hotelName}
                    {booking.hotelRating && (
                      <span className="text-amber-500 ml-2">
                        {"★".repeat(booking.hotelRating)}
                        {"☆".repeat(5 - booking.hotelRating)}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            )}
            <div className="grid gap-4 md:grid-cols-2">
              {booking.inclusions && booking.inclusions.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-emerald-700 mb-2">
                    Inclusions
                  </h4>
                  <ul className="space-y-1.5">
                    {booking.inclusions.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {booking.exclusions && booking.exclusions.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-red-700 mb-2">
                    Exclusions
                  </h4>
                  <ul className="space-y-1.5">
                    {booking.exclusions.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Documents & Tickets */}
      {booking.documents && booking.documents.length > 0 && (
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-600" />
              Documents & Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {booking.documents.map(
                (
                  doc: {
                    name: string;
                    url: string;
                    type: string;
                    uploadedAt: string;
                  },
                  index: number,
                ) => {
                  const iconMap: Record<string, typeof Plane> = {
                    ticket: Plane,
                    voucher: Hotel,
                    visa: FileCheck,
                    itinerary_pdf: FileText,
                    invoice: Receipt,
                    other: File,
                  };
                  const Icon = iconMap[doc.type] || File;
                  return (
                    <a
                      key={index}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {doc.name}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {doc.type.replace("_", " ")}
                        </p>
                      </div>
                      <Download className="h-4 w-4 text-muted-foreground group-hover:text-emerald-600 transition-colors" />
                    </a>
                  );
                },
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Day-by-Day Itinerary */}
      {booking.itinerary && booking.itinerary.length > 0 && (
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-emerald-600" />
              Your Itinerary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-emerald-100" />

              <div className="space-y-6">
                {booking.itinerary.map(
                  (
                    day: {
                      day: number;
                      title: string;
                      description: string;
                      meals?: string;
                      hotel?: string;
                      transport?: string;
                    },
                    index: number,
                  ) => (
                    <div key={index} className="relative flex gap-4">
                      {/* Day badge */}
                      <div className="relative z-10 flex items-center justify-center h-10 w-10 rounded-full bg-emerald-600 text-white text-sm font-bold shadow-sm shrink-0">
                        {day.day}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-2">
                        <h4 className="font-semibold text-base">{day.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                          {day.description}
                        </p>

                        {/* Meta tags */}
                        {(day.meals || day.hotel || day.transport) && (
                          <div className="flex flex-wrap gap-3 mt-3">
                            {day.meals && (
                              <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-100">
                                <UtensilsCrossed className="h-3 w-3" />
                                {day.meals}
                              </span>
                            )}
                            {day.hotel && (
                              <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                                <Hotel className="h-3 w-3" />
                                {day.hotel}
                              </span>
                            )}
                            {day.transport && (
                              <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                                <Bus className="h-3 w-3" />
                                {day.transport}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activity Timeline */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-4">
              No activity recorded yet.
            </p>
          ) : (
            <div className="space-y-4">
              {activities.map(
                (
                  activity: {
                    _id: string;
                    action: string;
                    details: string;
                    createdAt: string;
                  },
                  index: number,
                ) => (
                  <div key={activity._id} className="flex gap-3">
                    <div className="relative flex flex-col items-center">
                      <div
                        className={`h-3 w-3 rounded-full mt-1.5 ${
                          index === 0 ? "bg-emerald-500" : "bg-gray-300"
                        }`}
                      />
                      {index < activities.length - 1 && (
                        <div className="w-px flex-1 bg-gray-200 mt-1" />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className="text-sm font-medium capitalize">
                        {activity.action.replace("_", " ")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.details}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {format(
                          new Date(activity.createdAt),
                          "MMM d, yyyy 'at' h:mm a",
                        )}
                      </p>
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
