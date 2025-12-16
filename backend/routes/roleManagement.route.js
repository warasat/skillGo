import express from "express";
import RolePermissionService from "../services/roleManagement.service.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// Get all roles with assigned permissions
router.get("/", authMiddleware([1]), async (req, res) => {
  try {
    const data = await RolePermissionService.getAllRolePermissions();
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Assign permissions to a role
router.post("/", authMiddleware([1]), async (req, res) => {
  try {
    const { roleId, permissionIds } = req.body;
    const data = await RolePermissionService.assignPermissionsToRole(
      roleId,
      permissionIds
    );
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Get permissions of a single role
router.get("/:roleId", authMiddleware([1]), async (req, res) => {
  try {
    const data = await RolePermissionService.getPermissionsByRole(
      req.params.roleId
    );
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
});

// Remove all permissions from a role
router.delete("/:roleId", authMiddleware([1]), async (req, res) => {
  try {
    const data = await RolePermissionService.removeAllPermissions(
      req.params.roleId
    );
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
});

export default router;
