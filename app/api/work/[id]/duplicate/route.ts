import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { logActivity } from "@/lib/logger";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const workId = parseInt(id);

  const admin = await verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sourceWork = await prisma.work.findUnique({
      where: { id: workId },
      include: { gallery: true }
    });

    if (!sourceWork) {
      return NextResponse.json({ error: "Work not found" }, { status: 404 });
    }

    const newTitle = `${sourceWork.title} (Copy)`;
    const newSlug = `${sourceWork.slug}-copy-${Math.round(Math.random() * 1000)}`;

    const newWork = await prisma.work.create({
      data: {
        slug: newSlug,
        title: newTitle,
        category: sourceWork.category,
        categoryId: sourceWork.categoryId,
        year: sourceWork.year,
        client: sourceWork.client,
        role: sourceWork.role,
        location: sourceWork.location,
        duration: sourceWork.duration,
        industry: sourceWork.industry,
        shortDescription: sourceWork.shortDescription,
        longDescription: sourceWork.longDescription,
        services: sourceWork.services || [],
        technologies: sourceWork.technologies || [],
        results: sourceWork.results || [],
        tags: sourceWork.tags || [],
        featuredImage: sourceWork.featuredImage,
        heroImage: sourceWork.heroImage,
        status: "draft",
        isTopWork: sourceWork.isTopWork,
        story: sourceWork.story || [],
        seoTitle: sourceWork.seoTitle,
        seoDescription: sourceWork.seoDescription,
        displayOrder: sourceWork.displayOrder,
        gallery: {
          create: sourceWork.gallery.map(item => ({
            url: item.url,
            displayOrder: item.displayOrder,
            type: item.type
          }))
        }
      }
    });

    await logActivity(admin.id, "WORK_DUPLICATE", `Duplicated work ID ${workId} to new work ID ${newWork.id}`, request);

    return NextResponse.json({ message: "Work duplicated successfully", id: newWork.id }, { status: 201 });
  } catch (error) {
    console.error("Duplicate work error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
