import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "http://localhost:3000";

  const staticUrls = [
    "",
    "/booking",
    "/career",
    "/contact",
    "/journey",
    "/mentorship",
    "/privacy-policy",
    "/terms-of-service",
    "/companies",
    "/updates"
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  let workUrls: any[] = [];
  try {
    const works = await prisma.work.findMany({
      where: { status: "published" },
      select: { slug: true, updatedAt: true }
    });
    workUrls = works.map((work) => ({
      url: `${baseUrl}/work/${work.slug}`,
      lastModified: work.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch (e) {
    console.error("Sitemap dynamic works query failed:", e);
  }

  let updateUrls: any[] = [];
  try {
    const updates = await prisma.update.findMany({
      where: { status: "published" },
      select: { slug: true, updatedAt: true }
    });
    updateUrls = updates.map((update) => ({
      url: `${baseUrl}/updates/${update.slug}`,
      lastModified: update.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch (e) {
    console.error("Sitemap dynamic updates query failed:", e);
  }

  return [...staticUrls, ...workUrls, ...updateUrls];
}
