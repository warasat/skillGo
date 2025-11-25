import mongoose from "mongoose";

const { Schema, model } = mongoose;

const quizSchema = new Schema({
  lesson_id: {
    type: Types.ObjectId,
    ref: "Lesson",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  questions: {
    type: [String],
    required: true,
  },
});

export default model("Quiz", quizSchema);
