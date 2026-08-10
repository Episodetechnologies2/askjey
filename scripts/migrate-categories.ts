import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper to generate URL slugs
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

async function runSql(sql: string) {
  try {
    console.log(`Executing SQL: ${sql}`);
    await prisma.$executeRawUnsafe(sql);
    console.log(`Success.`);
  } catch (error: any) {
    console.warn(`Warning/Error running SQL "${sql}":`, error.message);
  }
}

async function main() {
  console.log('Starting DB migration for categories...');

  // 1. Drop the old unique index on `name` if it exists
  await runSql(`ALTER TABLE categories DROP INDEX name`);

  // 2. Add the `module_type` column
  await runSql(`ALTER TABLE categories ADD COLUMN module_type VARCHAR(191) NOT NULL DEFAULT 'work'`);

  // 3. Add composite unique index for (name, module_type)
  await runSql(`ALTER TABLE categories ADD UNIQUE INDEX categories_name_module_type_key (name, module_type)`);

  // 4. Add composite unique index for (slug, module_type)
  await runSql(`ALTER TABLE categories ADD UNIQUE INDEX categories_slug_module_type_key (slug, module_type)`);

  // 5. Update slug and module_type on existing work categories
  console.log('Migrating existing work categories...');
  const categories = await prisma.category.findMany();
  for (const cat of categories) {
    const calculatedSlug = slugify(cat.name);
    // Explicitly update slug and moduleType using raw SQL to ensure type safety with potentially unsynced prisma client
    await prisma.$executeRawUnsafe(
      `UPDATE categories SET slug = ?, module_type = 'work' WHERE id = ?`,
      calculatedSlug,
      cat.id
    );
    console.log(`Updated Work Category: "${cat.name}" -> slug: "${calculatedSlug}"`);
  }

  // 6. Seed the default Update categories
  console.log('Seeding default update categories...');
  const defaultUpdateCategories = [
    'Design',
    'Branding',
    'Journey',
    'Tech',
    'Design Thinking',
    'Entrepreneurship',
    'Leadership',
    'Innovation'
  ];

  for (const name of defaultUpdateCategories) {
    const slug = slugify(name);
    try {
      // Check if it already exists to prevent duplicate entries
      const existing: any[] = await prisma.$queryRawUnsafe(
        `SELECT id FROM categories WHERE name = ? AND module_type = 'update'`,
        name
      );

      if (existing.length === 0) {
        await prisma.$executeRawUnsafe(
          `INSERT INTO categories (name, slug, module_type) VALUES (?, ?, 'update')`,
          name,
          slug
        );
        console.log(`Seeded Update Category: "${name}" -> slug: "${slug}"`);
      } else {
        console.log(`Update Category already exists: "${name}"`);
      }
    } catch (e: any) {
      console.error(`Failed to seed category "${name}":`, e.message);
    }
  }

  console.log('DB migration and seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Migration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
