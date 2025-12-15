import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const authMiddleware = (rolesAllowed = []) => {
  return async (req, res, next) => {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");
      if (!token) {
        return res
          .status(401)
          .json({ success: false, message: "No token, authorization denied" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).populate("role");
      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: "User not found" });
      }

      if (user.status === "inactive") {
        return res.status(401).json({
          success: false,
          message: "Your account is deactivated. Please contact admin.",
        });
      }

      // Check using role identifier
      if (
        rolesAllowed.length > 0 &&
        !rolesAllowed.includes(user.role.identifier)
      ) {
        return res
          .status(403)
          .json({ success: false, message: "Access denied: role not allowed" });
      }

      // Attach correctly formatted user object
      req.user = {
        id: user._id,
        email: user.email,
        roleIdentifier: user.role.identifier,
        roleName: user.role.role,
      };

      next();
    } catch (error) {
      res.status(401).json({ success: false, message: "Token is not valid" });
    }
  };
};

export default authMiddleware;
