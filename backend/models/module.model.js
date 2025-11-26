import mongoose from "mongoose";

const { Schema, model } = mongoose;

const moduleSchema = new Schema({
  course_id: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});

export default model("Module", moduleSchema);
