import { addressRepository } from "../repositories/addressRepository.js";

export const addressController = {
  list: async (req, res, next) => {
    try { const items = await addressRepository.listByUser(req.user.id); res.json({ success: true, message: "Addresses", object: items }); } catch (e) { next(e); }
  },
  create: async (req, res, next) => {
    try { const item = await addressRepository.create(req.user.id, req.body); res.status(201).json({ success: true, message: "Address created", object: item }); } catch (e) { next(e); }
  },
  update: async (req, res, next) => {
    try { const item = await addressRepository.update(req.user.id, req.params.id, req.body); res.json({ success: true, message: "Address updated", object: item }); } catch (e) { next(e); }
  },
  remove: async (req, res, next) => {
    try { await addressRepository.remove(req.user.id, req.params.id); res.json({ success: true, message: "Address deleted" }); } catch (e) { next(e); }
  },
};
