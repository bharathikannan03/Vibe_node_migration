import { Router } from "express";
import { login } from "../controller/AuthController.js";
import validateRequest from "../middleware/validate-request.js";
import { validateLogin } from "../validators/auth-validator.js";

const router = Router();

router.post("/login", validateRequest(validateLogin), login);

export default router;
