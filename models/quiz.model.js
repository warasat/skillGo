import mongoose from "mongoose";

const { Schema, model } = mongoose;

const quizSchema = new Schema({
  lesson_id: {
    type: Schema.Types.ObjectId,
    ref: "Lesson",
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  questions: [
    {
      type: String,
      required: true,
      trim: true,
    },
  ],
});

export default model("Quiz", quizSchema);
