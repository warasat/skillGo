import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  question: { type: String, required: true },
  selectedOptionIndex: { type: Number, required: false },
  isCorrect: { type: Boolean, required: false },
});

const quizAttemptSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  quiz_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
  },
  module_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Module",
    required: true,
  },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  answers: [answerSchema],
  submittedAt: { type: Date, default: Date.now },
});

export default mongoose.model("QuizAttempt", quizAttemptSchema);
