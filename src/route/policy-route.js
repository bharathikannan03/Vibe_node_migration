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

router.post("/", validateRequest(validateCreatePolicy), createPolicy);
router.get("/:id", editPolicy);
router.put("/:id", validateRequest(validateUpdatePolicy), updatePolicy);
router.delete("/:id", deletePolicy);

export default router;
