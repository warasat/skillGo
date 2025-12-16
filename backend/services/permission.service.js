import PermissionPolicy from "../models/permission.modal.js";

class PermissionService {
  // ✅ Create a new permission policy
  static async createPermissionPolicy(title, description, permissions) {
    if (!title || typeof title !== "string") {
      throw new Error("Permission title is required");
    }

    if (!description || typeof description !== "string") {
      throw new Error("Permission description is required");
    }

    if (!Array.isArray(permissions)) {
      throw new Error("Permissions must be an array of strings");
    }

    const sanitizedTitle = title.trim();

    // check for duplicate title
    const existing = await PermissionPolicy.findOne({ title: sanitizedTitle });
    if (existing) {
      throw new Error("A permission policy with this title already exists");
    }

    // ✅ sanitize and normalize permissions
    const sanitizedPermissions = this.#normalizePermissions(permissions);

    const policy = await PermissionPolicy.create({
      title: sanitizedTitle,
      description: description.trim(),
      permissions: sanitizedPermissions,
    });

    return policy;
  }

  // ✅ Get all permission policies
  static async getAllPolicies() {
    return PermissionPolicy.find().sort({ createdAt: -1 });
  }

  // ✅ Get single policy by ID
  static async getPolicyById(id) {
    return PermissionPolicy.findById(id);
  }

  // ✅ Update a permission policy
  static async updatePolicy(id, title, description, permissions) {
    const policy = await PermissionPolicy.findById(id);
    if (!policy) throw new Error("Permission policy not found");

    if (title && typeof title === "string") {
      policy.title = title.trim();
    }

    if (description && typeof description === "string") {
      policy.description = description.trim();
    }

    if (permissions && Array.isArray(permissions)) {
      policy.permissions = this.#normalizePermissions(permissions);
    }

    await policy.save();
    return policy;
  }

  // ✅ Delete a permission policy
  static async deletePolicy(id) {
    const deleted = await PermissionPolicy.findByIdAndDelete(id);
    if (!deleted) throw new Error("Permission policy not found");
    return deleted;
  }

  // 🧠 Private helper for permission normalization
  static #normalizePermissions(permissions) {
    // Flatten and normalize
    const flatPermissions = permissions.flatMap((perm) =>
      perm
        .split(/[,\s]+/) // split by commas or spaces
        .map((p) => p.trim())
        .filter(Boolean)
    );

    const sanitized = flatPermissions.map(
      (perm) =>
        perm
          .toLowerCase()
          .replace(/[\s_]+/g, "-") // convert space & underscore to dash
          .replace(/-+/g, "-") // remove double dashes
    );

    // Remove duplicates
    return [...new Set(sanitized)];
  }
}

export default PermissionService;
