import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { logActivity } from "@/lib/logger";

export async function POST(request: Request) {
  const admin = await verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      title, slug, category, short_description, description, thumbnail, banner,
      author = "Jey Anand", tags, key_takeaways, status = "draft", published_date,
      seo_title, seo_description, gallery = []
    } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: "Title and unique slug are required" }, { status: 400 });
    }

    const dup = await prisma.update.findUnique({
      where: { slug }
    });
    if (dup) {
      return NextResponse.json({ error: "Slug is already in use by another article" }, { status: 400 });
    }

    const formattedDate = published_date || new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric"
    });

    const newUpdate = await prisma.update.create({
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
        status,
        publishedDate: formattedDate,
        seoTitle: seo_title || null,
        seoDescription: seo_description || null,
        gallery: {
          create: gallery.map((url: string, index: number) => ({
            imageUrl: url,
            displayOrder: index
          }))
        }
      }
    });

    await logActivity(admin.id, "UPDATE_CREATE", `Created update "${title}" with ID ${newUpdate.id}`, request);

    return NextResponse.json({ message: "Update created successfully", id: newUpdate.id }, { status: 201 });
  } catch (error) {
    console.error("Create update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
