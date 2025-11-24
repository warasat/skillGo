import express from "express";
import UserService from "../services/user.service.js";

const router = express.Router();

// Register route
router.post("/register", async (req, res) => {
  try {
    const result = await UserService.registerUser(req.body);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: result,
        roleIdentifier: result.role.identifier,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await UserService.loginUser(email, password);
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: result.userResponse,
        token: result.token,
        roleIdentifier: result.userResponse.role.identifier,
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
