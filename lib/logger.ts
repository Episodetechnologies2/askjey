import prisma from "./prisma";

export async function logActivity(adminId: number | null, action: string, details: string | null, req?: Request) {
  try {
    let ipAddress: string | null = null;
    if (req) {
      ipAddress = req.headers.get("x-forwarded-for") || null;
    }
    await prisma.activityLog.create({
      data: {
        adminId: adminId,
        action: action,
        details: details,
        ipAddress: ipAddress,
      }
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}
