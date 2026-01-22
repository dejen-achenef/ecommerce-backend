import prisma from "../lib/prisma.js";

export const checkUserByid = async (req, res, next) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    req.product = product;
    return next();
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
