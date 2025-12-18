import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import RolePermission from "../models/roleManagement.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class UserService {
  // Register User (no change needed)
  async registerUser(userData) {
    try {
      const { name, email, password, role } = userData;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const roleDoc = await Role.findOne({ identifier: role });
      if (!roleDoc) {
        throw new Error("Invalid role provided");
      }

      const user = new User({
        name,
        email,
        password: hashedPassword,
        role: roleDoc._id,
      });

      await user.save();

      const userResponse = user.toObject();
      delete userResponse.password;

      userResponse.role = roleDoc;

      return userResponse;
    } catch (error) {
      throw error;
    }
  }

  // Login User (updated to include permissions)
  async loginUser(email, password) {
    try {
      // 1️⃣ Find user + populate role
      const user = await User.findOne({ email }).populate("role");
      if (!user) throw new Error("Invalid credentials");

      // 2️⃣ Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) throw new Error("Invalid credentials");

      // 3️⃣ Check account status
      if (user.status === "inactive") {
        throw new Error("Your account is deactivated. Contact admin.");
      }

      // 4️⃣ Get permissions for user's role
      const rolePermissions = await RolePermission.findOne({
        roleId: user.role._id,
      }).populate("permissionIds", "permissions");

      // Flatten permissions from multiple permissionIds
      const allPermissions = rolePermissions
        ? rolePermissions.permissionIds.flatMap((p) => p.permissions)
        : [];

      // 5️⃣ Generate JWT
      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          roleIdentifier: user.role.identifier,
          roleUpdatedAt: user.roleUpdatedAt,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // 6️⃣ Prepare user response (remove password, add permissions)
      const userResponse = user.toObject();
      delete userResponse.password;

      userResponse.role = user.role;
      userResponse.permissions = allPermissions;

      return { userResponse, token };
    } catch (error) {
      throw error;
    }
  }
}

export default new UserService();
