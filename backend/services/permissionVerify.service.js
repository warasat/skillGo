import User from "../models/user.model.js";
import RolePermission from "../models/roleManagement.model.js";

class PermissionVerifyService {
  static async verifyPermission(userId, permissionToCheck) {
    const user = await User.findById(userId).populate("role");
    if (!user) throw new Error("User not found");

    const rolePerm = await RolePermission.findOne({
      roleId: user.role._id,
    }).populate("permissionIds", "permissions");

    const allPermissions = rolePerm
      ? rolePerm.permissionIds.flatMap((p) => p.permissions)
      : [];

    const isAllowed = allPermissions.includes(permissionToCheck);

    return isAllowed;
  }
}

export default PermissionVerifyService;
