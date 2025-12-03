import constants from "../constants/constants.js";
import Course from "../models/course.model.js";
import Module from "../models/module.model.js"; // new
import enrollmentService from "./enrollment.service.js";

class CourseService {
  // Create Course
  async createCourse(userId, roleIdentifier, courseData) {
    try {
      if (roleIdentifier != constants.ROLES.INSTRUCTOR) {
        throw new Error("Only instructors can create courses");
      }

      const { category_id, title, description, paidStatus, amount } =
        courseData;

      if (!category_id || !title || !description || paidStatus === undefined) {
        throw new Error("All course fields must be provided");
      }

      if (paidStatus && (!amount || amount <= 0)) {
        throw new Error("Amount must be greater than 0 for paid courses");
      }

      const course = await Course.create({
        user_id: userId,
        category_id,
        title,
        description,
        paidStatus,
        amount: paidStatus ? amount : 0,
      });

      return { success: true, course };
    } catch (error) {
      throw error;
    }
  }

  // Update Course
  async updateCourse(courseId, userId, roleIdentifier, updateData) {
    try {
      if (roleIdentifier !== constants.ROLES.INSTRUCTOR) {
        throw new Error("Only instructors can update courses");
      }

      const course = await Course.findOne({ _id: courseId, user_id: userId });
      if (!course) {
        throw new Error(
          "Course not found or you are not authorized to update it"
        );
      }

      if (
        updateData.paidStatus === true &&
        (!updateData.amount || updateData.amount <= 0)
      ) {
        throw new Error(
          "Amount must be greater than 0 when setting paidStatus to true"
        );
      }

      if (updateData.paidStatus === false) {
        updateData.amount = 0;
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
      if (roleIdentifier !== constants.ROLES.INSTRUCTOR) {
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

  // Get All Courses with module count
  async getAllCourses() {
    const courses = await Course.find()
      .populate("user_id", "name email")
      .populate("category_id", "name");

    const coursesWithCount = await Promise.all(
      courses.map(async (course) => {
        const moduleCount = await Module.countDocuments({
          course_id: course._id,
        });
        return { ...course.toObject(), moduleCount };
      })
    );

    return coursesWithCount;
  }

  // Get Course By ID with module count
  async getCourseById(courseId) {
    const course = await Course.findById(courseId)
      .populate("user_id", "name email")
      .populate("category_id", "name");

    if (!course) return null;

    const moduleCount = await Module.countDocuments({ course_id: course._id });
    return { ...course.toObject(), moduleCount };
  }

  // Get only Instructor_Courses with module count
  async getInstructorCourses(userId, roleIdentifier) {
    if (roleIdentifier !== constants.ROLES.INSTRUCTOR) {
      throw new Error("Only instructors can view their courses");
    }

    const courses = await Course.find({ user_id: userId })
      .populate("user_id", "name email")
      .populate("category_id", "name");

    const coursesWithCount = await Promise.all(
      courses.map(async (course) => {
        const moduleCount = await Module.countDocuments({
          course_id: course._id,
        });
        return { ...course.toObject(), moduleCount };
      })
    );

    return coursesWithCount;
  }

  // Get only courses the user has NOT enrolled in, with module count
  async getAvailableCourses(userId) {
    const enrolledIds = await enrollmentService.getEnrolledCourseIds(userId);

    const courses = await Course.find({
      _id: { $nin: enrolledIds },
    })
      .populate("user_id", "name email")
      .populate("category_id", "name");

    const coursesWithCount = await Promise.all(
      courses.map(async (course) => {
        const moduleCount = await Module.countDocuments({
          course_id: course._id,
        });
        return { ...course.toObject(), moduleCount };
      })
    );

    return coursesWithCount;
  }
}

export default new CourseService();
