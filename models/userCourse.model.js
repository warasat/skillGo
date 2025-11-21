import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const userCourseSchema = new Schema({
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
  status: {
    type: String,
    enum: ["enrolled", "completed", "dropped"],
    default: "enrolled",
    required: true,
  },
});

export default model("UserCourse", userCourseSchema);
