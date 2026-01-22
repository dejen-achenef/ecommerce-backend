import bcrypt from "bcrypt";
import { userRepository } from "../repositories/userRepository.js";

export const authService = {
  async register({ email, password, name }) {
    const exists = await userRepository.findByEmail(email);
    if (exists) {
      const err = new Error("Email already registered");
      err.status = 409;
      throw err;
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await userRepository.create({ email, password: passwordHash, name });
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  },

  async login({ email, password }) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      const err = new Error("Invalid credentials");
      err.status = 401;
      throw err;
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      const err = new Error("Invalid credentials");
      err.status = 401;
      throw err;
    }
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  },
};
