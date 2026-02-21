import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Mail,
  Phone,
  Banknote,
  Users,
} from "lucide-react";

import { connectDB } from "@/lib/db/mongoose";
import Lead from "@/lib/db/models/Lead";
import User from "@/lib/db/models/User";
import { auth } from "@/lib/auth";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ActionButtons } from "@/components/admin/leads/lead-detail/ActionButtons";
import { ActivityTimeline } from "@/components/admin/leads/lead-detail/ActivityTimeline";
import { DocumentManager } from "@/components/admin/leads/lead-detail/DocumentManager";
import { ItineraryManager } from "@/components/admin/leads/lead-detail/ItineraryManager";
import { getLeadActivities } from "./activity-actions";

interface PopulatedAgent {
  _id: { toString: () => string };
  name: string;
  email: string;
}

interface TravelerData {
  name: string;
  age: number;
  gender: string;
  email?: string;
  phone?: string;
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) return notFound();

  await connectDB();
  const { id } = await params;

  // Ensure valid ID format before query
  if (!id.match(/^[0-9a-fA-F]{24}$/)) return notFound();

  const lead = await Lead.findById(id).populate("agentId", "name email").lean();

  if (!lead) return notFound();

  // Access Control: Agents can only view their own leads
  if (
    session.user.role === "agent" &&
    lead.agentId?._id?.toString() !== session.user.id
  ) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p className="text-muted-foreground">
          You are not authorized to view this lead details.
        </p>
        <Button asChild>
          <Link href="/admin/leads">Return to Leads</Link>
        </Button>
      </div>
    );
  }

  // Fetch agents for assignment (Admin only)
  let agents: Array<{ _id: string; name: string; email: string }> = [];
  if (session.user.role === "admin") {
    const rawAgents = await User.find({ role: "agent", status: "active" })
      .select("name email _id")
      .lean();
    agents = rawAgents.map((a) => ({
      _id: String(a._id),
      name: a.name,
      email: a.email,
    }));
  }

  // Fetch activities
  const activities = await getLeadActivities(String(lead._id));

  // Serialize trip details for client components
  const documents = JSON.parse(JSON.stringify(lead.documents || []));
  const itinerary = JSON.parse(JSON.stringify(lead.itinerary || []));
  const inclusions = (lead.inclusions || []) as string[];
  const exclusions = (lead.exclusions || []) as string[];
  const leadId = String(lead._id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/leads">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">
              {lead.travelers?.[0]?.name || "Unknown Traveler"}
            </h1>
            <Badge variant="outline" className="capitalize ml-2">
              {lead.stage.replace("_", " ")}
            </Badge>
          </div>
          <div className="text-muted-foreground flex items-center gap-2 text-sm mt-1">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{lead.destination}</span>
            </div>
            <span className="text-slate-300 mx-1">|</span>
            <span>ID: {lead._id.toString()}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trip Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-emerald-600" />
                Trip Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-y-4 gap-x-8">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Type
                </p>
                <p className="capitalize">{lead.tripType} Trip</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Dates
                </p>
                <p>
                  {lead.travelDate} ({lead.duration})
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Departure
                </p>
                <p>{lead.departureCity}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Guests
                </p>
                <p className="flex items-center gap-1">{lead.guests} People</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Budget
                </p>
                <p className="flex items-center gap-1 font-medium text-emerald-700">
                  <Banknote className="h-4 w-4" />₹
                  {lead.budget.toLocaleString("en-IN")}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Travelers Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Traveler Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {lead.travelers && lead.travelers.length > 0 ? (
                lead.travelers.map((traveler: TravelerData, idx: number) => (
                  <div
                    key={idx}
                    className="bg-slate-50 dark:bg-muted/50 p-4 rounded-lg space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{traveler.name}</p>
                      <Badge variant="secondary">
                        {traveler.gender}, {traveler.age}yo
                      </Badge>
                    </div>
                    <Separator />
                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Email:</span>
                        {traveler.email ? (
                          <a
                            href={`mailto:${traveler.email}`}
                            className="text-blue-600 hover:underline"
                          >
                            {traveler.email}
                          </a>
                        ) : (
                          <span className="text-muted-foreground italic text-xs">
                            Not provided
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Phone:</span>
                        {traveler.phone ? (
                          <a
                            href={`tel:${traveler.phone}`}
                            className="text-blue-600 hover:underline"
                          >
                            {traveler.phone}
                          </a>
                        ) : (
                          <span className="text-muted-foreground italic text-xs">
                            Not provided
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground italic">
                  No traveler details available.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Special Requests */}
          {lead.specialRequests && (
            <Card>
              <CardHeader>
                <CardTitle>Special Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">
                  {lead.specialRequests}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Documents Manager */}
          <DocumentManager leadId={leadId} documents={documents} />

          {/* Itinerary & Trip Details Manager */}
          <ItineraryManager
            leadId={leadId}
            itinerary={itinerary}
            inclusions={inclusions}
            exclusions={exclusions}
            hotelName={lead.hotelName as string | undefined}
            hotelRating={lead.hotelRating as number | undefined}
          />
        </div>

        {/* Right Column - Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Management</CardTitle>
              <CardDescription>Update status and assignment</CardDescription>
            </CardHeader>
            <CardContent>
              <ActionButtons
                leadId={lead._id.toString()}
                currentStage={lead.stage}
                currentAgentId={lead.agentId?._id?.toString()}
                agents={JSON.parse(JSON.stringify(agents))}
                isAdmin={session.user.role === "admin"}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Lead Information
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Source</span>
                <span className="capitalize font-medium">
                  {lead.source.replace("_", " ")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{format(new Date(lead.createdAt), "MMM d, yyyy")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Activity</span>
                <span>
                  {format(new Date(lead.lastActivityAt), "MMM d, HH:mm")}
                </span>
              </div>
              {lead.agentId && (
                <div className="pt-2 border-t mt-2">
                  <p className="text-muted-foreground mb-1">Assigned Agent</p>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                      {(
                        (lead.agentId as unknown as PopulatedAgent)?.name ||
                        "AG"
                      )
                        .substring(0, 2)
                        .toUpperCase()}
                    </div>
                    <span className="font-medium">
                      {(lead.agentId as unknown as PopulatedAgent)?.name ||
                        "Unknown Agent"}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Activity History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityTimeline activities={activities} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
