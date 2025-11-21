import mongoose from "mongoose";

const { Schema, model } = mongoose;

const categorySchema = new Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
});

export default model("Category", categorySchema);
