import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const courseSchema = new Schema({
  user_id: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  category_id: {
    type: Types.ObjectId,
    ref: "Category",
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  paidStatus: {
    type: Boolean,
    required: true,
    default: false,
  },
  amount: {
    type: Number,
    validate: {
      validator: function (value) {
        if (this.paidStatus) {
          return value != null && value > 0;
        }

        return value == null || value === 0;
      },
      message: "Amount must be greater than 0 when paidStatus is true.",
    },
  },
  // final_exam_id: {
  //   type: Types.ObjectId,
  //   ref: "FinalExam",
  //   unique: true,
  //   required: false,
  // },
});

export default model("Course", courseSchema);
