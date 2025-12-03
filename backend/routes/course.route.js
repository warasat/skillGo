import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import CourseService from "../services/course.service.js";
import Module from "../models/module.model.js";

const router = express.Router();

// Create Course
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
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update Course
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

    // Get updated moduleCount
    const courseWithCount = await CourseService.getCourseById(courseId);

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: courseWithCount,
    });
  } catch (error) {
    res.status(403).json({ success: false, message: error.message });
  }
});

// Delete Course
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
    res.status(403).json({ success: false, message: error.message });
  }
});

// Get All Courses with moduleCount
router.get("/get-course", authMiddleware(), async (req, res) => {
  try {
    const courses = await CourseService.getAllCourses();
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get Instructor's Courses with moduleCount
router.get("/instructor-courses", authMiddleware([2]), async (req, res) => {
  try {
    const userId = req.user.id;
    const roleIdentifier = req.user.roleIdentifier;

    const courses = await CourseService.getInstructorCourses(
      userId,
      roleIdentifier
    );

    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(403).json({ success: false, message: error.message });
  }
});

// Get Available Courses (user not enrolled), with moduleCount
router.get("/available", authMiddleware(), async (req, res) => {
  try {
    const userId = req.user.id;
    const courses = await CourseService.getAvailableCourses(userId);
    res.status(200).json({ success: true, data: courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get Course by ID, with moduleCount
router.get("/:id", authMiddleware(), async (req, res) => {
  try {
    const course = await CourseService.getCourseById(req.params.id);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get full course details with related modules
router.get("/details/:courseId", authMiddleware(), async (req, res) => {
  try {
    const courseId = req.params.courseId;

    // Fetch the course by ID
    const course = await CourseService.getCourseById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Fetch related modules
    const modules = await Module.find({ course_id: courseId });

    res.status(200).json({
      success: true,
      data: {
        course,
        modules,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
