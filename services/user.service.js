import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class UserService {
  // Register User
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
  // Login User
  async loginUser(email, password) {
    try {
      const user = await User.findOne({ email }).populate("role");
      if (!user) {
        throw new Error("Invalid credentials");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error("Invalid credentials");
      }

      const userResponse = user.toObject();
      delete userResponse.password;

      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          roleIdentifier: user.role.identifier,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return { userResponse, token };
    } catch (error) {
      throw error;
    }
  }
}

export default new UserService();
