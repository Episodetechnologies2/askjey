import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";

async function seedServicesFromCsv() {
  try {
    const count = await prisma.service.count();
    if (count > 0) return;

    const csvPath = path.join(process.cwd(), "services.csv");
    if (!fs.existsSync(csvPath)) return;

    const fileContent = fs.readFileSync(csvPath, "utf8");
    const lines = fileContent.split("\n");

    const servicesToCreate = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Split by comma outside of quotes
      const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      if (parts.length >= 3) {
        const name = parts[0].replace(/^"|"$/g, "").trim();
        const priceInr = parts[1].replace(/^"|"$/g, "").trim();
        const priceUsd = parts[2].replace(/^"|"$/g, "").trim();
        const notes = parts[3] ? parts[3].replace(/^"|"$/g, "").trim() : "";
        servicesToCreate.push({ name, priceInr, priceUsd, notes });
      }
    }

    if (servicesToCreate.length > 0) {
      await prisma.service.createMany({
        data: servicesToCreate
      });
    }
  } catch (error) {
    console.error("Failed to seed services from CSV:", error);
  }
}

export async function GET(request: Request) {
  try {
    await seedServicesFromCsv();
    const services = await prisma.service.findMany();
    return NextResponse.json(services);
  } catch (error) {
    console.error("GET services error:", error);
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
    const { id, priceInr, priceUsd, notes } = body;

    if (!id) {
      return NextResponse.json({ error: "Service ID is required" }, { status: 400 });
    }

    const updatedService = await prisma.service.update({
      where: { id: parseInt(id) },
      data: {
        priceInr,
        priceUsd,
        notes
      }
    });

    return NextResponse.json(updatedService);
  } catch (error) {
    console.error("PUT services error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
