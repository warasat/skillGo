import express from "express";
import ReviewService from "../services/review.service.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// Learner posts a review
router.post("/post-review", authMiddleware([3]), async (req, res) => {
  try {
    const userId = req.user.id;
    const roleIdentifier = req.user.roleIdentifier;
    const reviewData = req.body;

    const review = await ReviewService.createReview(
      userId,
      roleIdentifier,
      reviewData
    );

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get all reviews for a course (instructor or learner)
router.get("/:courseId", authMiddleware(), async (req, res) => {
  try {
    const { courseId } = req.params;

    const reviews = await ReviewService.getReviewsByCourse(courseId);

    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
