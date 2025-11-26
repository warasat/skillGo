import Enrollment from "../models/enrollment.model.js";
import Payment from "../models/payment.model.js";
import Course from "../models/course.model.js";
import constants from "../constants/constants.js";

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
    return await Enrollment.find({ user_id: userId }).populate(
      "course_id",
      "title description paidStatus"
    );
  }
}

export default new EnrollmentService();
