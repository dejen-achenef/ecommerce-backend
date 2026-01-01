import jwt from "jsonwebtoken";

export const tokenChecker = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accesstoken;
    const refreshToken = req.cookies.refreshtoken;

    // ---------------------------------------------
    // 1. If access token exists → verify it
    // ---------------------------------------------
    if (accessToken) {
      try {
        const decoded = jwt.verify(accessToken, process.env.accesskey);
        req.user = decoded; // attach user
        return next();
      } catch (err) {
        // Token invalid or expired → continue to refreshToken logic
      }
    }

    // ---------------------------------------------
    // 2. If no access token, try refresh token
    // ---------------------------------------------
    if (refreshToken) {
      try {
        const decodedRefresh = jwt.verify(refreshToken, process.env.refreshkey);

        // generate new access token
        const newAccessToken = jwt.sign(
          { id: decodedRefresh.id, role: decodedRefresh.role },
          process.env.accesskey,
          { expiresIn: "1h" }
        );

        // send new cookie
        res.cookie("accesstoken", newAccessToken, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          maxAge: 3600000, // 1 hour
        });

        req.user = decodedRefresh; // attach user
        return next();
      } catch (err) {
        return res.status(401).json({
          success: false,
          message: "Refresh token expired, please login again",
        });
      }
    }

    // ---------------------------------------------
    // 3. No tokens at all
    // ---------------------------------------------
    return res.status(401).json({
      success: false,
      message: "Unauthorized: No token provided",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error in tokenChecker",
      error: error.message,
    });
  }
};
