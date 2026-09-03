import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAdmin } from "@/lib/auth";

const prisma = new PrismaClient();

// GET /api/journey/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const item = await prisma.journey.findUnique({
      where: { id }
    });

    if (!item) {
      return NextResponse.json({ error: "Journey item not found" }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error fetching journey item:", error);
    return NextResponse.json({ error: "Failed to fetch item" }, { status: 500 });
  }
}

// PUT /api/journey/[id] - Update journey item
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: rawId } = await params;
    const id = parseInt(rawId);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await request.json();
    const { year, title, shortDescription, longDescription, image } = body;

    const updatedItem = await prisma.journey.update({
      where: { id },
      data: {
        ...(year && { year: String(year).trim() }),
        ...(title && { title: title.trim() }),
        ...(shortDescription && { shortDescription: shortDescription.trim() }),
        ...(longDescription !== undefined && { longDescription: longDescription.trim() }),
        ...(image && { image })
      }
    });

    // Record activity log
    try {
      await prisma.activityLog.create({
        data: {
          adminId: admin.id,
          action: "UPDATE_JOURNEY",
          details: `Updated journey milestone "${updatedItem.title}" (${updatedItem.year})`
        }
      });
    } catch (e) {
      console.error("Failed to log activity:", e);
    }

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("Error updating journey item:", error);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

// DELETE /api/journey/[id] - Delete journey item
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: rawId } = await params;
    const id = parseInt(rawId);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const existing = await prisma.journey.findUnique({ where: { id } });

    await prisma.journey.delete({
      where: { id }
    });

    // Record activity log
    if (existing) {
      try {
        await prisma.activityLog.create({
          data: {
            adminId: admin.id,
            action: "DELETE_JOURNEY",
            details: `Deleted journey milestone "${existing.title}" (${existing.year})`
          }
        });
      } catch (e) {
        console.error("Failed to log activity:", e);
      }
    }

    return NextResponse.json({ message: "Journey item deleted successfully" });
  } catch (error) {
    console.error("Error deleting journey item:", error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
