import { Router } from "express";
import {
  createPolicy,
  deletePolicy,
  editPolicy,
  updatePolicy
} from "../controller/PolicyController.js";
import validateRequest from "../middleware/validate-request.js";
import { validateCreatePolicy, validateUpdatePolicy } from "../validators/policy-validator.js";

const router = Router();

router.post("/create/", validateRequest(validateCreatePolicy), createPolicy);
router.get("/edit/:id", editPolicy);
router.put("/updatepolicies/:id", validateRequest(validateUpdatePolicy), updatePolicy);
router.delete("/deletepolicies/:id", deletePolicy);

export default router;
