import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { logActivity } from "@/lib/logger";

export async function POST(request: Request) {
  const admin = await verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { ids, status } = body;

    if (!Array.isArray(ids) || ids.length === 0 || !["published", "draft"].includes(status)) {
      return NextResponse.json({ error: "Array of IDs and valid status (published/draft) are required" }, { status: 400 });
    }

    await prisma.update.updateMany({
      where: {
        id: { in: ids.map((id: any) => parseInt(id)) }
      },
      data: {
        status: status
      }
    });

    await logActivity(admin.id, "UPDATE_BULK_STATUS", `Bulk updated updates status to "${status}" for: [${ids.join(', ')}]`, request);

    return NextResponse.json({ message: "Updates status updated successfully" });
  } catch (error) {
    console.error("Bulk status updates error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
