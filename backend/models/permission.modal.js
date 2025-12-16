import mongoose from "mongoose";
const { Schema, model } = mongoose;

const permissionSchema = new Schema(
  {
    title: {
      type: String,
      required: true,

      trim: true,
    },
    description: {
      type: String,

      trim: true,
    },
    permissions: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default model("PermissionPolicy", permissionSchema);
