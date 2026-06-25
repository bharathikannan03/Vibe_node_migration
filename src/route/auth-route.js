import { Router } from "express";
import { login, refreshToken } from "../controller/AuthController.js";
import validateRequest from "../middleware/validate-request.js";
import { validateLogin, validateRefreshToken } from "../validators/auth-validator.js";

const router = Router();

router.post("/login", validateRequest(validateLogin), login);
router.post("/refresh-token", validateRequest(validateRefreshToken), refreshToken);

export default router;
