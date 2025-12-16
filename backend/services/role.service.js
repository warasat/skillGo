import Role from "../models/role.model.js";

class RoleService {
  // Create role
  static async createRole(roleName) {
    if (!roleName || typeof roleName !== "string") {
      throw new Error("Role name is required");
    }

    // sanitize roleName
    const sanitizedRole = roleName.trim().toLowerCase().replace(/\s+/g, "-");

    // get last identifier
    const lastRole = await Role.findOne().sort({ identifier: -1 });
    const newIdentifier = lastRole ? lastRole.identifier + 1 : 1;

    //  create role
    const role = await Role.create({
      identifier: newIdentifier,
      role: sanitizedRole,
    });

    return role;
  }

  // Optional: get all roles
  static async getAllRoles() {
    return Role.find().sort({ identifier: 1 });
  }
}

export default RoleService;
