import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { logActivity } from "@/lib/logger";
import sharp from "sharp";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "public/uploads");
const thumbnailDir = path.join(uploadDir, "thumbnails");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(thumbnailDir)) {
  fs.mkdirSync(thumbnailDir, { recursive: true });
}

export async function GET(request: Request) {
  const admin = await verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const folder = url.searchParams.get("folder") || "/";
  const search = url.searchParams.get("search");

  try {
    const whereClause: any = { folder };
    if (search) {
      whereClause.originalName = { contains: search };
    }

    const mediaList = await prisma.media.findMany({
      where: whereClause,
      orderBy: { id: "desc" }
    });

    const mappedMedia = mediaList.map(m => ({
      id: m.id,
      filename: m.filename,
      original_name: m.originalName,
      mime_type: m.mimeType,
      size: m.size,
      url: m.url,
      folder: m.folder,
      created_at: m.createdAt
    }));

    return NextResponse.json(mappedMedia);
  } catch (error) {
    console.error("GET media error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "No image file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = `${uniqueSuffix}.webp`;
    const mainPath = path.join(uploadDir, filename);
    const thumbPath = path.join(thumbnailDir, filename);

    await sharp(buffer)
      .webp({ quality: 80 })
      .toFile(mainPath);

    await sharp(buffer)
      .resize(300, 300, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 70 })
      .toFile(thumbPath);

    const size = fs.statSync(mainPath).size;
    const baseUrl = "/uploads";

    const dbResult = await prisma.media.create({
      data: {
        filename: filename,
        originalName: file.name,
        mimeType: "image/webp",
        size: size,
        url: `${baseUrl}/${filename}`,
        folder: "/"
      }
    });

    await logActivity(admin.id, "MEDIA_UPLOAD", `Uploaded media file: "${file.name}"`, request);

    return NextResponse.json({
      id: dbResult.id,
      filename: dbResult.filename,
      originalName: dbResult.originalName,
      mimeType: dbResult.mimeType,
      size: dbResult.size,
      url: dbResult.url,
      thumbnailUrl: `${baseUrl}/thumbnails/${filename}`,
      created_at: dbResult.createdAt
    }, { status: 201 });
  } catch (error) {
    console.error("Upload media error:", error);
    return NextResponse.json({ error: "Failed to upload and process image" }, { status: 500 });
  }
}
