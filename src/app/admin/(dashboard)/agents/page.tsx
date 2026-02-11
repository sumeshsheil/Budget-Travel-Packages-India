import type { Metadata } from "next";
import { format } from "date-fns";
import { Suspense } from "react";

import { connectDB } from "@/lib/db/mongoose";
import User, { type IUser } from "@/lib/db/models/User";
import { verifyAdmin } from "@/lib/auth-check";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AddAgentDialog } from "@/components/admin/agents/AddAgentDialog";
import { AgentActions } from "@/components/admin/agents/AgentActions";
import { AgentSearchInput } from "@/components/admin/agents/AgentSearchInput";

export const metadata: Metadata = {
  title: "Agent Management | Budget Travel Packages",
  description: "Manage travel agents and their permissions",
};

interface AgentsPageProps {
  searchParams: Promise<{ search?: string; status?: string }>;
}

export default async function AgentsPage({ searchParams }: AgentsPageProps) {
  await verifyAdmin();
  await connectDB();

  const params = await searchParams;
  const search = params.search || "";
  const statusFilter = params.status || "all";

  // Build query with search and status filters
  interface AgentQuery {
    role: string;
    status?: string;
    $or?: Array<Record<string, unknown>>;
  }

  const query: AgentQuery = { role: "agent" };

  if (statusFilter && statusFilter !== "all") {
    query.status = statusFilter;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  const agents = (await User.find(query)
    .sort({ createdAt: -1 })
    .lean()) as unknown as IUser[];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Agents</h2>
          <p className="text-muted-foreground">
            Manage your team of travel agents.
          </p>
        </div>
        <AddAgentDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            A list of all registered travel agents who can manage leads.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <Suspense fallback={null}>
              <AgentSearchInput defaultValue={search} />
            </Suspense>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agents.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      {search
                        ? `No agents found matching "${search}".`
                        : "No agents found. Add your first agent above."}
                    </TableCell>
                  </TableRow>
                ) : (
                  agents.map((agent) => (
                    <TableRow key={agent._id.toString()}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{agent.name}</span>
                          {agent.phone && (
                            <span className="text-xs text-muted-foreground md:hidden">
                              {agent.phone}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{agent.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            agent.status === "active" ? "default" : "secondary"
                          }
                          className={
                            agent.status === "active"
                              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100/80 border-emerald-200"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-100/80 border-slate-200"
                          }
                        >
                          {agent.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {format(new Date(agent.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <AgentActions
                          agentId={agent._id.toString()}
                          agentName={agent.name}
                          isActive={agent.status === "active"}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
