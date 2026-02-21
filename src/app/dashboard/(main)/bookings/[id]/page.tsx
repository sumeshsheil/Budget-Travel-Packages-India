import { requireCustomerAuth } from "@/lib/customer-auth-guard";
import { connectDB } from "@/lib/db/mongoose";
import Lead from "@/lib/db/models/Lead";
import LeadActivity from "@/lib/db/models/LeadActivity";
import User from "@/lib/db/models/User";
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
  Check,
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
import AddCompanionModal from "./components/AddCompanionModal";
import RemoveTravelerButton from "./components/RemoveTravelerButton";

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

  // Fetch the user's profile to get available members
  const user = await User.findById(session.user.id).lean();
  const availableMembers = user?.members
    ? JSON.parse(JSON.stringify(user.members))
    : [];

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
            <div className="flex flex-col md:flex-row md:items-start justify-between">
              {STAGES.map((stage, index) => {
                const isCompleted = index <= currentStageIndex;
                const isCurrent = index === currentStageIndex;

                return (
                  <div
                    key={stage.key}
                    className="relative flex flex-row md:flex-col items-start md:items-center flex-1 pb-8 md:pb-0 group"
                  >
                    {/* Continuous Line (Background) */}
                    {index < STAGES.length - 1 && (
                      <>
                        {/* Desktop Line - spans to next center */}
                        <div
                          className={`hidden md:block absolute left-1/2 top-4 w-full h-0.5 z-0 ${
                            index < currentStageIndex
                              ? "bg-emerald-500"
                              : "bg-gray-200"
                          }`}
                        />
                        {/* Mobile Line - spans down to next center */}
                        <div
                          className={`md:hidden absolute left-4 top-4 w-0.5 h-full z-0 ${
                            index < currentStageIndex
                              ? "bg-emerald-500"
                              : "bg-gray-200"
                          }`}
                        />
                      </>
                    )}

                    {/* Icon Container */}
                    <div
                      className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                        isCompleted
                          ? "bg-emerald-600 border-emerald-600 text-white"
                          : "bg-white dark:bg-slate-950 border-gray-300 text-gray-400"
                      } ${isCurrent ? "ring-4 ring-emerald-100" : ""}`}
                    >
                      {isCompleted ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Circle className="h-4 w-4" />
                      )}
                    </div>

                    {/* Label Container */}
                    <div className="ml-4 md:ml-0 md:mt-2 text-left md:text-center z-10">
                      <span
                        className={`text-xs font-semibold block transition-colors ${
                          isCompleted ? "text-emerald-700" : "text-gray-400"
                        }`}
                      >
                        {stage.label}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] text-emerald-600 font-medium md:hidden">
                          Current Status
                        </span>
                      )}
                    </div>
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

        {/* Travelers Section */}
        <Card className="border-0 shadow-sm h-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-emerald-600" />
              Travelers ({booking.travelers?.length || 0}/{booking.guests})
            </CardTitle>
            <AddCompanionModal
              bookingId={booking._id}
              availableMembers={availableMembers}
              remainingSpots={booking.guests - (booking.travelers?.length || 0)}
            />
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            {booking.travelers?.map((traveler: any, index: number) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  {traveler.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">
                    {traveler.name}
                    {index === 0 && (
                      <Badge className="ml-2 text-[10px] bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                        Primary
                      </Badge>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {traveler.gender} • {traveler.age} yrs
                    {traveler.phone ? ` • ${traveler.phone}` : ""}
                  </p>
                </div>
                {index > 0 && (
                  <RemoveTravelerButton
                    bookingId={booking._id}
                    memberId={traveler.memberId}
                    name={traveler.name}
                  />
                )}
              </div>
            ))}
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
      <div className="grid gap-6 md:grid-cols-2">
        {/* Itinerary Section */}
        {(() => {
          const itineraryDoc = (booking.documents || []).find(
            (d: { type: string }) => d.type === "itinerary_pdf",
          );

          return (
            <Card
              className={`border-0 shadow-sm h-full ${!itineraryDoc ? "opacity-60 bg-gray-50/50" : ""}`}
            >
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin
                    className={`h-5 w-5 ${itineraryDoc ? "text-emerald-600" : "text-gray-400"}`}
                  />
                  Itinerary
                </CardTitle>
              </CardHeader>
              <CardContent>
                {itineraryDoc ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 p-4 border rounded-xl bg-emerald-50/50 border-emerald-100">
                      <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-emerald-100 text-emerald-600 shrink-0">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate text-emerald-950">
                          {itineraryDoc.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          PDF Document
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        className="w-full border-emerald-200 hover:bg-emerald-50 text-emerald-700"
                        asChild
                      >
                        <a
                          href={itineraryDoc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Users className="h-4 w-4 mr-2" />
                          View
                        </a>
                      </Button>
                      <Button
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                        asChild
                      >
                        <a
                          href={itineraryDoc.url}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </a>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <FileText className="h-10 w-10 text-gray-300 mb-2" />
                    <p className="text-sm font-medium text-gray-500">
                      Document Pending
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Our team is preparing your itinerary
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })()}

        {/* Travel Documents & Tickets Section */}
        {(() => {
          const ticketDoc = (booking.documents || []).find(
            (d: { type: string }) => d.type !== "itinerary_pdf",
          );

          return (
            <Card
              className={`border-0 shadow-sm h-full ${!ticketDoc ? "opacity-60 bg-gray-50/50" : ""}`}
            >
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText
                    className={`h-5 w-5 ${ticketDoc ? "text-emerald-600" : "text-gray-400"}`}
                  />
                  Travel Documents & Tickets
                </CardTitle>
              </CardHeader>
              <CardContent>
                {ticketDoc ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 p-4 border rounded-xl bg-emerald-50/50 border-emerald-100">
                      <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-emerald-100 text-emerald-600 shrink-0">
                        <Plane className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate text-emerald-950">
                          {ticketDoc.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 capitalize">
                          {ticketDoc.type === "ticket"
                            ? "Tickets & Vouchers"
                            : ticketDoc.type.replace("_", " ")}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        className="w-full border-emerald-200 hover:bg-emerald-50 text-emerald-700"
                        asChild
                      >
                        <a
                          href={ticketDoc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Users className="h-4 w-4 mr-2" />
                          View
                        </a>
                      </Button>
                      <Button
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                        asChild
                      >
                        <a
                          href={ticketDoc.url}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </a>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <Plane className="h-10 w-10 text-gray-300 mb-2" />
                    <p className="text-sm font-medium text-gray-500">
                      Documents Pending
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Tickets will appear here once ready
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })()}
      </div>

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

      {/* Payment and Activity Timeline - Side by Side */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Payment Section */}
        <Card className="border-0 shadow-sm h-full">
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

        {/* Activity Timeline */}
        <Card className="border-0 shadow-sm h-full">
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
    </div>
  );
}
