const ADMIN_IDENTIFIER = 1;

const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.roleIdentifier !== ADMIN_IDENTIFIER) {
    return res.status(403).json({
      success: false,
      message: "Admin access only",
    });
  }

  next();
};

export default adminMiddleware;
