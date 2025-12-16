import RolePermission from "../models/roleManagement.model.js";

class RolePermissionService {
  // Get all roles + their assigned permissions
  static async getAllRolePermissions() {
    return RolePermission.find()
      .populate("roleId", "role") // fetch role name
      .populate("permissionIds", "title"); // fetch permission title
  }

  // Assign permissions to a role (create or update)
  static async assignPermissionsToRole(roleId, permissionIds) {
    if (!roleId) throw new Error("Role ID is required");

    // Find existing mapping
    let rolePermission = await RolePermission.findOne({ roleId });
    if (rolePermission) {
      rolePermission.permissionIds = permissionIds;
      await rolePermission.save();
    } else {
      rolePermission = await RolePermission.create({
        roleId,
        permissionIds,
      });
    }

    return rolePermission
      .populate("roleId", "role")
      .populate("permissionIds", "title");
  }

  // Get permissions of a single role
  static async getPermissionsByRole(roleId) {
    const rolePermission = await RolePermission.findOne({ roleId }).populate(
      "permissionIds",
      "title"
    );
    return rolePermission;
  }

  // Remove all permissions from a role
  static async removeAllPermissions(roleId) {
    const rolePermission = await RolePermission.findOne({ roleId });
    if (!rolePermission) throw new Error("Role not found");
    rolePermission.permissionIds = [];
    await rolePermission.save();
    return rolePermission;
  }
}

export default RolePermissionService;
