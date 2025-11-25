import express from "express";
import LessonService from "../services/lesson.service.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// Create lesson (Instructor only)
router.post("/create-lesson", authMiddleware([2]), async (req, res) => {
  try {
    const instructorId = req.user.id;
    const roleIdentifier = req.user.roleIdentifier;
    const lessonData = req.body;

    const lesson = await LessonService.createLesson(
      instructorId,
      roleIdentifier,
      lessonData
    );

    res.status(201).json({ success: true, data: lesson });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get lessons for a module (Learners must be enrolled)
router.get("/:moduleId", authMiddleware(), async (req, res) => {
  try {
    const userId = req.user.id;
    const roleIdentifier = req.user.roleIdentifier;
    const { moduleId } = req.params;

    const lessons = await LessonService.getLessons(
      userId,
      roleIdentifier,
      moduleId
    );

    res.status(200).json({ success: true, data: lessons });
  } catch (error) {
    res.status(403).json({ success: false, message: error.message });
  }
});

// Update lesson (Instructor only)
router.patch("/:id", authMiddleware([2]), async (req, res) => {
  try {
    const instructorId = req.user.id;
    const roleIdentifier = req.user.roleIdentifier;
    const { id } = req.params;
    const updateData = req.body;

    const updatedLesson = await LessonService.updateLesson(
      instructorId,
      roleIdentifier,
      id,
      updateData
    );

    res.status(200).json({ success: true, data: updatedLesson });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete lesson (Instructor only)
router.delete("/:id", authMiddleware([2]), async (req, res) => {
  try {
    const instructorId = req.user.id;
    const roleIdentifier = req.user.roleIdentifier;
    const { id } = req.params;

    const result = await LessonService.deleteLesson(
      instructorId,
      roleIdentifier,
      id
    );

    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
