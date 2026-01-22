import prisma from "../lib/prisma.js";

export const productRepository = {
  list: async ({ skip, take, q, categorySlug, minPrice, maxPrice, sort }) => {
    const where = { deletedAt: null };
    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }
    if (typeof minPrice === "number" || typeof maxPrice === "number") {
      where.price = {};
      if (typeof minPrice === "number") where.price.gte = minPrice;
      if (typeof maxPrice === "number") where.price.lte = maxPrice;
    }
    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    let orderBy = { createdAt: "desc" };
    if (sort === "price_asc") orderBy = { price: "asc" };
    if (sort === "price_desc") orderBy = { price: "desc" };

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take,
        orderBy,
        include: { images: true, category: true },
      }),
      prisma.product.count({ where }),
    ]);
    return { items, total };
  },
  searchFTS: async (q, { skip, take }) => {
    // Simple FTS using Postgres plainto_tsquery on name and description
    return prisma.$queryRaw`SELECT p.* FROM "Product" p WHERE to_tsvector('english', coalesce(p.name,'') || ' ' || coalesce(p.description,'')) @@ plainto_tsquery('english', ${q}) OFFSET ${skip} LIMIT ${take}`;
  },
  findById: (id) => prisma.product.findUnique({ where: { id }, include: { images: true, category: true } }),
  findBySlug: (slug) => prisma.product.findUnique({ where: { slug }, include: { images: true, category: true } }),
  create: (data) => prisma.product.create({ data }),
  update: (id, data) => prisma.product.update({ where: { id }, data }),
  remove: (id) => prisma.product.update({ where: { id }, data: { deletedAt: new Date(), active: false } }),
  restore: (id) => prisma.product.update({ where: { id }, data: { deletedAt: null, active: true } }),
};
