import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: {
    type: [String],
    required: true,
    validate: [(val) => val.length === 4, "Must have 4 options"],
  },
  correctOptionIndex: { type: Number, required: true, min: 0, max: 3 },
});

const quizSchema = new mongoose.Schema({
  module_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Module",
    required: true,
  },
  questions: [questionSchema],
});

export default mongoose.model("Quiz", quizSchema);
