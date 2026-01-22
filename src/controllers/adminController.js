import prisma from "../lib/prisma.js";

export const adminController = {
  metrics: async (req, res, next) => {
    try {
      const [users, orders, revenue, lowStock] = await Promise.all([
        prisma.user.count(),
        prisma.order.count(),
        prisma.order.aggregate({ _sum: { total: true } }),
        prisma.product.findMany({ where: { stock: { lt: 5 } }, orderBy: { stock: "asc" }, take: 10 }),
      ]);
      res.json({ success: true, message: "Admin metrics", object: { users, orders, revenue: revenue._sum.total || 0, lowStock } });
    } catch (e) { next(e); }
  },
};
