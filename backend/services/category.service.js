import Category from "../models/category.model.js";

class CategoriesService {
  async getCategories() {
    const categories = await Category.find();
    return categories;
  }
}
export default new CategoriesService();
