// Checks admin role from JWT-populated req.user
export const AdminChecker = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden: admin only" });
    }
    return next();
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};
