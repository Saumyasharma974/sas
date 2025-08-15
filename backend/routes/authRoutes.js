import express from "express";




import { registerSchema, loginSchema } from "../validators/authValidators.js";
import { login, register } from "../controller/userController.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
;

const router = express.Router();

// Generate JWT


// Register
router.post(
  "/register",
  validate(registerSchema),
register
);

// Login
router.post(
  "/login",
  validate(loginSchema),
  login
);

// Logout
router.post(
  "/logout",
  asyncHandler(async (req, res) => {
    res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
    res.json({ message: "Logged out successfully" });
  })
);

export default router;
