import Lesson from "../models/lesson.model.js";
import Module from "../models/module.model.js";
import Course from "../models/course.model.js";
import Enrollment from "../models/enrollment.model.js";
import constants from "../constants/constants.js";

class LessonService {
  // Create a lesson (Instructor only)
  async createLesson(instructorId, roleIdentifier, lessonData) {
    if (roleIdentifier !== constants.ROLES.INSTRUCTOR) {
      throw new Error("Only instructors can create lessons");
    }

    const { module_id, title, content } = lessonData;

    if (!module_id || !title || !content) {
      throw new Error("All lesson fields are required");
    }

    const module = await Module.findById(module_id).populate("course_id");
    if (!module) throw new Error("Module not found");

    if (!module.course_id.user_id) {
      throw new Error("Course has no instructor assigned");
    }

    if (module.course_id.user_id.toString() !== instructorId.toString()) {
      throw new Error("You are not the owner of this course");
    }

    const lesson = await Lesson.create({
      module_id,
      title,
      content,
    });

    return lesson;
  }

  // Get lessons for a module (Learners or instructors)
  async getLessons(userId, roleIdentifier, moduleId) {
    const module = await Module.findById(moduleId).populate("course_id");
    if (!module) throw new Error("Module not found");

    // Learners must be enrolled
    if (roleIdentifier === constants.ROLES.LEARNER) {
      const enrollment = await Enrollment.findOne({
        user_id: userId,
        course_id: module.course_id._id,
      });
      if (!enrollment) {
        throw new Error("You must be enrolled to view lessons in this module");
      }
    }

    const lessons = await Lesson.find({ module_id: moduleId });
    return lessons;
  }

  // Update lesson (Instructor only)
  async updateLesson(instructorId, roleIdentifier, lessonId, updateData) {
    if (roleIdentifier !== constants.ROLES.INSTRUCTOR) {
      throw new Error("Only instructors can update lessons");
    }

    const lesson = await Lesson.findById(lessonId).populate({
      path: "module_id",
      populate: { path: "course_id" },
    });
    if (!lesson) throw new Error("Lesson not found");

    if (
      !lesson.module_id.course_id.user_id ||
      lesson.module_id.course_id.user_id.toString() !== instructorId.toString()
    ) {
      throw new Error("You do not own this course/module");
    }

    const updatedLesson = await Lesson.findByIdAndUpdate(lessonId, updateData, {
      new: true,
    });

    return updatedLesson;
  }

  // Delete lesson (Instructor only)
  async deleteLesson(instructorId, roleIdentifier, lessonId) {
    if (roleIdentifier !== constants.ROLES.INSTRUCTOR) {
      throw new Error("Only instructors can delete lessons");
    }

    const lesson = await Lesson.findById(lessonId).populate({
      path: "module_id",
      populate: { path: "course_id" },
    });
    if (!lesson) throw new Error("Lesson not found");

    if (
      !lesson.module_id.course_id.user_id ||
      lesson.module_id.course_id.user_id.toString() !== instructorId.toString()
    ) {
      throw new Error("You do not own this course/module");
    }

    await Lesson.findByIdAndDelete(lessonId);

    return { message: "Lesson deleted successfully" };
  }
}

export default new LessonService();
