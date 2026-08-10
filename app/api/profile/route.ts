import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { logActivity } from "@/lib/logger";

export async function GET(request: Request) {
  const admin = await verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const profile = await prisma.user.findUnique({
      where: { id: admin.id },
      select: {
        id: true,
        name: true,
        username: true,
        avatarUrl: true,
        createdAt: true
      }
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: profile.id,
      name: profile.name,
      username: profile.username,
      email: profile.username, // keep email for client compatibility
      avatar_url: profile.avatarUrl,
      created_at: profile.createdAt
    });
  } catch (error) {
    console.error("GET profile error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const admin = await verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, username, currentPassword, oldPassword, newPassword, password, avatarUrl } = body;

    if (!name || !username) {
      return NextResponse.json({ error: "Name and username are required" }, { status: 400 });
    }

    // Fetch existing user to verify password
    const existingUser = await prisma.user.findUnique({
      where: { id: admin.id }
    });

    if (!existingUser) {
      return NextResponse.json({ error: "Administrator account not found" }, { status: 404 });
    }

    // Check if username already used by another admin
    const usernameCheck = await prisma.user.findFirst({
      where: {
        username: username,
        id: { not: admin.id }
      }
    });

    if (usernameCheck) {
      return NextResponse.json({ error: "Username is already in use by another administrator" }, { status: 400 });
    }

    const dataToUpdate: any = {
      name,
      username,
    };

    if (avatarUrl !== undefined) {
      dataToUpdate.avatarUrl = avatarUrl;
    }

    const effectiveOldPassword = currentPassword || oldPassword;
    const effectiveNewPassword = newPassword || password;

    let passwordUpdated = false;
    if (effectiveNewPassword && effectiveNewPassword.trim() !== '') {
      if (!effectiveOldPassword) {
        return NextResponse.json({ error: "Current password is required to set a new password." }, { status: 400 });
      }

      const isOldPasswordValid = await bcrypt.compare(effectiveOldPassword, existingUser.password);
      if (!isOldPasswordValid) {
        return NextResponse.json({ error: "Incorrect old/current password." }, { status: 400 });
      }

      if (effectiveNewPassword.length < 6) {
        return NextResponse.json({ error: "New password must be at least 6 characters long." }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(effectiveNewPassword, 10);
      dataToUpdate.password = hashedPassword;
      passwordUpdated = true;
    }

    const updatedAdmin = await prisma.user.update({
      where: { id: admin.id },
      data: dataToUpdate,
      select: {
        id: true,
        name: true,
        username: true,
        avatarUrl: true
      }
    });

    await logActivity(
      admin.id,
      "PROFILE_UPDATE",
      `Updated profile details. Password changed: ${passwordUpdated}`,
      request
    );

    return NextResponse.json({
      message: passwordUpdated ? "Profile and password updated successfully" : "Profile updated successfully",
      admin: {
        id: updatedAdmin.id,
        name: updatedAdmin.name,
        username: updatedAdmin.username,
        email: updatedAdmin.username, // keep email for client compatibility
        avatarUrl: updatedAdmin.avatarUrl
      }
    });
  } catch (error) {
    console.error("PUT profile error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
