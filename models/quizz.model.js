import mongoose from "mongoose";

const { Schema, model } = mongoose;

const quizSchema = new Schema({
  module_id: {
    type: Schema.Types.ObjectId,
    ref: "Module",
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
