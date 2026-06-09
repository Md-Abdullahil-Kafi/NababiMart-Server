import initFirebaseAdmin from "../config/firebaseAdmin.js";
import User from "../models/user.model.js";

const getBearerToken = (authHeader = "") => {
  if (!authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.slice(7);
};

const isFirebaseConfigError = (error) =>
  error?.message?.includes("Missing Firebase Admin credentials") ||
  error?.message?.includes("Failed to parse private key") ||
  error?.message?.includes("Invalid PEM formatted message");

export const requireAuth = async (req, res, next) => {
  try {
    const token = getBearerToken(req.headers.authorization);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Missing token.",
      });
    }

    const admin = initFirebaseAdmin();
    const decoded = await admin.auth().verifyIdToken(token);

    req.auth = {
      uid: decoded.uid,
      email: decoded.email || null,
    };

    next();
  } catch (error) {
    if (isFirebaseConfigError(error)) {
      console.error("Firebase Admin configuration error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Authentication service is not configured correctly.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Unauthorized. Invalid or expired token.",
    });
  }
};

export const requireAdmin = async (req, res, next) => {
  try {
    const email = req.auth?.email;
    if (!email) {
      return res.status(403).json({
        success: false,
        message: "Forbidden. Admin access required.",
      });
    }

    const user = await User.findOne({ email }).select("role");
    if (!user || user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden. Admin access required.",
      });
    }

    req.auth.role = user.role;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to validate admin access.",
    });
  }
};
