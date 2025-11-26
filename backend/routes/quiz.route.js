import express from "express";
import QuizService from "../services/quiz.service.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// Create quiz (Instructor only)
router.post("/create-quiz", authMiddleware([2]), async (req, res) => {
  try {
    const instructorId = req.user.id;
    const roleIdentifier = req.user.roleIdentifier;
    const quizData = req.body;

    const quiz = await QuizService.createQuiz(
      instructorId,
      roleIdentifier,
      quizData
    );
    res.status(201).json({ success: true, data: quiz });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get quizzes for a lesson
router.get("/:lessonId", authMiddleware(), async (req, res) => {
  try {
    const userId = req.user.id;
    const roleIdentifier = req.user.roleIdentifier;
    const { lessonId } = req.params;

    const quizzes = await QuizService.getQuizzes(
      userId,
      roleIdentifier,
      lessonId
    );
    res.status(200).json({ success: true, data: quizzes });
  } catch (error) {
    res.status(403).json({ success: false, message: error.message });
  }
});

// Update quiz (Instructor only)
router.patch("/:id", authMiddleware([2]), async (req, res) => {
  try {
    const instructorId = req.user.id;
    const roleIdentifier = req.user.roleIdentifier;
    const { id } = req.params;
    const updateData = req.body;

    const updatedQuiz = await QuizService.updateQuiz(
      instructorId,
      roleIdentifier,
      id,
      updateData
    );
    res.status(200).json({ success: true, data: updatedQuiz });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete quiz (Instructor only)
router.delete("/:id", authMiddleware([2]), async (req, res) => {
  try {
    const instructorId = req.user.id;
    const roleIdentifier = req.user.roleIdentifier;
    const { id } = req.params;

    const result = await QuizService.deleteQuiz(
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
