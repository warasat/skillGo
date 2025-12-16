import express from "express";
import adminUserService from "../services/adminUser.service.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/users", authMiddleware([1]), async (req, res) => {
  try {
    const users = await adminUserService.getAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/users/:id", authMiddleware([1]), async (req, res) => {
  try {
    const deletedUser = await adminUserService.deleteUser(req.params.id);
    if (!deletedUser)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, data: deletedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
router.patch("/users/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const updatedUser = await adminUserService.updateUserStatus(
      req.params.id,
      status
    );
    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
//  Update user role
router.patch("/users/:id/role", authMiddleware([1]), async (req, res) => {
  try {
    const { roleId } = req.body;
    if (!roleId) {
      return res
        .status(400)
        .json({ success: false, message: "Role ID is required" });
    }

    const updatedUser = await adminUserService.updateUserRole(
      req.params.id,
      roleId
    );
    res.status(200).json({
      success: true,
      message: "Role updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
