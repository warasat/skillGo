import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import DashboardService from "../services/dashboard.service.js";

const router = express.Router();

// Only instructors can access
router.get("/courses-count", authMiddleware([2]), async (req, res) => {
  try {
    const instructorId = req.user.id;
    const count = await DashboardService.getInstructorCoursesCount(
      instructorId
    );
    res.status(200).json({ success: true, data: count });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get("/learners-count", authMiddleware([2]), async (req, res) => {
  try {
    const instructorId = req.user.id;
    const count = await DashboardService.getEnrolledLearnersCount(instructorId);
    res.status(200).json({ success: true, data: count });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get("/courses-by-category", authMiddleware([2]), async (req, res) => {
  try {
    const instructorId = req.user.id;
    const data = await DashboardService.getInstructorCoursesByCategory(
      instructorId
    );
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
router.get("/top-categories", authMiddleware([2]), async (req, res) => {
  try {
    const range = parseInt(req.query.range) || 30;
    const data = await DashboardService.getTopCategoriesByEnrollments(range);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error fetching top categories:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});
router.get("/earnings", authMiddleware([2]), async (req, res) => {
  try {
    const userId = req.user.id;
    const earnings = await DashboardService.getInstructorEarnings(userId);

    res.status(200).json({
      success: true,
      data: earnings,
    });
  } catch (err) {
    console.error("Error fetching earnings:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch earnings" });
  }
});

export default router;
