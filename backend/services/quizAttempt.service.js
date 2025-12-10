import Quiz from "../models/quiz.model.js";
import Module from "../models/module.model.js";
import Enrollment from "../models/enrollment.model.js";
import QuizAttempt from "../models/quizAttempt.model.js";
import constants from "../constants/constants.js";

class QuizAttemptService {
  // Submit Quiz Attempt (Learner only)
  async submitAttempt(userId, roleIdentifier, quizId, answers) {
    if (roleIdentifier !== constants.ROLES.LEARNER) {
      throw new Error("Only learners can submit quiz attempts");
    }

    const quiz = await Quiz.findById(quizId).populate("module_id");
    if (!quiz) throw new Error("Quiz not found");

    // Verify enrollment
    const module = await Module.findById(quiz.module_id._id).populate(
      "course_id"
    );
    const enrollment = await Enrollment.findOne({
      user_id: userId,
      course_id: module.course_id._id,
    });

    if (!enrollment)
      throw new Error("You must be enrolled to attempt this quiz");

    // Check previous attempts (max 3)
    const previousAttempts = await QuizAttempt.find({
      user_id: userId,
      quiz_id: quizId,
    });

    if (previousAttempts.length >= 3) {
      throw new Error("Maximum 3 attempts reached for this quiz");
    }

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
    const percentage = (score / totalQuestions) * 100;
    const passStatus =
      percentage >= constants.EXAM_PASS_CRITERIA.CRITERIA
        ? constants.EXAM_PASS_STATUS.PASS
        : constants.EXAM_PASS_STATUS.FAIL;

    // Save new attempt
    const attempt = await QuizAttempt.create({
      user_id: userId,
      quiz_id: quizId,
      module_id: quiz.module_id._id,
      score,
      totalQuestions,
      answers: evaluatedAnswers,
      passStatus,
      percentage,
    });

    return {
      message: "Quiz submitted successfully",
      score,
      totalQuestions,
      percentage,
      passStatus,
      attempt,
    };
  }

  // Get all quiz attempts by this learner for a quiz
  async getAttemptByQuiz(userId, quizId) {
    const attempts = await QuizAttempt.find({
      user_id: userId,
      quiz_id: quizId,
    })

      .sort({ createdAt: -1 })
      .populate("quiz_id");

    if (!attempts.length) throw new Error("No attempts found for this quiz");
    return attempts;
  }
}

export default new QuizAttemptService();
