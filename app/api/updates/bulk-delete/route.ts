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
    const { ids } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "Array of IDs is required" }, { status: 400 });
    }

    await prisma.update.deleteMany({
      where: {
        id: { in: ids.map((id: any) => parseInt(id)) }
      }
    });

    await logActivity(admin.id, "UPDATE_BULK_DELETE", `Bulk deleted updates: [${ids.join(', ')}]`, request);

    return NextResponse.json({ message: "Updates deleted successfully" });
  } catch (error) {
    console.error("Bulk delete updates error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
