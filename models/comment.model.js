import mongoose from "mongoose";

const { Schema, model } = mongoose;

const commentSchema = new Schema({
  review_id: {
    type: Schema.Types.ObjectId,
    ref: "Review",
    required: true,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
});

export default model("Comment", commentSchema);
