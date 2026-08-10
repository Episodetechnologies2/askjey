import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { logActivity } from "@/lib/logger";

export async function GET(request: Request) {
  try {
    const rows = await prisma.settings.findMany();

    const settings: any = {};
    rows.forEach(row => {
      let val: any = row.value;
      if (row.keyName === "social_links" || row.keyName === "contact_details") {
        try {
          val = JSON.parse(row.value || "{}");
        } catch (e) { }
      }
      settings[row.keyName] = val;
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("GET settings error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const admin = await verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const settingsData = await request.json();
    const keys = Object.keys(settingsData);

    if (keys.length === 0) {
      return NextResponse.json({ error: "Settings payload is empty" }, { status: 400 });
    }

    await prisma.$transaction(
      keys.map(key => {
        const val = settingsData[key];
        const valString = typeof val === "object" && val !== null ? JSON.stringify(val) : String(val);

        return prisma.settings.upsert({
          where: { keyName: key },
          update: { value: valString },
          create: { keyName: key, value: valString }
        });
      })
    );

    await logActivity(admin.id, "SETTINGS_UPDATE", `Updated global settings: [${keys.join(', ')}]`, request);

    return NextResponse.json({ message: "Settings updated successfully" });
  } catch (error) {
    console.error("PUT settings error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
