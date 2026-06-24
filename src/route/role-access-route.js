import { Router } from "express";
import {
  getAllRoleAccessDetails,
  getRoleAccessDetail,
  verifyRoleName
} from "../controller/RoleAccessController.js";

const router = Router();

router.get("/get_all_role_access_details", getAllRoleAccessDetails);
router.get("/get_roleaccessdetials", getRoleAccessDetail);
router.post("/verify_role_name", verifyRoleName);

export default router;
