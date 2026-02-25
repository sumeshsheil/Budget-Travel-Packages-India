import type { Metadata } from "next";
import Link from "next/link";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { connectDB } from "@/lib/db/mongoose";
import Lead from "@/lib/db/models/Lead";
import { auth } from "@/lib/auth";

interface LeadListItem {
  _id: string;
  travelers?: Array<{ name?: string; phone?: string; email?: string }>;
  destination?: string;
  tripType?: string;
  guests?: number;
  budget?: number;
  stage: string;
  source?: string;
  agentId?: { _id: string; name: string; email: string } | null;
  createdAt: string;
  updatedAt: string;
}

interface LeadQuery {
  agentId?: string;
  stage?: string | { $ne: string } | { $in: string[] };
  tripType?: string;
  $or?: Array<Record<string, unknown>>;
}

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LeadSearch } from "@/components/admin/leads/LeadSearch";
import { LeadFilters } from "@/components/admin/leads/LeadFilters";
import { KanbanBoard } from "@/components/admin/leads/kanban/KanbanBoard";
import { ViewToggle } from "@/components/admin/leads/ViewToggle";
import SmartAutoRefresh from "@/components/admin/leads/SmartAutoRefresh";
import { CreateLeadDialog } from "@/components/admin/leads/CreateLeadDialog";
import { LeadTypeTabs } from "@/components/admin/leads/LeadTypeTabs";
import { LeadTable } from "@/components/admin/leads/LeadTable";
import User from "@/lib/db/models/User";

export const metadata: Metadata = {
  title: "Lead Management | Budget Travel Packages",
  description: "Manage travel leads and pipeline",
};

const LEADS_PER_PAGE = 20;

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await auth();
  if (!session) return null;

  await connectDB();

  const params = await searchParams;
  const stageFilter = (params.stage as string) || "all";
  const search = (params.search as string) || "";
  const view = (params.view as string) || "board";
  const tripTypeFilter = (params.type as string) || "all";
  const page = Math.max(1, parseInt((params.page as string) || "1", 10));

  const query: LeadQuery = {};

  if (session.user.role === "agent") {
    query.agentId = session.user.id;

    if (stageFilter && stageFilter !== "all") {
      // If agent tries to filter for 'won', they get nothing (security/archival)
      if (stageFilter === "won") {
        query.stage = "_none_"; // Force empty result
      } else {
        query.stage = stageFilter;
      }
    } else {
      // Default view for agents excludes won
      query.stage = { $ne: "won" };
    }
  } else {
    // Admin path
    if (stageFilter && stageFilter !== "all") {
      query.stage = stageFilter;
    }
  }

  if (tripTypeFilter && tripTypeFilter !== "all") {
    query.tripType = tripTypeFilter;
  }

  if (search) {
    query.$or = [
      { "travelers.name": { $regex: search, $options: "i" } },
      { "travelers.phone": { $regex: search, $options: "i" } },
      { destination: { $regex: search, $options: "i" } },
    ];
  }

  // Fetch agents for bulk actions (Admin only)
  let agents: any[] = [];
  if (session.user.role === "admin") {
    const rawAgents = await User.find({
      role: "agent",
      status: "active",
      isVerified: true,
    })
      .select("name email _id")
      .lean();
    agents = JSON.parse(JSON.stringify(rawAgents));
  }

  // For Kanban view, fetch all leads (no pagination needed)
  // For list view, paginate
  const isListView = view !== "board";
  const skip = isListView ? (page - 1) * LEADS_PER_PAGE : 0;
  const limit = isListView ? LEADS_PER_PAGE : 0; // 0 = no limit for Kanban

  const [rawLeads, totalCount] = await Promise.all([
    Lead.find(query)
      .populate("agentId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit || 0)
      .lean(),
    Lead.countDocuments(query),
  ]);

  const serialized = JSON.parse(JSON.stringify(rawLeads));
  const leads: LeadListItem[] = serialized.map(
    (lead: LeadListItem & Record<string, unknown>) => ({
      ...lead,
      _id: String(lead._id),
      agentId: lead.agentId
        ? {
            _id: String(lead.agentId._id),
            name: lead.agentId.name || "Unknown",
            email: lead.agentId.email || "",
          }
        : null,
      travelers: lead.travelers || [],
      createdAt: String(lead.createdAt),
      updatedAt: String(lead.updatedAt),
    }),
  );

  const totalPages = Math.ceil(totalCount / LEADS_PER_PAGE);

  // Build pagination URLs preserving existing params
  function buildPageUrl(targetPage: number) {
    const p = new URLSearchParams();
    if (stageFilter !== "all") p.set("stage", stageFilter);
    if (tripTypeFilter !== "all") p.set("type", tripTypeFilter);
    if (search) p.set("search", search);
    if (view !== "list") p.set("view", view);
    if (targetPage > 1) p.set("page", targetPage.toString());
    const qs = p.toString();
    return `/admin/leads${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="space-y-6">
      <SmartAutoRefresh interval={30000} idleThreshold={60000} />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Leads</h2>
          <p className="text-muted-foreground">
            {session.user.role === "admin"
              ? "Manage all travel inquiries and assigning agents."
              : "Track and manage your assigned leads."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CreateLeadDialog />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex w-full sm:w-auto items-center gap-2">
          <LeadSearch />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="hidden lg:flex items-center gap-2">
            <ViewToggle />
          </div>
          <LeadTypeTabs />
          {view !== "board" && <LeadFilters />}
        </div>
      </div>

      {view === "board" ? (
        <KanbanBoard
          initialLeads={
            leads as unknown as import("@/components/admin/leads/kanban/types").KanbanLead[]
          }
        />
      ) : (
        <>
          <Card className="p-0">
            <CardContent className="p-0">
              <LeadTable
                leads={leads}
                agents={agents}
                isAdmin={session.user.role === "admin"}
              />
            </CardContent>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-2">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-medium">
                  {(page - 1) * LEADS_PER_PAGE + 1}
                </span>
                –
                <span className="font-medium">
                  {Math.min(page * LEADS_PER_PAGE, totalCount)}
                </span>{" "}
                of <span className="font-medium">{totalCount}</span> leads
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  asChild={page > 1}
                >
                  {page > 1 ? (
                    <Link href={buildPageUrl(page - 1)}>
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Link>
                  ) : (
                    <>
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </>
                  )}
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    // Smart pagination: show pages around current
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={pageNum === page ? "default" : "outline"}
                        size="sm"
                        className="w-8 h-8 p-0"
                        asChild={pageNum !== page}
                      >
                        {pageNum === page ? (
                          <span>{pageNum}</span>
                        ) : (
                          <Link href={buildPageUrl(pageNum)}>{pageNum}</Link>
                        )}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  asChild={page < totalPages}
                >
                  {page < totalPages ? (
                    <Link href={buildPageUrl(page + 1)}>
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  ) : (
                    <>
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
