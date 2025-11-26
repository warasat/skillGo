import mongoose from "mongoose";

const { Schema, model } = mongoose;

const instructorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  bio: {
    type: String,
  },
});

export default model("Instructor", instructorSchema);
