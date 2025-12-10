import Course from "../models/course.model.js";
import Enrollment from "../models/enrollment.model.js";

class DashboardService {
  // Get all courses of the instructor
  async getInstructorCoursesCount(userId) {
    const courses = await Course.find({ user_id: userId });
    return courses.length;
  }

  // Get all learners enrolled in instructor's courses
  async getEnrolledLearnersCount(userId) {
    const courses = await Course.find({ user_id: userId });
    const courseIds = courses.map((c) => c._id);

    const learners = await Enrollment.find({
      course_id: { $in: courseIds },
    });

    return learners.length;
  }

  async getInstructorCoursesByCategory(userId) {
    // Find all courses by instructor
    const courses = await Course.find({ user_id: userId }).populate(
      "category_id"
    );

    // Count courses per category
    const counts = {};

    courses.forEach((course) => {
      const catName = course.category_id.name;
      counts[catName] = (counts[catName] || 0) + 1;
    });

    // Convert to array for frontend chart
    return Object.keys(counts).map((category) => ({
      category,
      totalCourses: counts[category],
    }));
  }
}

export default new DashboardService();
