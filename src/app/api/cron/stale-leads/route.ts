import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Lead from "@/lib/db/models/Lead";
import LeadActivity from "@/lib/db/models/LeadActivity";

export const dynamic = "force-dynamic"; // Ensure this route is not cached

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectDB();

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Find leads that will become stale (we need their IDs for activity logging)
    const staleLeads = await Lead.find({
      stage: { $nin: ["won", "lost", "stale"] },
      lastActivityAt: { $lt: sevenDaysAgo },
    })
      .select("_id stage")
      .lean();

    if (staleLeads.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No leads to mark as stale.",
        count: 0,
      });
    }

    const staleLeadIds = staleLeads.map((lead) => lead._id);

    // Bulk update to stale
    const result = await Lead.updateMany({ _id: { $in: staleLeadIds } }, [
      {
        $set: {
          previousStage: "$stage",
          stage: "stale",
        },
      },
    ]);

    // Log activity for each stale lead
    const activityDocs = staleLeads.map((lead) => ({
      leadId: lead._id,
      action: "auto_stale" as const,
      fromStage: lead.stage,
      toStage: "stale",
      details: "Automatically marked as stale due to 7 days of inactivity",
    }));

    try {
      await LeadActivity.insertMany(activityDocs);
    } catch (activityError: unknown) {
      // Non-blocking: activity logging shouldn't fail the cron
      console.error(
        "Failed to log stale activities:",
        activityError instanceof Error ? activityError.message : activityError,
      );
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${result.modifiedCount} leads to stale status.`,
      count: result.modifiedCount,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Cron job error";
    console.error("Cron job error:", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
