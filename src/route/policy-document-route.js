import { Router } from "express";
import {
  getPolicyDocuments,
  uploadPolicyDocument,
  deletePolicyDocument
} from "../controller/PolicyDocumentController.js";
import validateRequest from "../middleware/validate-request.js";
import { validateUploadPolicyDocument } from "../validators/policy-document-validator.js";

const router = Router();

router.get("/get_policy_documents_data/:policyId", getPolicyDocuments);
router.post("/policy_document_upload", validateRequest(validateUploadPolicyDocument), uploadPolicyDocument);
router.delete("/delete_policy_document/:id", deletePolicyDocument);

export default router;