import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category");
  const search = url.searchParams.get("search");
  const status = url.searchParams.get("status");
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "1000");
  const offset = (page - 1) * limit;

  // Authentication check
  const admin = await verifyAdmin(request);
  const statusFilter = admin ? (status || "all") : "published";

  try {
    const whereClause: any = {};

    if (statusFilter !== "all") {
      whereClause.status = statusFilter;
    }

    if (category) {
      whereClause.category = {
        equals: category,
      };
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search } },
        { shortDescription: { contains: search } },
        { category: { contains: search } }
      ];
    }

    const updates = await prisma.update.findMany({
      where: whereClause
    });

    const parsedUpdates = updates.map(item => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      category: item.category,
      short_description: item.shortDescription,
      description: typeof item.description === "string" ? JSON.parse(item.description) : item.description,
      thumbnail: item.thumbnail,
      banner: item.banner,
      author: item.author,
      tags: typeof item.tags === "string" ? JSON.parse(item.tags) : item.tags,
      key_takeaways: typeof item.keyTakeaways === "string" ? JSON.parse(item.keyTakeaways) : item.keyTakeaways,
      status: item.status,
      published_date: item.publishedDate,
      seo_title: item.seoTitle,
      seo_description: item.seoDescription,
      created_at: item.createdAt,
      updated_at: item.updatedAt
    }));

    // Helper to get time value of a date string or Date object
    const getTime = (dateStr: string, fallbackDate: Date) => {
      if (!dateStr) return fallbackDate.getTime();
      const parsed = Date.parse(dateStr);
      return isNaN(parsed) ? fallbackDate.getTime() : parsed;
    };

    // Sort: latest date first
    parsedUpdates.sort((a, b) => {
      const timeA = getTime(a.published_date, a.created_at);
      const timeB = getTime(b.published_date, b.created_at);
      if (timeB !== timeA) {
        return timeB - timeA;
      }
      return b.id - a.id; // Secondary sort by id descending
    });

    const total = parsedUpdates.length;
    const paginatedUpdates = parsedUpdates.slice(offset, offset + limit);

    return NextResponse.json({
      updates: paginatedUpdates,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("GET updates error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
