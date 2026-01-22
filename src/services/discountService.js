import { discountRepository } from "../repositories/discountRepository.js";

export const discountService = {
  async validateAndCompute(code, subtotal) {
    if (!code) return { discountAmount: 0, discount: null };
    const discount = await discountRepository.findByCode(code);
    if (!discount) return { discountAmount: 0, discount: null };
    let discountAmount = 0;
    if (discount.type === "percent") discountAmount = (Number(discount.amount) / 100) * subtotal;
    if (discount.type === "fixed") discountAmount = Number(discount.amount);
    discountAmount = Math.min(discountAmount, subtotal);
    return { discountAmount, discount };
  },
};
