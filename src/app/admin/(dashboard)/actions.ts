"use server";

import { connectDB } from "@/lib/db/mongoose";
import Lead from "@/lib/db/models/Lead";
import User from "@/lib/db/models/User";
import Notification from "@/lib/db/models/Notification";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

interface DashboardStats {
  totalLeads: number;
  activeAgents: number;
  conversionRate: string;
  totalRevenue: number;
  recentLeads: Array<{
    _id: string;
    traveler: string;
    destination: string;
    stage: string;
    date: string;
    agent: string;
  }>;
  isAgent: boolean;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await connectDB();

  const isAgent = session.user.role === "agent";

  // Scope all queries: agents only see their own leads
  const leadFilter = isAgent ? { agentId: session.user.id } : {};

  const wonFilter = isAgent
    ? { stage: "won" as const, agentId: session.user.id }
    : { stage: "won" as const };

  const [totalLeads, activeAgents, wonLeads, totalRevenueResult, recentLeads] =
    await Promise.all([
      Lead.countDocuments(leadFilter),
      isAgent
        ? Promise.resolve(0)
        : User.countDocuments({ role: "agent", status: "active" }),
      Lead.countDocuments(wonFilter),
      Lead.aggregate([
        { $match: wonFilter },
        { $group: { _id: null, total: { $sum: "$budget" } } },
      ]),
      Lead.find(leadFilter)
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("agentId", "name")
        .lean(),
    ]);

  const totalRevenue = totalRevenueResult[0]?.total || 0;
  const conversionRate =
    totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : "0";

  // Serialize recent leads — use simple mapping to avoid Mongoose type complexity
  const serializedLeads = JSON.parse(JSON.stringify(recentLeads)).map(
    (lead: {
      _id: string;
      travelers?: { name?: string }[];
      destination?: string;
      stage?: string;
      createdAt?: string;
      agentId?: { name?: string };
    }) => ({
      _id: lead._id,
      traveler: lead.travelers?.[0]?.name || "Unknown",
      destination: lead.destination || "Unknown",
      stage: lead.stage || "new",
      date: lead.createdAt || new Date().toISOString(),
      agent: lead.agentId?.name || "Unassigned",
    }),
  );

  return {
    totalLeads,
    activeAgents,
    conversionRate,
    totalRevenue,
    recentLeads: serializedLeads,
    isAgent,
  };
}

// ============ NOTIFICATION ACTIONS ============

export interface NotificationItem {
  _id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export async function getUnreadNotifications(): Promise<NotificationItem[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  await connectDB();

  // Fetch unread notifications, limit 20
  const notifications = await Notification.find({
    userId: session.user.id,
    isRead: false,
  })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  return JSON.parse(JSON.stringify(notifications));
}

export async function markNotificationRead(notificationId: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false };

  await connectDB();

  await Notification.updateOne(
    { _id: notificationId, userId: session.user.id },
    { isRead: true },
  );

  revalidatePath("/admin");
  return { success: true };
}

export async function markAllNotificationsRead() {
  const session = await auth();
  if (!session?.user?.id) return { success: false };

  await connectDB();

  await Notification.updateMany(
    { userId: session.user.id, isRead: false },
    { isRead: true },
  );

  revalidatePath("/admin");
  return { success: true };
}
