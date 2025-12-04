import express from "express";
import ModuleService from "../services/module.service.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

//  Create a new module
router.post("/create-module", authMiddleware([2]), async (req, res) => {
  try {
    const instructorId = req.user.id;
    const roleIdentifier = req.user.roleIdentifier;
    const moduleData = req.body;

    const module = await ModuleService.createModule(
      instructorId,
      roleIdentifier,
      moduleData
    );

    res.status(201).json({
      success: true,
      message: "Module created successfully",
      data: module,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Get a single module by its ID
router.get("/module/:id", authMiddleware(), async (req, res) => {
  try {
    const { id } = req.params;
    const module = await ModuleService.getModuleById(id);

    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    res.status(200).json({
      success: true,
      data: module,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
//  Get modules for a specific course
router.get("/:courseId", authMiddleware(), async (req, res) => {
  try {
    const { courseId } = req.params;
    const modules = await ModuleService.getModulesByCourse(courseId);

    res.status(200).json({
      success: true,
      data: modules,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
});

// Update a module
router.patch("/:id", authMiddleware([2]), async (req, res) => {
  try {
    const instructorId = req.user.id;
    const roleIdentifier = req.user.roleIdentifier;
    const { id } = req.params;
    const updateData = req.body;

    const updatedModule = await ModuleService.updateModule(
      instructorId,
      roleIdentifier,
      id,
      updateData
    );

    res.status(200).json({
      success: true,
      message: "Module updated successfully",
      data: updatedModule,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Delete a module
router.delete("/:id", authMiddleware([2]), async (req, res) => {
  try {
    const instructorId = req.user.id;
    const roleIdentifier = req.user.roleIdentifier;
    const { id } = req.params;

    const result = await ModuleService.deleteModule(
      instructorId,
      roleIdentifier,
      id
    );

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
