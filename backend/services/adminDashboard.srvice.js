import User from "../models/user.model.js";
import Course from "../models/course.model.js";

class AdminService {
  async getTotalInstructors() {
    const instructors = await User.find().populate("role");
    return instructors.filter((u) => u.role?.identifier === 2).length;
  }

  async getTotalLearners() {
    const learners = await User.find().populate("role");
    return learners.filter((u) => u.role?.identifier === 3).length;
  }

  async getTotalCourses() {
    return await Course.countDocuments();
  }
  // return User counts by day
  async getUserStatsByDate(range = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - range);

    const stats = await User.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return stats.map((s) => ({ date: s._id, total: s.count }));
  }
}

export default new AdminService();
