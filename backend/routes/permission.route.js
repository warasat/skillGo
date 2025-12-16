import express from "express";
import PermissionService from "../services/permission.service.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// Create Permission Policy
router.post("/", authMiddleware([1]), async (req, res) => {
  try {
    const { title, description, permissions } = req.body;
    const policy = await PermissionService.createPermissionPolicy(
      title,
      description,
      permissions
    );
    res.status(201).json({ success: true, data: policy });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get All Permission Policies
router.get("/", authMiddleware([1]), async (req, res) => {
  try {
    const policies = await PermissionService.getAllPolicies();
    res.status(200).json({ success: true, data: policies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
// Update Permission Policy
router.put("/:id", authMiddleware([1]), async (req, res) => {
  try {
    const { title, description, permissions } = req.body;
    const updated = await PermissionService.updatePolicy(
      req.params.id,
      title,
      description,
      permissions
    );
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete Permission Policy
router.delete("/:id", authMiddleware([1]), async (req, res) => {
  try {
    const deleted = await PermissionService.deletePolicy(req.params.id);
    res.status(200).json({ success: true, data: deleted });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
});

export default router;
