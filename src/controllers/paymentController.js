import stripe from "../lib/stripe.js";
import prisma from "../lib/prisma.js";

export const paymentController = {
  createIntent: async (req, res, next) => {
    try {
      if (!stripe) return res.status(501).json({ success: false, message: "Stripe not configured" });
      const { orderId } = req.body;
      const order = await prisma.order.findUnique({ where: { id: orderId } });
      if (!order) return res.status(404).json({ success: false, message: "Order not found" });
      const amount = Math.round(Number(order.total) * 100);
      const intent = await stripe.paymentIntents.create({ amount, currency: "usd", metadata: { orderId } });
      await prisma.payment.create({ data: { orderId, provider: "stripe", intentId: intent.id, status: intent.status, amount: order.total, currency: "usd" } });
      res.json({ success: true, message: "Payment intent created", object: { clientSecret: intent.client_secret } });
    } catch (e) { next(e); }
  },
  webhook: async (req, res, next) => {
    try {
      // Skeleton: Expect to verify signature with STRIPE_WEBHOOK_SECRET in real setup
      const event = req.body; // In production, use raw body and signature verify
      if (event.type === "payment_intent.succeeded") {
        const intent = event.data.object;
        await prisma.$transaction(async (tx) => {
          await tx.payment.update({ where: { intentId: intent.id }, data: { status: intent.status } });
          const payment = await tx.payment.findUnique({ where: { intentId: intent.id } });
          const order = await tx.order.findUnique({ where: { id: payment.orderId }, include: { items: true } });
          // decrement inventory
          for (const it of order.items) {
            await tx.product.update({ where: { id: it.productId }, data: { stock: { decrement: it.quantity } } });
          }
          await tx.order.update({ where: { id: payment.orderId }, data: { status: "paid" } });
        });
      }
      res.json({ received: true });
    } catch (e) { next(e); }
  }
};
