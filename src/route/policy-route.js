import { Router } from "express";
import { createPolicy, editPolicy } from "../controller/PolicyController.js";
import validateRequest from "../middleware/validate-request.js";
import { validateCreatePolicy } from "../validators/policy-validator.js";

const router = Router();

router.post("/", validateRequest(validateCreatePolicy), createPolicy);
router.get("/:id", editPolicy);

export default router;
