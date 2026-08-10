import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { logActivity } from "@/lib/logger";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const updateId = parseInt(id);

  const admin = await verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      title, slug, category, short_description, description, thumbnail, banner,
      author, tags, key_takeaways, status, published_date,
      seo_title, seo_description, gallery = []
    } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: "Title and unique slug are required" }, { status: 400 });
    }

    const dup = await prisma.update.findFirst({
      where: {
        slug,
        id: { not: updateId }
      }
    });
    if (dup) {
      return NextResponse.json({ error: "Slug is already in use by another article" }, { status: 400 });
    }

    const updateCheck = await prisma.update.findUnique({
      where: { id: updateId }
    });
    if (!updateCheck) {
      return NextResponse.json({ error: "Update article not found" }, { status: 404 });
    }

    await prisma.$transaction([
      prisma.update.update({
        where: { id: updateId },
        data: {
          slug,
          title,
          category: category || "General",
          shortDescription: short_description || "",
          description: Array.isArray(description) ? description : [description],
          thumbnail: thumbnail || "",
          banner: banner || "",
          author: author || "Jey Anand",
          tags: tags || [],
          keyTakeaways: key_takeaways || [],
          status: status || "draft",
          publishedDate: published_date || "Feb 2026",
          seoTitle: seo_title || null,
          seoDescription: seo_description || null,
        }
      }),
      prisma.updateGallery.deleteMany({
        where: { updateId: updateId }
      }),
      prisma.updateGallery.createMany({
        data: gallery.map((url: string, index: number) => ({
          updateId: updateId,
          imageUrl: url,
          displayOrder: index
        }))
      })
    ]);

    await logActivity(admin.id, "UPDATE_UPDATE", `Updated update "${title}" with ID ${updateId}`, request);

    return NextResponse.json({ message: "Update updated successfully" });
  } catch (error) {
    console.error("Update update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const updateId = parseInt(id);

  const admin = await verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const update = await prisma.update.findUnique({
      where: { id: updateId }
    });
    if (!update) {
      return NextResponse.json({ error: "Update not found" }, { status: 404 });
    }

    await prisma.update.delete({
      where: { id: updateId }
    });

    await logActivity(admin.id, "UPDATE_DELETE", `Deleted update "${update.title}" with ID ${updateId}`, request);

    return NextResponse.json({ message: "Update deleted successfully" });
  } catch (error) {
    console.error("Delete update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
