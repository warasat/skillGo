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

export default router;
