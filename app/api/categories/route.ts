import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { logActivity } from "@/lib/logger";
import { slugify } from "@/lib/utils";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const moduleType = url.searchParams.get("module") || "work";
  const search = url.searchParams.get("search");

  try {
    const whereClause: any = {
      moduleType: moduleType
    };

    if (search) {
      whereClause.name = {
        contains: search
      };
    }

    const categories = await prisma.category.findMany({
      where: whereClause,
      orderBy: {
        name: "asc"
      }
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("GET categories error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, slug, moduleType = "work" } = body;

    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const calculatedSlug = slug ? slugify(slug) : slugify(name);

    // Check for duplicate category name/slug within the same module
    const duplicate = await prisma.category.findFirst({
      where: {
        OR: [
          { name: name, moduleType: moduleType },
          { slug: calculatedSlug, moduleType: moduleType }
        ]
      }
    });

    if (duplicate) {
      return NextResponse.json(
        { error: `Category with name or slug already exists in the ${moduleType} module` },
        { status: 400 }
      );
    }

    const newCategory = await prisma.category.create({
      data: {
        name,
        slug: calculatedSlug,
        moduleType
      }
    });

    await logActivity(
      admin.id,
      "CATEGORY_CREATE",
      `Created category "${name}" (slug: "${calculatedSlug}") for module "${moduleType}"`,
      request
    );

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("POST category error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
