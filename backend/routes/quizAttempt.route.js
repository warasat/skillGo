import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import QuizAttemptService from "../services/quizAttempt.service.js";

const router = express.Router();

router.post("/submit", authMiddleware([3]), async (req, res) => {
  try {
    const userId = req.user.id;
    const roleIdentifier = req.user.roleIdentifier;
    const { quiz_id, answers } = req.body;

    const result = await QuizAttemptService.submitAttempt(
      userId,
      roleIdentifier,
      quiz_id,
      answers
    );

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get("/:quizId", authMiddleware([3]), async (req, res) => {
  try {
    const userId = req.user.id;
    const { quizId } = req.params;
    const attempt = await QuizAttemptService.getAttemptByQuiz(userId, quizId);
    res.status(200).json({ success: true, data: attempt });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
});

export default router;
