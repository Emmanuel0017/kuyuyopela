import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@kuyuyopela.com';
  const password = process.env.SEED_ADMIN_PASSWORD ?? 'kuyuyopela2026';

  const existingAdmin = await prisma.admin.findUnique({ where: { email } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.admin.create({
      data: { email, passwordHash, role: 'SUPER_ADMIN' },
    });
    console.log(`Seeded SUPER_ADMIN: ${email} / ${password}`);
  } else {
    console.log(`Admin already exists: ${email}`);
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());