import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const courseSchema = new Schema({
  user_id: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  category_id: {
    type: Types.ObjectId,
    ref: "Category",
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  paidStatus: {
    type: Boolean,
    required: true,
    default: false,
  },
  // final_exam_id: {
  //   type: Types.ObjectId,
  //   ref: "FinalExam",
  //   unique: true,
  //   required: false,
  // },
});

export default model("Course", courseSchema);
