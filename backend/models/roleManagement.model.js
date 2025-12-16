import mongoose from "mongoose";
const { Schema, model } = mongoose;

const rolePermissionSchema = new Schema(
  {
    roleId: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
      unique: true,
    },
    permissionIds: [{ type: Schema.Types.ObjectId, ref: "PermissionPolicy" }],
  },
  { timestamps: true }
);

export default model("RolePermission", rolePermissionSchema);
