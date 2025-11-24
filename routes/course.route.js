import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import CourseService from "../services/course.service.js";

const router = express.Router();
// Create Course route
router.post("/create-course", authMiddleware([2]), async (req, res) => {
  try {
    const userId = req.user.id;
    const roleIdentifier = req.user.roleIdentifier;
    const courseData = req.body;

    const result = await CourseService.createCourse(
      userId,
      roleIdentifier,
      courseData
    );
    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: result.course,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});
// Update Course route
router.patch("/:id", authMiddleware([2]), async (req, res) => {
  try {
    const userId = req.user.id;
    const roleIdentifier = req.user.roleIdentifier;
    const courseId = req.params.id;
    const updateData = req.body;

    const updatedCourse = await CourseService.updateCourse(
      courseId,
      userId,
      roleIdentifier,
      updateData
    );

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    res.status(403).json({
      success: false,
      message: error.message,
    });
  }
});
// Delete Course route
router.delete("/:id", authMiddleware([2]), async (req, res) => {
  try {
    const userId = req.user.id;
    const roleIdentifier = req.user.roleIdentifier;
    const courseId = req.params.id;

    const deletedCourse = await CourseService.deleteCourse(
      courseId,
      userId,
      roleIdentifier
    );

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
      data: deletedCourse,
    });
  } catch (error) {
    res.status(403).json({
      success: false,
      message: error.message,
    });
  }
});
// Get All Courses route
router.get("/get-course", authMiddleware(), async (req, res) => {
  try {
    const courses = await CourseService.getAllCourses();
    res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
// Get Course by ID route
router.get("/:id", authMiddleware(), async (req, res) => {
  try {
    const course = await CourseService.getCourseById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
