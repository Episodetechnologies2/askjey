import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { logActivity } from "@/lib/logger";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "public/uploads");
const thumbnailDir = path.join(uploadDir, "thumbnails");

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const mediaId = parseInt(id);

  const admin = await verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const file = await prisma.media.findUnique({
      where: { id: mediaId }
    });
    if (!file) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    const mainFilePath = path.join(uploadDir, file.filename);
    const thumbFilePath = path.join(thumbnailDir, file.filename);

    if (fs.existsSync(mainFilePath)) {
      fs.unlinkSync(mainFilePath);
    }
    if (fs.existsSync(thumbFilePath)) {
      fs.unlinkSync(thumbFilePath);
    }

    await prisma.media.delete({
      where: { id: mediaId }
    });

    await logActivity(admin.id, "MEDIA_DELETE", `Deleted media file: "${file.originalName}"`, request);

    return NextResponse.json({ message: "Media file deleted successfully" });
  } catch (error) {
    console.error("Delete media error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
