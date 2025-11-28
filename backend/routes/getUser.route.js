import express from "express";
import getUserService from "../services/getUser.service.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/auth/me", authMiddleware(), async (req, res) => {
  if (!req.user.id) {
    return res.status(401).json({
      success: false,
      message: "Authentication failed or user data missing.",
    });
  }

  try {
    const user = await getUserService.getUser(req.user.id);

    console.log("-------userId", req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "User data fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message,
    });
  }
});

export default router;
