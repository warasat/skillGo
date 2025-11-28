import express from "express";
import categoryService from "../services/category.service.js";

const router = express.Router();

router.get("/get-category", async (req, res) => {
  try {
    const categories = await categoryService.getCategories();
    res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
export default router;
