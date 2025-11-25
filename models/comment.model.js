import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const commentSchema = new Schema({
  review_id: {
    type: Types.ObjectId,
    ref: "Review",
    required: true,
  },
  user_id: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  comment: {
    type: String,
    trim: true,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model("Comment", commentSchema);
