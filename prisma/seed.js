import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@example.com";
  const adminExists = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!adminExists) {
    const passwordHash = await bcrypt.hash("Admin@12345", 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: passwordHash,
        name: "Admin",
        role: "ADMIN",
      },
    });
  }

  const cat = await prisma.category.upsert({
    where: { slug: "general" },
    update: {},
    create: {
      name: "General",
      slug: "general",
      description: "General catalog items",
    },
  });

  await prisma.product.upsert({
    where: { slug: "sample-product" },
    update: {},
    create: {
      name: "Sample Product",
      slug: "sample-product",
      description: "A seeded sample product",
      price: 19.99,
      stock: 50,
      categoryId: cat.id,
      images: {
        create: [{ url: "https://example.com/image.jpg", altText: "Sample" }],
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
