import prisma from "../lib/prisma.js";

export const userRepository = {
  findByEmail: (email) => prisma.user.findUnique({ where: { email } }),
  create: (data) => prisma.user.create({ data }),
  findById: (id) => prisma.user.findUnique({ where: { id } }),
};
