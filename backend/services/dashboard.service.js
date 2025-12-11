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
  async getTopCategoriesByEnrollments(range = 30) {
    // Calculate starting date (filter for last X days)
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - range);

    // Get enrollments within the given time range
    const enrollments = await Enrollment.find({
      enrolledAt: { $gte: startDate },
    }).populate({
      path: "course_id",
      populate: { path: "category_id" },
    });

    const counts = {};

    enrollments.forEach((enroll) => {
      if (enroll.course_id && enroll.course_id.category_id) {
        const catName = enroll.course_id.category_id.name;
        counts[catName] = (counts[catName] || 0) + 1;
      }
    });

    let categoryArray = Object.keys(counts).map((category) => ({
      category,
      totalEnrollments: counts[category],
    }));

    categoryArray.sort((a, b) => b.totalEnrollments - a.totalEnrollments);

    return categoryArray.slice(0, 3);
  }
  async getInstructorEarnings(userId) {
    //  Get all paid courses for this instructor
    const courses = await Course.find({ user_id: userId, paidStatus: true });

    if (!courses.length) return 0;

    //  Map course IDs to their prices
    const coursePriceMap = {};
    const courseIds = [];
    courses.forEach((course) => {
      courseIds.push(course._id);
      coursePriceMap[course._id.toString()] = course.amount;
    });

    const enrollments = await Enrollment.find({
      course_id: { $in: courseIds },
    });

    let totalEarnings = 0;
    enrollments.forEach((enroll) => {
      const price = coursePriceMap[enroll.course_id.toString()] || 0;
      totalEarnings += price;
    });

    return totalEarnings;
  }
}

export default new DashboardService();
