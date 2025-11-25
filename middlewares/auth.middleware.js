import jwt from "jsonwebtoken";

const authMiddleware = (rolesAllowed = []) => {
  return (req, res, next) => {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "No token, authorization denied",
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token:", decoded);

      req.user = {
        id: decoded.userId,
        email: decoded.email,
        roleIdentifier: decoded.roleIdentifier,
      };
      console.log("User from token:", req.user);

      if (
        rolesAllowed.length > 0 &&
        !rolesAllowed.includes(decoded.roleIdentifier)
      ) {
        return res.status(403).json({
          success: false,
          message: "Access denied: creater is not  an instructor",
        });
      }

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
