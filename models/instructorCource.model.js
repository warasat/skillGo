import mongoose from "mongoose";

const { Schema, model } = mongoose;

const instructorCourseSchema = new Schema({
  instructor_id: {
    type: Schema.Types.ObjectId,
    ref: "Instructor",
    required: true,
  },
  course_id: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
});

export default model("InstructorCourse", instructorCourseSchema);
