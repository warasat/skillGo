import User from "../models/user.model.js";

class GetUserService {
  async getUser(userId) {
    const getUser = await User.findById(userId);
    return getUser;
  }
}

export default new GetUserService();
