import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const courseSchema = new Schema({
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
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  final_exam_id: {
    type: Types.ObjectId,
    ref: "FinalExam",
    required: true,
    unique: true,
  },
});

export default model("Course", courseSchema);
