import { randomUUID } from "node:crypto";

export function requestId(req, res, next) {
  const headerKey = "x-request-id";
  const id = req.headers[headerKey] || randomUUID();
  req.id = id;
  res.setHeader(headerKey, id);
  next();
}
