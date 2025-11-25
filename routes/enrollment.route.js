import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import EnrollmentService from "../services/enrollment.service.js";

const router = express.Router();

// Enroll in a course
router.post("/enroll/:courseId", authMiddleware([3]), async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("User ID from request:", userId);
    const roleIdentifier = req.user.roleIdentifier;
    const courseId = req.params.courseId;
    const { amount } = req.body;

    const enrollment = await EnrollmentService.enrollCourse(
      userId,
      roleIdentifier,
      courseId,
      amount
    );

    res.status(201).json({
      success: true,
      message: "Enrollment successful",
      data: enrollment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Get users enrollments
router.get("/my-enrollments", authMiddleware([3]), async (req, res) => {
  try {
    const userId = req.user.id;
    const enrollments = await EnrollmentService.getUserEnrollments(userId);

    res.status(200).json({
      success: true,
      data: enrollments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
