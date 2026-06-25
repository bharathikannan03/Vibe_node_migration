import { Router } from "express";
import {
  createPolicyEM,
  getEMSelectUsers,
  deleteEMUser
} from "../controller/PolicyEscalationController.js";
import validateRequest from "../middleware/validate-request.js";
import { validateCreatePolicyEM } from "../validators/policy-escalation-validator.js";

const router = Router();

router.post("/policy_create_EM", validateRequest(validateCreatePolicyEM), createPolicyEM);
router.get("/get_EM_select_user", getEMSelectUsers);
router.delete("/delete_EM_user/:EMuserId", deleteEMUser);

export default router;