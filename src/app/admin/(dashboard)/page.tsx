import type { Metadata } from "next";
import { Users, TrendingUp, Banknote, Activity } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CreateLeadDialog } from "@/components/admin/leads/CreateLeadDialog";

import { getDashboardStats } from "./actions";

export const metadata: Metadata = {
  title: "Dashboard | Budget Travel Packages",
  description: "Admin dashboard overview",
};

interface RecentLead {
  _id: string;
  traveler: string;
  destination: string;
  stage: string;
  date: string;
  agent: string;
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          {stats.isAgent
            ? "Overview of your assigned leads and performance."
            : "Overview of your travel agency performance."}
        </p>
      </div>

      <div
        className={`grid gap-4 md:grid-cols-2 ${stats.isAgent ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stats.isAgent ? "My Leads" : "Total Leads"}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              {stats.isAgent ? "Assigned to you" : "Across all stages"}
            </p>
          </CardContent>
        </Card>

        {!stats.isAgent && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Agents
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeAgents}</div>
              <p className="text-xs text-muted-foreground">
                Currently handling leads
              </p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Conversion Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.isAgent
                ? "Your leads converted"
                : "Leads converted to won"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue (Won)</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{stats.totalRevenue.toLocaleString("en-IN")}
            </div>
            <p className="text-xs text-muted-foreground">
              Total budget of won trips
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              {stats.isAgent
                ? "Your latest assigned leads."
                : "Latest leads added to the system."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {stats.recentLeads.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No recent activity.
                </p>
              ) : (
                stats.recentLeads.map((lead: RecentLead) => (
                  <div key={lead._id} className="flex items-center">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-emerald-100 text-emerald-800">
                        {lead.traveler.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {lead.traveler}
                      </p>
                      <p className="text-sm text-muted-foreground mr-2 truncate max-w-[120px]">
                        Inquiry for {lead.destination}
                      </p>
                    </div>
                    <div className="ml-auto flex flex-col items-end gap-1">
                      <Badge
                        variant="secondary"
                        className="capitalize text-[10px] h-5"
                      >
                        {lead.stage.replace("_", " ")}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(lead.date), "MMM d")}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/admin/leads?view=board">
                <TrendingUp className="mr-2 h-4 w-4" />
                View Pipeline Board
              </Link>
            </Button>
            {!stats.isAgent && (
              <Button
                asChild
                className="w-full justify-start"
                variant="outline"
              >
                <Link href="/admin/agents">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Agents
                </Link>
              </Button>
            )}
            <div className="w-full">
              <CreateLeadDialog fullWidth />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
