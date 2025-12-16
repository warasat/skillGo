import User from "../models/user.model.js";

class AdminUserService {
  // Get all users
  async getAllUsers() {
    try {
      const users = await User.find().select("-password");
      return users;
    } catch (error) {
      throw error;
    }
  }

  // Delete a user
  async deleteUser(userId) {
    try {
      const deletedUser = await User.findByIdAndDelete(userId);
      return deletedUser;
    } catch (error) {
      throw error;
    }
  }
  // update Status of a user
  async updateUserStatus(userId, status) {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    user.status = status;
    await user.save();

    return user;
  }
  //Update role of a user
  async updateUserRole(userId, roleId) {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    user.role = roleId;
    await user.save();

    // populate for frontend readability
    const updatedUser = await User.findById(userId)
      .select("-password")
      .populate("role");

    return updatedUser;
  }
}

export default new AdminUserService();
