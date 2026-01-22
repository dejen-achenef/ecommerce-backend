import { shippingRepository } from "../repositories/shippingRepository.js";
import { AdminChecker } from "../middleware/adminCheker.js";

export const shippingController = {
  list: async (req, res, next) => { try { const items = await shippingRepository.list(); res.json({ success: true, message: "Shipping methods", object: items }); } catch (e) { next(e); } },
  adminList: async (req, res, next) => { try { const items = await shippingRepository.adminList(); res.json({ success: true, message: "Shipping methods", object: items }); } catch (e) { next(e); } },
  create: async (req, res, next) => { try { const item = await shippingRepository.create(req.body); res.status(201).json({ success: true, message: "Shipping method created", object: item }); } catch (e) { next(e); } },
  update: async (req, res, next) => { try { const item = await shippingRepository.update(req.params.id, req.body); res.json({ success: true, message: "Shipping method updated", object: item }); } catch (e) { next(e); } },
  remove: async (req, res, next) => { try { await shippingRepository.remove(req.params.id); res.json({ success: true, message: "Shipping method deleted" }); } catch (e) { next(e); } },
};
