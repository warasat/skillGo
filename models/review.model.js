import mongoose from "mongoose";

const { Schema, model } = mongoose;

const reviewSchema = new Schema({
  course_id: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
});

export default model("Review", reviewSchema);
