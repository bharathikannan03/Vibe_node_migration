import { Router } from "express";
import {
  getAllRoleAccessDetails,
  getRoleAccessDetail,
  verifyRoleName,
  createRoleAccessModule
} from "../controller/RoleAccessController.js";
import validateRequest from "../middleware/validate-request.js";
import { validateCreateRoleAccessModule } from "../validators/role-access-validator.js";

const router = Router();

router.get("/get_all_role_access_details", getAllRoleAccessDetails);
router.get("/get_roleaccessdetials", getRoleAccessDetail);
router.post("/verify_role_name", verifyRoleName);
router.post("/create_role_access_module", validateRequest(validateCreateRoleAccessModule), createRoleAccessModule);

export default router;
