import { requireCustomerAuth } from "@/lib/customer-auth-guard";
import { connectDB } from "@/lib/db/mongoose";
import Lead from "@/lib/db/models/Lead";
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
  AlertTriangle,
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
  })
    .populate("agentId", "name email")
    .lean();
  if (!lead) {
    notFound();
  }

  // Fetch the user's profile to get available members
  const user = await User.findById(session.user.id).lean();
  const availableMembers = user?.members
    ? JSON.parse(JSON.stringify(user.members))
    : [];

  const booking = JSON.parse(JSON.stringify(lead));

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
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {booking.destination}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 capitalize">
            {booking.tripType} trip • Booked on{" "}
            {format(new Date(booking.createdAt), "MMMM d, yyyy 'at' h:mm a")}
          </p>
        </div>
        <Badge
          className={`text-sm capitalize border ${getPaymentColor(booking.paymentStatus)}`}
        >
          Payment: {booking.paymentStatus}
        </Badge>
      </div>

      {/* Progress Stepper */}
      <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-slate-900 dark:text-white">
            Booking Progress
          </CardTitle>
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
                              : "bg-border"
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
                          : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-400 dark:text-slate-500"
                      } ${isCurrent ? "ring-4 ring-emerald-500/20" : ""}`}
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
                          isCompleted
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-slate-400 dark:text-slate-500"
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
        <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-slate-900 dark:text-white">
              <Plane className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              Trip Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Route
                </p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {booking.departureCity} → {booking.destination}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Travel Date
                </p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {booking.travelDate}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Duration
                </p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {booking.duration}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Guests
                </p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {booking.guests} person(s)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <IndianRupee className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {booking.tripCost ? "Trip Cost" : "Budget Estimate"}
                </p>
                <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                  ₹
                  {(booking.tripCost || booking.budget)?.toLocaleString(
                    "en-IN",
                  )}
                </p>
              </div>
            </div>
            {booking.specialRequests && (
              <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                  Special Requests
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {booking.specialRequests}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Travelers Section */}
        <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm h-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg flex items-center gap-2 text-slate-900 dark:text-white">
              <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              Travelers ({booking.travelers?.length || 0}/{booking.guests})
            </CardTitle>
            <AddCompanionModal
              bookingId={booking._id}
              availableMembers={availableMembers}
              remainingSpots={booking.guests - (booking.travelers?.length || 0)}
            />
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            {booking.travelers?.map((traveler: any, index: number) => {
              // Check document status for this traveler
              let hasAadhaar = false;
              let hasPassport = false;

              if (index === 0) {
                // Primary traveler — check user profile documents
                hasAadhaar =
                  (user?.documents?.aadharCard?.length || 0) > 0 ||
                  (traveler.documents?.aadharCard?.length || 0) > 0;
                hasPassport =
                  (user?.documents?.passport?.length || 0) > 0 ||
                  (traveler.documents?.passport?.length || 0) > 0;
              } else {
                // Companion — check member documents
                const member = traveler.memberId
                  ? availableMembers.find(
                      (m: any) =>
                        m._id?.toString() === traveler.memberId ||
                        m.id?.toString() === traveler.memberId,
                    )
                  : null;
                hasAadhaar =
                  (member?.documents?.aadharCard?.length || 0) > 0 ||
                  (traveler.documents?.aadharCard?.length || 0) > 0;
                hasPassport =
                  (member?.documents?.passport?.length || 0) > 0 ||
                  (traveler.documents?.passport?.length || 0) > 0;
              }

              const isInternational = booking.tripType === "international";
              const missingDocs: string[] = [];
              if (!hasAadhaar) missingDocs.push("Aadhaar");
              if (isInternational && !hasPassport) missingDocs.push("Passport");

              return (
                <div
                  key={index}
                  className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-semibold">
                      {traveler.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate text-slate-900 dark:text-white">
                        {traveler.name}
                        {index === 0 && (
                          <Badge className="ml-2 text-[10px] bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 border-0">
                            Primary
                          </Badge>
                        )}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
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
                  {missingDocs.length > 0 && (
                    <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md px-2.5 py-1.5">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                      <span className="text-[11px] font-medium">
                        Missing: {missingDocs.join(" & ")}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Hotel & Inclusions/Exclusions */}
      {(booking.hotelName ||
        (booking.inclusions && booking.inclusions.length > 0) ||
        (booking.exclusions && booking.exclusions.length > 0)) && (
        <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-slate-900 dark:text-white">
              <Hotel className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
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
          const itineraryUrl = booking.itineraryPdfUrl;

          return (
            <Card
              className={`border-0 shadow-sm h-full ${!itineraryUrl ? "opacity-60 bg-muted/30" : ""}`}
            >
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin
                    className={`h-5 w-5 ${itineraryUrl ? "text-emerald-600" : "text-muted-foreground"}`}
                  />
                  Itinerary
                </CardTitle>
              </CardHeader>
              <CardContent>
                {itineraryUrl ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 p-4 border rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/50">
                      <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-emerald-100 text-emerald-600 shrink-0">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate text-foreground">
                          {booking.itineraryPdfUrl
                            ? `${booking.destination} Itinerary`
                            : (booking.documents || []).find(
                                (d: any) => d.url === itineraryUrl,
                              )?.name || "Itinerary"}
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
                          href={itineraryUrl}
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
                          href={itineraryUrl}
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
                    <FileText className="h-10 w-10 text-muted-foreground/50 mb-2" />
                    <p className="text-sm font-medium text-muted-foreground">
                      Document Pending
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
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
          const travelDocsUrl = booking.travelDocumentsPdfUrl;

          return (
            <Card
              className={`border-0 shadow-sm h-full ${!travelDocsUrl ? "opacity-60 bg-muted/30" : ""}`}
            >
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-slate-900 dark:text-white">
                  <FileText
                    className={`h-5 w-5 ${travelDocsUrl ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}
                  />
                  Travel Documents & Tickets
                </CardTitle>
              </CardHeader>
              <CardContent>
                {travelDocsUrl ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 p-4 border rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/50">
                      <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 shrink-0">
                        <Plane className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate text-slate-900 dark:text-white">
                          Travel Documents & Tickets
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          PDF Document
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        className="w-full border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400"
                        asChild
                      >
                        <a
                          href={travelDocsUrl}
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
                          href={travelDocsUrl}
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
                    <Plane className="h-10 w-10 text-muted-foreground/50 mb-2" />
                    <p className="text-sm font-medium text-muted-foreground">
                      Documents Pending
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      Tickets will appear here once ready
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })()}
      </div>

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

        {/* Assigned Agent */}
        <Card className="border-0 shadow-sm h-full bg-slate-50/50 dark:bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-slate-900 dark:text-white">
              <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              Assigned Agent
            </CardTitle>
          </CardHeader>
          <CardContent>
            {booking.agentId ? (
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-bold text-lg">
                  {booking.agentId.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {booking.agentId.name}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Your Dedicated Travel Expert
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                <Users className="h-10 w-10 text-slate-300 dark:text-slate-700 mb-2" />
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Agent Pending Assignment
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-[200px]">
                  An agent will be assigned to your trip shortly.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
