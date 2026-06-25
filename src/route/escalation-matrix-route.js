import { Router } from "express";
import {
  getAllEscalationMatrix,
  getEscalationMatrixById,
  storeEscalationMatrix,
  deleteEscalationMatrix
} from "../controller/EscalationMatrixController.js";
import validateRequest from "../middleware/validate-request.js";
import { validateStoreEscalationMatrix } from "../validators/escalation-matrix-validator.js";

const router = Router();

router.get("/get_all_escalation_matrix", getAllEscalationMatrix);
router.get("/get_escalation_matrix/:id", getEscalationMatrixById);
router.post("/create_escalation_matrix/:id?", validateRequest(validateStoreEscalationMatrix), storeEscalationMatrix);
router.delete("/delete_escalation_matrix/:id", deleteEscalationMatrix);

export default router;