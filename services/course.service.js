import constants from "../constants/constants.js";
import Course from "../models/course.model.js";

class CourseService {
  //Create Course
  async createCourse(userId, roleIdentifier, courseData) {
    try {
      if (roleIdentifier != constants.ROLES.INSTRUCTOR) {
        throw new Error("Only instructors can create courses");
      }

      const { category_id, title, description, paidStatus } = courseData;
      if (!category_id || !title || !description || paidStatus === undefined) {
        throw new Error("All course fields must be provided");
      }

      const course = await Course.create({
        user_id: userId,
        category_id,
        title,
        description,
        paidStatus,
      });

      return { success: true, course };
    } catch (error) {
      throw error;
    }
  }
  //update Course
  async updateCourse(courseId, userId, roleIdentifier, updateData) {
    try {
      if (roleIdentifier !== 2) {
        throw new Error("Only instructors can update courses");
      }
      const course = await Course.findOne({ _id: courseId, user_id: userId });
      if (!course) {
        throw new Error(
          "Course not found or you are not authorized to update it"
        );
      }

      Object.assign(course, updateData);
      await course.save();

      return course;
    } catch (error) {
      throw error;
    }
  }
  // Delete Course
  async deleteCourse(courseId, userId, roleIdentifier) {
    try {
      if (roleIdentifier !== 2) {
        throw new Error("Only instructors can delete courses");
      }

      const deletedCourse = await Course.findOneAndDelete({
        _id: courseId,
        user_id: userId,
      });
      if (!deletedCourse) {
        throw new Error(
          "Course not found or you are not authorized to delete it"
        );
      }

      return deletedCourse;
    } catch (error) {
      throw error;
    }
  }
  // Get All Courses
  async getAllCourses() {
    return await Course.find().populate("user_id", "nameemail");
  }
  // Get Course By ID
  async getCourseById(courseId) {
    return await Course.findById(courseId).populate("user_id", "name email");
  }
}

export default new CourseService();
