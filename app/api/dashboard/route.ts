import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const admin = await verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Works counters
    const totalWorksCount = await prisma.work.count();
    const publishedWorksCount = await prisma.work.count({ where: { status: "published" } });
    const draftWorksCount = await prisma.work.count({ where: { status: "draft" } });

    // 2. Updates counters
    const totalUpdatesCount = await prisma.update.count();
    const publishedUpdatesCount = await prisma.update.count({ where: { status: "published" } });
    const draftUpdatesCount = await prisma.update.count({ where: { status: "draft" } });

    // 3. Recent activity logs (limit 10)
    const recentActivity = await prisma.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        admin: {
          select: { name: true }
        }
      }
    });

    // Map activity logs to match legacy response schema: l.*, a.name as admin_name
    const mappedActivity = recentActivity.map(log => ({
      id: log.id,
      admin_id: log.adminId,
      action: log.action,
      details: log.details,
      ip_address: log.ipAddress,
      created_at: log.createdAt,
      admin_name: log.admin ? log.admin.name : null
    }));

    // 4. Latest uploads (limit 5)
    const latestMedia = await prisma.media.findMany({
      orderBy: { createdAt: "desc" },
      take: 5
    });

    const mappedMedia = latestMedia.map(m => ({
      id: m.id,
      filename: m.filename,
      original_name: m.originalName,
      mime_type: m.mimeType,
      size: m.size,
      url: m.url,
      folder: m.folder,
      created_at: m.createdAt
    }));

    return NextResponse.json({
      works: {
        total: totalWorksCount,
        published: publishedWorksCount,
        draft: draftWorksCount
      },
      updates: {
        total: totalUpdatesCount,
        published: publishedUpdatesCount,
        draft: draftUpdatesCount
      },
      recentActivity: mappedActivity,
      latestMedia: mappedMedia
    });
  } catch (error) {
    console.error("GET dashboard stats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
