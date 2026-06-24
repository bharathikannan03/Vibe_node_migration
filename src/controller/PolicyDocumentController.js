import {
  getPolicyDocumentsService,
  uploadPolicyDocumentService,
  deletePolicyDocumentService
} from "../service/policy-document-service.js";

export const getPolicyDocuments = async (req, res, next) => {
  try {
    const policyId = Number(req.params.policyId);

    if (!Number.isFinite(policyId)) {
      return res.status(400).json({ message: "Invalid policy ID" });
    }

    const result = await getPolicyDocumentsService(policyId);

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

export const uploadPolicyDocument = async (req, res, next) => {
  try {
    const userId = req.user?.id || 1;

    const result = await uploadPolicyDocumentService(req.body, userId);

    return res.status(200).json(result);
  } catch (error) {
    if (error.statusCode === 400 || error.statusCode === 404) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return next(error);
  }
};

export const deletePolicyDocument = async (req, res, next) => {
  try {
    const userId = req.user?.id || 1;
    const docId = Number(req.params.id);

    if (!Number.isFinite(docId)) {
      return res.status(400).json({ message: "Invalid document ID" });
    }

    const result = await deletePolicyDocumentService(docId, userId);

    return res.status(200).json(result);
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({ message: error.message });
    }
    return next(error);
  }
};