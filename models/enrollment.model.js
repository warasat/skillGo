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
    required: false,
  },
});

export default model("Enrollment", enrollmentSchema);
