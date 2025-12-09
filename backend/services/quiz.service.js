import Quiz from "../models/quiz.model.js";
import Module from "../models/module.model.js";
import Enrollment from "../models/enrollment.model.js";
import constants from "../constants/constants.js";

class QuizService {
  //  Create quiz (Instructor only)
  async createQuiz(instructorId, roleIdentifier, quizData) {
    if (roleIdentifier !== constants.ROLES.INSTRUCTOR) {
      throw new Error("Only instructors can create quizzes");
    }

    const { module_id, questions } = quizData;

    if (!module_id || !questions || questions.length === 0) {
      throw new Error("Module ID and at least one question are required");
    }

    const module = await Module.findById(module_id).populate({
      path: "course_id",
      select: "user_id",
    });

    if (!module) throw new Error("Module not found");

    if (module.course_id.user_id.toString() !== instructorId.toString()) {
      throw new Error("You do not own this course/module");
    }

    //  Check if quiz already exists for this module (optional)
    const existingQuiz = await Quiz.findOne({ module_id });
    if (existingQuiz) {
      throw new Error("Quiz already exists for this module");
    }

    const quiz = await Quiz.create({
      module_id,
      questions,
    });

    return quiz;
  }

  // Get quiz by module (Instructor OR Learner)
  async getQuizByModule(userId, roleIdentifier, moduleId) {
    const module = await Module.findById(moduleId).populate({
      path: "course_id",
      select: "_id user_id",
    });

    if (!module) throw new Error("Module not found");

    // Instructor case
    if (Number(roleIdentifier) === constants.ROLES.INSTRUCTOR) {
      // Check if instructor owns this module
      if (module.course_id.user_id.toString() !== userId.toString()) {
        throw new Error("You do not own this course/module");
      }

      // Instructor can see all quizzes related to this module
      const quizzes = await Quiz.find({ module_id: moduleId });
      return quizzes;
    }

    // Learner case
    if (Number(roleIdentifier) === constants.ROLES.LEARNER) {
      const enrollment = await Enrollment.findOne({
        user_id: userId,
        course_id: module.course_id._id,
      });
      if (!enrollment) {
        throw new Error("You must be enrolled to view this quiz");
      }

      const quizzes = await Quiz.find({ module_id: moduleId });
      return quizzes;
    }

    // Fallback (for other roles)
    const quizzes = await Quiz.find({ module_id: moduleId });
    return quizzes;
  }

  //  Update quiz (Instructor only)
  async updateQuiz(instructorId, roleIdentifier, quizId, updateData) {
    if (roleIdentifier !== constants.ROLES.INSTRUCTOR) {
      throw new Error("Only instructors can update quizzes");
    }

    const quiz = await Quiz.findById(quizId).populate({
      path: "module_id",
      populate: { path: "course_id", select: "user_id" },
    });

    if (!quiz) throw new Error("Quiz not found");

    if (
      quiz.module_id.course_id.user_id.toString() !== instructorId.toString()
    ) {
      throw new Error("You do not own this course/module");
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(quizId, updateData, {
      new: true,
    });

    return updatedQuiz;
  }

  //  Delete quiz (Instructor only)
  async deleteQuiz(instructorId, roleIdentifier, quizId) {
    if (roleIdentifier !== constants.ROLES.INSTRUCTOR) {
      throw new Error("Only instructors can delete quizzes");
    }

    const quiz = await Quiz.findById(quizId).populate({
      path: "module_id",
      populate: { path: "course_id", select: "user_id" },
    });

    if (!quiz) throw new Error("Quiz not found");

    if (
      quiz.module_id.course_id.user_id.toString() !== instructorId.toString()
    ) {
      throw new Error("You do not own this course/module");
    }

    await Quiz.findByIdAndDelete(quizId);
    return { message: "Quiz deleted successfully" };
  }
}

export default new QuizService();
