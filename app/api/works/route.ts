import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category");
  const search = url.searchParams.get("search");
  const status = url.searchParams.get("status");
  const featured = url.searchParams.get("featured");
  const sort = url.searchParams.get("sort");
  const order = url.searchParams.get("order");
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "50");
  const offset = (page - 1) * limit;

  // Authentication check
  const admin = await verifyAdmin(request);
  const statusFilter = admin ? (status || "all") : "published";

  try {
    const whereClause: any = {};

    if (statusFilter !== "all") {
      whereClause.status = statusFilter;
    }

    if (featured === "true" || featured === "1") {
      whereClause.isTopWork = true;
    } else if (featured === "false" || featured === "0") {
      whereClause.isTopWork = false;
    }

    if (category) {
      whereClause.category = {
        equals: category,
      };
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search } },
        { client: { contains: search } },
        { shortDescription: { contains: search } },
        { category: { contains: search } }
      ];
    }

    // Sort order field mapping
    let orderByField = "displayOrder";
    if (sort === "created_at") orderByField = "createdAt";
    else if (sort === "updated_at") orderByField = "updatedAt";
    else if (sort === "title") orderByField = "title";
    else if (sort === "year") orderByField = "year";
    else if (sort === "display_order") orderByField = "displayOrder";

    const sortOrder = order === "desc" ? "desc" : "asc";

    const works = await prisma.work.findMany({
      where: whereClause,
      orderBy: {
        [orderByField]: sortOrder
      },
      skip: offset,
      take: limit
    });

    const total = await prisma.work.count({
      where: whereClause
    });

    // Map works array back to match legacy snake_case response schema
    const mappedWorks = works.map(w => ({
      id: w.id,
      slug: w.slug,
      title: w.title,
      category: w.category,
      year: w.year,
      client: w.client,
      role: w.role,
      location: w.location,
      duration: w.duration,
      industry: w.industry,
      short_description: w.shortDescription,
      long_description: w.longDescription,
      services: w.services,
      technologies: w.technologies,
      results: w.results,
      tags: w.tags,
      featured_image: w.featuredImage,
      hero_image: w.heroImage,
      status: w.status,
      is_top_work: w.isTopWork ? 1 : 0,
      display_order: w.displayOrder,
      story: w.story,
      seo_title: w.seoTitle,
      seo_description: w.seoDescription,
      created_at: w.createdAt,
      updated_at: w.updatedAt
    }));

    return NextResponse.json({
      works: mappedWorks,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("GET works error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
