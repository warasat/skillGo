import Review from "../models/review.model.js";
import Enrollment from "../models/enrollment.model.js";
import constants from "../constants/constants.js";

class ReviewService {
  // Learner posts a review
  async createReview(userId, roleIdentifier, reviewData) {
    if (roleIdentifier !== constants.ROLES.LEARNER) {
      throw new Error("Only learners can post reviews");
    }

    const { course_id, rating, review } = reviewData;
    if (!course_id || !rating || !review) {
      throw new Error("All fields are required");
    }

    const enrollment = await Enrollment.findOne({
      user_id: userId,
      course_id,
    });
    if (!enrollment) {
      throw new Error("You must be enrolled in this course to post a review");
    }

    const newReview = await Review.create({
      course_id,
      user_id: userId,
      rating,
      review,
    });

    return newReview;
  }

  // Instructor or learner views reviews for a course
  async getReviewsByCourse(courseId) {
    const reviews = await Review.find({ course_id: courseId })
      .populate("user_id", "name email")
      .sort({ createdAt: -1 });

    return reviews;
  }
}

export default new ReviewService();
