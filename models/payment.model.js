import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const paymentSchema = new Schema({
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
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  paidAt: {
    type: Date,
    default: Date.now,
  },
});

export default model("Payment", paymentSchema);
