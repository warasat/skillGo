import express from "express";
import QuizService from "../services/quiz.service.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

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

router.get("/module/:moduleId", authMiddleware(), async (req, res) => {
  try {
    const userId = req.user.id;
    const roleIdentifier = req.user.roleIdentifier;
    const { moduleId } = req.params;

    const quiz = await QuizService.getQuizByModule(
      userId,
      roleIdentifier,
      moduleId
    );

    res.status(200).json({ success: true, data: quiz });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
});

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
