const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Seeding admin user: Askjey...");
    const hashedPassword = await bcrypt.hash("AskJey@2025", 10);
    
    const user = await prisma.user.upsert({
      where: { username: "Askjey" },
      update: {
        password: hashedPassword,
        name: "Askjey"
      },
      create: {
        name: "Askjey",
        username: "Askjey",
        password: hashedPassword,
        avatarUrl: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"
      }
    });
    
    console.log("Successfully seeded/updated admin user:", user.username);
  } catch (error) {
    console.error("Failed to seed admin user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
