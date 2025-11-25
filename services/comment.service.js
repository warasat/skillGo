import Comment from "../models/comment.model.js";
import Review from "../models/review.model.js";
import constants from "../constants/constants.js";

class CommentService {
  // Learner posts a comment on a review
  async createComment(userId, roleIdentifier, commentData) {
    if (roleIdentifier !== constants.ROLES.LEARNER) {
      throw new Error("Only learners can comment on reviews");
    }

    const { review_id, comment } = commentData;
    if (!review_id || !comment) {
      throw new Error("Review ID and comment text are required");
    }

    const review = await Review.findById(review_id);
    if (!review) {
      throw new Error("Review not found");
    }

    const newComment = await Comment.create({
      review_id,
      user_id: userId,
      comment,
    });

    return newComment;
  }

  // Get all comments for a specific review
  async getCommentsByReview(reviewId) {
    const comments = await Comment.find({ review_id: reviewId })
      .populate("user_id", "name email")
      .sort({ createdAt: -1 });

    return comments;
  }
}

export default new CommentService();
