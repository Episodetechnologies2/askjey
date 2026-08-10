import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { logActivity } from "@/lib/logger";
import { slugify } from "@/lib/utils";

export async function PUT(
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
    const body = await request.json();
    const {
      title, slug, category, year, client, role, location, duration, industry,
      short_description, long_description, services, technologies, results, tags,
      featured_image, hero_image, status, is_top_work, story,
      seo_title, seo_description, gallery = [], display_order = 0
    } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: "Title and unique slug are required" }, { status: 400 });
    }

    const dup = await prisma.work.findFirst({
      where: {
        slug,
        id: { not: workId }
      }
    });
    if (dup) {
      return NextResponse.json({ error: "Slug is already in use by another work" }, { status: 400 });
    }

    const workCheck = await prisma.work.findUnique({
      where: { id: workId }
    });
    if (!workCheck) {
      return NextResponse.json({ error: "Work not found" }, { status: 404 });
    }

    let categoryId: number | null = null;
    if (category) {
      const dbCategory = await prisma.category.upsert({
        where: {
          name_moduleType: {
            name: category,
            moduleType: "work"
          }
        },
        update: {},
        create: {
          name: category,
          slug: slugify(category),
          moduleType: "work"
        }
      });
      categoryId = dbCategory.id;
    }

    await prisma.$transaction([
      prisma.work.update({
        where: { id: workId },
        data: {
          slug,
          title,
          category: category || "",
          categoryId: categoryId,
          year: year || "2026",
          client: client || "",
          role: role || "",
          location: location || "",
          duration: duration || "",
          industry: industry || "",
          shortDescription: short_description || "",
          longDescription: long_description || "",
          services: services || [],
          technologies: technologies || [],
          results: results || [],
          tags: tags || [],
          featuredImage: featured_image || "",
          heroImage: hero_image || "",
          status: status || "draft",
          isTopWork: !!is_top_work,
          story: story || [],
          seoTitle: seo_title || null,
          seoDescription: seo_description || null,
          displayOrder: parseInt(String(display_order)) || 0,
        }
      }),
      prisma.workMedia.deleteMany({
        where: { workId: workId }
      }),
      prisma.workMedia.createMany({
        data: gallery.map((url: string, index: number) => ({
          workId: workId,
          url: url,
          displayOrder: index,
          type: "image"
        }))
      })
    ]);

    await logActivity(admin.id, "WORK_UPDATE", `Updated work "${title}" with ID ${workId}`, request);

    return NextResponse.json({ message: "Work updated successfully" });
  } catch (error) {
    console.error("Update work error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
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
    const work = await prisma.work.findUnique({
      where: { id: workId }
    });
    if (!work) {
      return NextResponse.json({ error: "Work not found" }, { status: 404 });
    }

    await prisma.work.delete({
      where: { id: workId }
    });

    await logActivity(admin.id, "WORK_DELETE", `Deleted work "${work.title}" with ID ${workId}`, request);

    return NextResponse.json({ message: "Work deleted successfully" });
  } catch (error) {
    console.error("Delete work error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
