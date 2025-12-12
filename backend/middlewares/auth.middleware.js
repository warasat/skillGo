import jwt from "jsonwebtoken";
import User from "../models/user.model.js"; // make sure path is correct

const authMiddleware = (rolesAllowed = []) => {
  return async (req, res, next) => {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "No token, authorization denied",
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user from DB
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      // Check status
      if (user.status === "inactive") {
        return res.status(401).json({
          success: false,
          message: "Your account is deactivated. Please contact admin.",
        });
      }

      // Optional: check roles
      if (
        rolesAllowed.length > 0 &&
        !rolesAllowed.includes(decoded.roleIdentifier)
      ) {
        return res.status(403).json({
          success: false,
          message: "Access denied: role not allowed",
        });
      }

      // attach user to req
      req.user = {
        id: user._id,
        email: user.email,
        roleIdentifier: user.role,
      };

      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "Token is not valid",
      });
    }
  };
};

export default authMiddleware;
