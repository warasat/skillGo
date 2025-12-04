import Enrollment from "../models/enrollment.model.js";
import Payment from "../models/payment.model.js";
import Course from "../models/course.model.js";
import constants from "../constants/constants.js";
import { mongoose } from "mongoose";

class EnrollmentService {
  async enrollCourse(userId, roleIdentifier, courseId, amount = 0) {
    if (roleIdentifier !== constants.ROLES.LEARNER) {
      throw new Error("Only learners can enroll in courses");
    }

    const course = await Course.findById(courseId);
    if (!course) throw new Error("Course not found");

    const existingEnrollment = await Enrollment.findOne({
      user_id: userId,
      course_id: courseId,
    });
    if (existingEnrollment)
      throw new Error("User already enrolled in this course");

    let paymentId = null;

    if (course.paidStatus) {
      const payment = await Payment.create({
        user_id: userId,
        course_id: courseId,
        amount,
        status: "completed",
      });
      paymentId = payment._id;
    }

    const enrollment = await Enrollment.create({
      user_id: userId,
      course_id: courseId,
      payment_id: paymentId,
      status: "enrolled",
    });

    return enrollment;
  }

  async getUserEnrollments(userId) {
    const enrollments = await Enrollment.find({ user_id: userId }).populate({
      path: "course_id",
      populate: [
        { path: "category_id", select: "name" },
        { path: "user_id", select: "name" },
      ],
    });

    if (!enrollments.length) {
      throw new Error("No enrollments found for this user");
    }

    return enrollments;
  }
  // Get array of course IDs the user is enrolled in

  async getEnrolledCourseIds(userId) {
    if (!userId) {
      console.log("No userId provided!");
      return [];
    }

    const uid = new mongoose.Types.ObjectId(userId);

    const enrollments = await Enrollment.find({ user_id: uid }).select(
      "course_id"
    );

    return enrollments.map((e) => e.course_id);
  }
}

export default new EnrollmentService();
