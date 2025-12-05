import Quiz from "../models/quiz.model.js";
import Module from "../models/module.model.js";
import Enrollment from "../models/enrollment.model.js";
import QuizAttempt from "../models/quizAttempt.model.js";
import constants from "../constants/constants.js";

class QuizAttemptService {
  //  Submit Quiz Attempt (Learner only)
  async submitAttempt(userId, roleIdentifier, quizId, answers) {
    if (roleIdentifier !== constants.ROLES.LEARNER) {
      throw new Error("Only learners can submit quiz attempts");
    }

    const quiz = await Quiz.findById(quizId).populate("module_id");
    if (!quiz) throw new Error("Quiz not found");

    // Check learner enrollment in related course
    const module = await Module.findById(quiz.module_id._id).populate(
      "course_id"
    );
    const enrollment = await Enrollment.findOne({
      user_id: userId,
      course_id: module.course_id._id,
    });

    if (!enrollment)
      throw new Error("You must be enrolled to attempt this quiz");

    // Evaluate answers
    let score = 0;
    const evaluatedAnswers = quiz.questions.map((q, index) => {
      const submitted = answers.find((a) => a.questionIndex === index);
      const isCorrect =
        submitted && submitted.selectedOptionIndex === q.correctOptionIndex;

      if (isCorrect) score++;

      return {
        question: q.question,
        selectedOptionIndex: submitted ? submitted.selectedOptionIndex : null,
        isCorrect,
      };
    });

    const totalQuestions = quiz.questions.length;

    // Save attempt
    const attempt = await QuizAttempt.create({
      user_id: userId,
      quiz_id: quizId,
      module_id: quiz.module_id._id,
      score,
      totalQuestions,
      answers: evaluatedAnswers,
    });

    return {
      message: "Quiz submitted successfully",
      score,
      totalQuestions,
      percentage: ((score / totalQuestions) * 100).toFixed(2),
      attempt,
    };
  }

  //  Get quiz attempt
  async getAttemptByQuiz(userId, quizId) {
    const attempt = await QuizAttempt.findOne({
      user_id: userId,
      quiz_id: quizId,
    }).populate("quiz_id");
    if (!attempt) throw new Error("No attempt found for this quiz");
    return attempt;
  }
}

export default new QuizAttemptService();
