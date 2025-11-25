import express from "express";
import CommentService from "../services/comment.service.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// Create comment (Learner only)
router.post("/write-comment", authMiddleware([3]), async (req, res) => {
  try {
    const userId = req.user.id;
    const roleIdentifier = req.user.roleIdentifier;
    const commentData = req.body;

    const comment = await CommentService.createComment(
      userId,
      roleIdentifier,
      commentData
    );

    res.status(201).json({
      success: true,
      message: "Comment posted successfully",
      data: comment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Get all comments for a specific review
router.get("/:reviewId", authMiddleware(), async (req, res) => {
  try {
    const { reviewId } = req.params;

    const comments = await CommentService.getCommentsByReview(reviewId);

    res.status(200).json({
      success: true,
      data: comments,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
