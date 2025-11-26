import mongoose from "mongoose";

const { Schema, model } = mongoose;

const finalExamSchema = new Schema({
  course_id: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  marks: {
    type: Number,
    required: true,
  },
});

export default model("FinalExam", finalExamSchema);
