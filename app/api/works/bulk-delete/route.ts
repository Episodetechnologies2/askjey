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

    await prisma.work.deleteMany({
      where: {
        id: { in: ids.map((id: any) => parseInt(id)) }
      }
    });

    await logActivity(admin.id, "WORK_BULK_DELETE", `Bulk deleted works: [${ids.join(', ')}]`, request);

    return NextResponse.json({ message: "Works deleted successfully" });
  } catch (error) {
    console.error("Bulk delete works error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
