import prisma from "../lib/prisma.js";

export const productRepository = {
  list: async ({ skip, take, q, categorySlug, minPrice, maxPrice, sort }) => {
    const where = {};
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
  findById: (id) => prisma.product.findUnique({ where: { id }, include: { images: true, category: true } }),
  findBySlug: (slug) => prisma.product.findUnique({ where: { slug }, include: { images: true, category: true } }),
  create: (data) => prisma.product.create({ data }),
  update: (id, data) => prisma.product.update({ where: { id }, data }),
  remove: (id) => prisma.product.delete({ where: { id } }),
};
