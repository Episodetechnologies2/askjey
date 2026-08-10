import prisma from "@/lib/prisma";

export async function getSettings() {
  try {
    const rows = await prisma.settings.findMany();
    const settings: any = {};
    
    rows.forEach(row => {
      let val: any = row.value;
      if (row.keyName === "social_links" || row.keyName === "contact_details") {
        try {
          val = JSON.parse(row.value || "{}");
        } catch (e) {
          val = {};
        }
      }
      settings[row.keyName] = val;
    });
    
    return settings;
  } catch (error) {
    console.error("Failed to load settings from DB:", error);
    return {};
  }
}
