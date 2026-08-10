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

    const update = await prisma.update.findFirst({
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

    if (!update) {
      return NextResponse.json({ error: "Update article not found" }, { status: 404 });
    }

    const responseData = {
      id: update.id,
      slug: update.slug,
      title: update.title,
      category: update.category,
      short_description: update.shortDescription,
      description: typeof update.description === "string" ? JSON.parse(update.description) : update.description,
      thumbnail: update.thumbnail,
      banner: update.banner,
      author: update.author,
      tags: typeof update.tags === "string" ? JSON.parse(update.tags) : update.tags,
      key_takeaways: typeof update.keyTakeaways === "string" ? JSON.parse(update.keyTakeaways) : update.keyTakeaways,
      status: update.status,
      published_date: update.publishedDate,
      seo_title: update.seoTitle,
      seo_description: update.seoDescription,
      created_at: update.createdAt,
      updated_at: update.updatedAt,
      gallery: update.gallery.map(item => item.imageUrl)
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("GET update detail error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
