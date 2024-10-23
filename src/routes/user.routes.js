import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const router = Router();

// login example
// router.route("/login").post(registerUser)
// https://localhost:8000/api/v1/users/login

// https://localhost:8000/api/v1/users/register
router.route("/register").post(registerUser)

export default router;
