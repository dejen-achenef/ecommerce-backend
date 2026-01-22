import prisma from "../lib/prisma.js";

export const adminController = {
  metricsOverview: async (req, res, next) => {
    try {
      const [users, orders, revenue, lowStock] = await Promise.all([
        prisma.user.count(),
        prisma.order.count(),
        prisma.order.aggregate({ _sum: { total: true } }),
        prisma.product.findMany({ where: { stock: { lt: 5 } }, orderBy: { stock: "asc" }, take: 10 }),
      ]);
      res.json({ success: true, message: "Admin metrics overview", object: { users, orders, revenue: revenue._sum.total || 0, lowStock } });
    } catch (e) { next(e); }
  },

  ordersByStatus: async (req, res, next) => {
    try {
      const rows = await prisma.order.groupBy({ by: ['status'], _count: { _all: true } });
      const data = rows.map(r => ({ status: r.status, count: r._count._all }));
      res.json({ success: true, message: "Orders by status", object: data });
    } catch (e) { next(e); }
  },

  salesByDay: async (req, res, next) => {
    try {
      const days = Number(req.query.days || 30);
      const rows = await prisma.$queryRaw`SELECT date_trunc('day', "createdAt") AS day, SUM("total")::float AS revenue
                                          FROM "Order"
                                          WHERE "createdAt" >= NOW() - interval '${days} days'
                                          GROUP BY 1
                                          ORDER BY 1 ASC`;
      res.json({ success: true, message: "Sales by day", object: rows });
    } catch (e) { next(e); }
  },

  topProducts: async (req, res, next) => {
    try {
      const limit = Number(req.query.limit || 10);
      const rows = await prisma.$queryRaw`SELECT oi."productId", oi."name", SUM(oi."quantity")::int AS units, SUM(oi."price" * oi."quantity")::float AS revenue
                                          FROM "OrderItem" oi
                                          GROUP BY oi."productId", oi."name"
                                          ORDER BY revenue DESC
                                          LIMIT ${limit}`;
      res.json({ success: true, message: "Top products", object: rows });
    } catch (e) { next(e); }
  },
};
