const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const milestonesData = require('../lib/data/journeyMilestones.json');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Seeding Journey milestones into database...");
    
    // 1. Generate journeyschema.sql file
    let sqlContent = `-- Table structure for table \`journey\`\n`;
    sqlContent += `CREATE TABLE IF NOT EXISTS \`journey\` (\n`;
    sqlContent += `  \`id\` INT NOT NULL AUTO_INCREMENT,\n`;
    sqlContent += `  \`year\` VARCHAR(255) NOT NULL,\n`;
    sqlContent += `  \`title\` VARCHAR(255) NOT NULL,\n`;
    sqlContent += `  \`short_description\` TEXT NOT NULL,\n`;
    sqlContent += `  \`long_description\` TEXT NOT NULL,\n`;
    sqlContent += `  \`image\` VARCHAR(255) NOT NULL,\n`;
    sqlContent += `  \`display_order\` INT NOT NULL DEFAULT 0,\n`;
    sqlContent += `  \`created_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),\n`;
    sqlContent += `  \`updated_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),\n`;
    sqlContent += `  PRIMARY KEY (\`id\`)\n`;
    sqlContent += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;
    sqlContent += `-- Dumping data for table \`journey\`\n`;

    const escapeSql = (str) => {
      if (!str) return "''";
      return "'" + str.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
    };

    const insertValues = [];

    for (let i = 0; i < milestonesData.length; i++) {
      const m = milestonesData[i];
      const displayOrder = i + 1;
      
      // Upsert into Prisma DB
      const existing = await prisma.journey.findFirst({
        where: {
          year: m.year,
          title: m.title
        }
      });

      if (!existing) {
        await prisma.journey.create({
          data: {
            year: m.year,
            title: m.title,
            shortDescription: m.description,
            longDescription: m.longDescription,
            image: m.image,
            displayOrder: displayOrder
          }
        });
      }

      insertValues.push(
        `(${displayOrder}, ${escapeSql(m.year)}, ${escapeSql(m.title)}, ${escapeSql(m.description)}, ${escapeSql(m.longDescription)}, ${escapeSql(m.image)}, ${displayOrder}, NOW(), NOW())`
      );
    }

    sqlContent += `INSERT INTO \`journey\` (\`id\`, \`year\`, \`title\`, \`short_description\`, \`long_description\`, \`image\`, \`display_order\`, \`created_at\`, \`updated_at\`) VALUES\n`;
    sqlContent += insertValues.join(',\n') + ';\n';

    const sqlFilePath = path.join(__dirname, 'journeyschema.sql');
    fs.writeFileSync(sqlFilePath, sqlContent, 'utf8');
    console.log(`Generated ${sqlFilePath} successfully.`);

    const count = await prisma.journey.count();
    console.log(`Successfully seeded! Total journey items in DB: ${count}`);

  } catch (error) {
    console.error("Error seeding journey table:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
