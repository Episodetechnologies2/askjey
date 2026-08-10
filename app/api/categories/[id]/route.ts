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
  const categoryId = parseInt(id);

  const admin = await verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, slug } = body;

    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const calculatedSlug = slug ? slugify(slug) : slugify(name);

    // Find the category to verify it exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    // Check for duplicate name/slug on other category records within the same module
    const duplicate = await prisma.category.findFirst({
      where: {
        id: { not: categoryId },
        moduleType: category.moduleType,
        OR: [
          { name: name },
          { slug: calculatedSlug }
        ]
      }
    });

    if (duplicate) {
      return NextResponse.json(
        { error: `Another category with name or slug already exists in this module` },
        { status: 400 }
      );
    }

    const oldName = category.name;

    // Use transaction to update the category and cascade names
    await prisma.$transaction(async (tx) => {
      // 1. Update Category
      await tx.category.update({
        where: { id: categoryId },
        data: {
          name,
          slug: calculatedSlug
        }
      });

      // 2. Cascade changes to related tables
      if (category.moduleType === "work") {
        await tx.work.updateMany({
          where: {
            OR: [
              { categoryId: categoryId },
              { category: oldName }
            ]
          },
          data: {
            category: name,
            categoryId: categoryId
          }
        });
      } else if (category.moduleType === "update") {
        await tx.update.updateMany({
          where: { category: oldName },
          data: {
            category: name
          }
        });
      }
    });

    await logActivity(
      admin.id,
      "CATEGORY_UPDATE",
      `Updated category ID ${categoryId} from "${oldName}" to "${name}" (slug: "${calculatedSlug}")`,
      request
    );

    return NextResponse.json({ message: "Category updated successfully" });
  } catch (error) {
    console.error("PUT category error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const categoryId = parseInt(id);

  const admin = await verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Find the category to verify it exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    // Use transaction to nullify/reset references and delete the category
    await prisma.$transaction(async (tx) => {
      if (category.moduleType === "work") {
        // Set category string to empty, categoryId to null for works
        await tx.work.updateMany({
          where: {
            OR: [
              { categoryId: categoryId },
              { category: category.name }
            ]
          },
          data: {
            category: "",
            categoryId: null
          }
        });
      } else if (category.moduleType === "update") {
        // Reset category string to default "General" for updates
        await tx.update.updateMany({
          where: { category: category.name },
          data: {
            category: "General"
          }
        });
      }

      // Delete the category itself
      await tx.category.delete({
        where: { id: categoryId }
      });
    });

    await logActivity(
      admin.id,
      "CATEGORY_DELETE",
      `Deleted category "${category.name}" (ID: ${categoryId}, Module: ${category.moduleType})`,
      request
    );

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("DELETE category error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
