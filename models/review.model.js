import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const reviewSchema = new Schema({
  course_id: {
    type: Types.ObjectId,
    ref: "Course",
    required: true,
  },
  user_id: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  review: {
    type: String,
    trim: true,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model("Review", reviewSchema);
