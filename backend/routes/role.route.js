import express from "express";
import roleService from "../services/role.service.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";

const router = express.Router();

// CREATE ROLE (ADMIN ONLY)
router.post(
  "/roles",
  authMiddleware(1, 4),
  adminMiddleware,
  async (req, res) => {
    try {
      const { role } = req.body;

      if (!role) {
        return res.status(400).json({
          success: false,
          message: "Role name is required",
        });
      }

      const newRole = await roleService.createRole(role);

      res.status(201).json({
        success: true,
        message: "Role created successfully",
        data: newRole,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// GET ALL ROLES (ADMIN ONLY)
router.get("/roles", authMiddleware(), adminMiddleware, async (req, res) => {
  const roles = await roleService.getAllRoles();
  res.json({
    success: true,
    data: roles,
  });
});

export default router;
