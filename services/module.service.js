import Module from "../models/module.model.js";
import Course from "../models/course.model.js";
import constants from "../constants/constants.js";

class ModuleService {
  async createModule(instructorId, roleIdentifier, moduleData) {
    if (roleIdentifier !== constants.ROLES.INSTRUCTOR) {
      throw new Error("Only instructors can create modules");
    }

    const { course_id, title, description } = moduleData;

    const course = await Course.findById(course_id);
    if (!course) throw new Error("Course not found");

    if (course.user_id.toString() !== instructorId.toString()) {
      throw new Error("You are not the owner of this course");
    }

    const module = await Module.create({
      course_id,
      title,
      description,
    });

    return module;
  }

  // Get all modules for a specific course
  async getModulesByCourse(courseId) {
    const modules = await Module.find({ course_id: courseId });
    if (!modules.length) throw new Error("No modules found for this course");
    return modules;
  }

  // Update a module
  async updateModule(instructorId, roleIdentifier, moduleId, updateData) {
    if (roleIdentifier !== constants.ROLES.INSTRUCTOR) {
      throw new Error("Only instructors can update modules");
    }

    const module = await Module.findById(moduleId).populate("course_id");
    if (!module) throw new Error("Module not found");

    if (module.course_id.user_id.toString() !== instructorId.toString()) {
      throw new Error("You do not own this course");
    }

    const updatedModule = await Module.findByIdAndUpdate(moduleId, updateData, {
      new: true,
    });

    return updatedModule;
  }

  // Delete module
  async deleteModule(instructorId, roleIdentifier, moduleId) {
    if (roleIdentifier !== constants.ROLES.INSTRUCTOR) {
      throw new Error("Only instructors can delete modules");
    }

    const module = await Module.findById(moduleId).populate("course_id");
    if (!module) throw new Error("Module not found");

    if (module.course_id.user_id.toString() !== instructorId.toString()) {
      throw new Error("You do not own this course");
    }

    await Module.findByIdAndDelete(moduleId);

    return { message: "Module deleted successfully" };
  }
}

export default new ModuleService();
