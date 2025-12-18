import express from "express";
import PermissionVerifyService from "../services/permissionVerify.service.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/verify", authMiddleware([]), async (req, res) => {
  try {
    const { permission } = req.body;
    const userId = req.user.id;

    if (!userId || !permission) {
      return res.status(400).json({
        success: false,
        message: "userId and permission are required",
      });
    }

    const allowed = await PermissionVerifyService.verifyPermission(
      userId,
      permission
    );

    res.status(200).json({ success: true, allowed });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
