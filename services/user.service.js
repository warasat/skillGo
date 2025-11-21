import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class UserService {
  async registerUser(userData) {
    try {
      const { name, email, password, role } = userData;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        name,
        email,
        password: hashedPassword,
        role: role || "user",
      });

      await user.save();

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      return userResponse;
    } catch (error) {
      throw error;
    }
  }

  async loginUser(email, password) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("Invalid credentials");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error("Invalid credentials");
      }

      const userResponse = user.toObject();
      delete userResponse.password;
      userResponse.role = user.role;

      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          role: user.role,
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
