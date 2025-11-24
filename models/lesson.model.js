import mongoose from "mongoose";

const { Schema, model } = mongoose;

const lessonSchema = new Schema({
  module_id: {
    type: Schema.Types.ObjectId,
    ref: "Module",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

export default model("Lesson", lessonSchema);
