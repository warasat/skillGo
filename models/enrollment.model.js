import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const enrollmentSchema = new Schema({
  user_id: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  course_id: {
    type: Types.ObjectId,
    ref: "Course",
    required: true,
  },
  payment_id: {
    type: Types.ObjectId,
    ref: "Payment",
    default: null,
  },
  status: {
    type: String,
    enum: ["enrolled", "completed", "dropped"],
    default: "enrolled",
  },
  enrolledAt: {
    type: Date,
    default: Date.now,
  },
});

export default model("Enrollment", enrollmentSchema);
