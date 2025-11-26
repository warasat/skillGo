import Quiz from "../models/quiz.model.js";
import Lesson from "../models/lesson.model.js";
import Enrollment from "../models/enrollment.model.js";
import constants from "../constants/constants.js";

class QuizService {
  // Create quiz (Instructor only)
  async createQuiz(instructorId, roleIdentifier, quizData) {
    if (roleIdentifier !== constants.ROLES.INSTRUCTOR) {
      throw new Error("Only instructors can create quizzes");
    }

    const { lesson_id, title, questions } = quizData;

    if (!lesson_id || !title || !questions) {
      throw new Error("All quiz fields are required");
    }

    const lesson = await Lesson.findById(lesson_id).populate({
      path: "module_id",
      populate: { path: "course_id" },
    });

    if (!lesson) throw new Error("Lesson not found");

    if (
      lesson.module_id.course_id.user_id.toString() !== instructorId.toString()
    ) {
      throw new Error("You do not own this course/lesson");
    }

    const quiz = await Quiz.create({
      lesson_id,
      title,
      questions,
    });

    return quiz;
  }

  // Get quizzes for a lesson (Learners must be enrolled)
  async getQuizzes(userId, roleIdentifier, lessonId) {
    const lesson = await Lesson.findById(lessonId).populate({
      path: "module_id",
      populate: { path: "course_id" },
    });

    if (!lesson) throw new Error("Lesson not found");

    if (roleIdentifier === constants.ROLES.LEARNER) {
      const enrollment = await Enrollment.findOne({
        user_id: userId,
        course_id: lesson.module_id.course_id._id,
      });
      if (!enrollment) {
        throw new Error("You must be enrolled to view quizzes in this lesson");
      }
    }

    const quizzes = await Quiz.find({ lesson_id: lessonId });
    return quizzes;
  }

  // Update quiz (Instructor only)
  async updateQuiz(instructorId, roleIdentifier, quizId, updateData) {
    if (roleIdentifier !== constants.ROLES.INSTRUCTOR) {
      throw new Error("Only instructors can update quizzes");
    }

    const quiz = await Quiz.findById(quizId).populate({
      path: "lesson_id",
      populate: { path: "module_id", populate: { path: "course_id" } },
    });

    if (!quiz) throw new Error("Quiz not found");

    if (
      quiz.lesson_id.module_id.course_id.user_id.toString() !==
      instructorId.toString()
    ) {
      throw new Error("You do not own this course/lesson");
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(quizId, updateData, {
      new: true,
    });
    return updatedQuiz;
  }

  // Delete quiz (Instructor only)
  async deleteQuiz(instructorId, roleIdentifier, quizId) {
    if (roleIdentifier !== constants.ROLES.INSTRUCTOR) {
      throw new Error("Only instructors can delete quizzes");
    }

    const quiz = await Quiz.findById(quizId).populate({
      path: "lesson_id",
      populate: { path: "module_id", populate: { path: "course_id" } },
    });

    if (!quiz) throw new Error("Quiz not found");

    if (
      quiz.lesson_id.module_id.course_id.user_id.toString() !==
      instructorId.toString()
    ) {
      throw new Error("You do not own this course/lesson");
    }

    await Quiz.findByIdAndDelete(quizId);
    return { message: "Quiz deleted successfully" };
  }
}

export default new QuizService();
