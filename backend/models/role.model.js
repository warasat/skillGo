import mongoose from "mongoose";

const { Schema, model } = mongoose;

const roleSchema = new Schema({
  identifier: {
    type: Number,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["admin", "instructor", "learner"],
  },
});

export default model("Role", roleSchema);
