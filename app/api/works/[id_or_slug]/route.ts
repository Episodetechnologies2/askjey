import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id_or_slug: string }> }
) {
  const { id_or_slug } = await params;

  try {
    const isId = /^\d+$/.test(id_or_slug);
    const parsedId = isId ? parseInt(id_or_slug) : -1;

    const work = await prisma.work.findFirst({
      where: {
        OR: [
          { id: parsedId },
          { slug: id_or_slug }
        ]
      },
      include: {
        gallery: {
          orderBy: { displayOrder: "asc" }
        }
      }
    });

    if (!work) {
      return NextResponse.json({ error: "Work not found" }, { status: 404 });
    }

    const responseData = {
      id: work.id,
      slug: work.slug,
      title: work.title,
      category: work.category,
      year: work.year,
      client: work.client,
      role: work.role,
      location: work.location,
      duration: work.duration,
      industry: work.industry,
      short_description: work.shortDescription,
      long_description: work.longDescription,
      services: work.services,
      technologies: work.technologies,
      results: work.results,
      tags: work.tags,
      featured_image: work.featuredImage,
      hero_image: work.heroImage,
      status: work.status,
      is_top_work: work.isTopWork ? 1 : 0,
      display_order: work.displayOrder,
      story: work.story,
      seo_title: work.seoTitle,
      seo_description: work.seoDescription,
      created_at: work.createdAt,
      updated_at: work.updatedAt,
      gallery: work.gallery.map(item => item.url)
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("GET work detail error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
