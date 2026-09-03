import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAdmin } from "@/lib/auth";

const prisma = new PrismaClient();

// GET /api/journey - Fetch all journey timeline items sorted by Year ASC
export async function GET() {
  try {
    const items = await prisma.journey.findMany();

    // Sort strictly by Year (numeric ascending), then by ID ascending
    items.sort((a, b) => {
      const yearA = parseInt(a.year) || 0;
      const yearB = parseInt(b.year) || 0;
      if (yearA !== yearB) return yearA - yearB;
      return a.id - b.id;
    });

    return NextResponse.json(items);
  } catch (error: any) {
    console.error("Error fetching journey items:", error);
    return NextResponse.json({ error: error?.message || String(error) }, { status: 500 });
  }
}

// POST /api/journey - Create a new journey milestone
export async function POST(request: Request) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { year, title, shortDescription, longDescription, image } = body;

    if (!year || !title || !shortDescription) {
      return NextResponse.json({ error: "Year, Title, and Short Description are required" }, { status: 400 });
    }

    const newItem = await prisma.journey.create({
      data: {
        year: String(year).trim(),
        title: title.trim(),
        shortDescription: shortDescription.trim(),
        longDescription: (longDescription || shortDescription).trim(),
        image: image || "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
        displayOrder: 0
      }
    });

    // Create activity log entry
    try {
      await prisma.activityLog.create({
        data: {
          adminId: admin.id,
          action: "CREATE_JOURNEY",
          details: `Created journey milestone "${newItem.title}" (${newItem.year})`
        }
      });
    } catch (e) {
      console.error("Failed to log activity:", e);
    }

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Error creating journey item:", error);
    return NextResponse.json({ error: "Failed to create journey item" }, { status: 500 });
  }
}
