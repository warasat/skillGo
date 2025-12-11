import express from "express";
import AdminService from "../services/adminDashboard.srvice.js";

const router = express.Router();

router.get("/dashboard-stats", async (req, res) => {
  try {
    const totalInstructors = await AdminService.getTotalInstructors();
    const totalLearners = await AdminService.getTotalLearners();
    const totalCourses = await AdminService.getTotalCourses();

    res.status(200).json({
      success: true,
      data: { totalInstructors, totalLearners, totalCourses },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.get("/user-stats", async (req, res) => {
  try {
    const stats = await AdminService.getUserStatsByDate(30);
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

export default router;
