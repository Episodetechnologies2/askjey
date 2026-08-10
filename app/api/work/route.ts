import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { logActivity } from "@/lib/logger";

import { slugify } from "@/lib/utils";

export async function POST(request: Request) {
  const admin = await verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      title, slug, category, year, client, role, location, duration, industry,
      short_description, long_description, services, technologies, results, tags,
      featured_image, hero_image, status = "draft", is_top_work = false, story,
      seo_title, seo_description, gallery = [], display_order = 0
    } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: "Title and unique slug are required" }, { status: 400 });
    }

    const dup = await prisma.work.findUnique({
      where: { slug }
    });
    if (dup) {
      return NextResponse.json({ error: "Slug is already in use by another work" }, { status: 400 });
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

    const newWork = await prisma.work.create({
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
        status,
        isTopWork: !!is_top_work,
        story: story || [],
        seoTitle: seo_title || null,
        seoDescription: seo_description || null,
        displayOrder: parseInt(String(display_order)) || 0,
        gallery: {
          create: gallery.map((url: string, index: number) => ({
            url: url,
            displayOrder: index,
            type: "image"
          }))
        }
      }
    });

    await logActivity(admin.id, "WORK_CREATE", `Created work "${title}" with ID ${newWork.id}`, request);

    return NextResponse.json({ message: "Work created successfully", id: newWork.id }, { status: 201 });
  } catch (error) {
    console.error("Create work error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
