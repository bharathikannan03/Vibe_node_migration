import {
  createPolicyService,
  deletePolicyService,
  editPolicyService,
  updatePolicyService
} from "../service/policy-service.js";
import { sendSuccess } from "../utils/api-response.js";

export const createPolicy = async (req, res, next) => {
  try {
    const policy = await createPolicyService(req.body);

    return sendSuccess(res, 201, "Policy created successfully", policy);
  } catch (error) {
    return next(error);
  }
}

export const editPolicy = async (req, res, next) => {
  try {
    const policy = await editPolicyService(req.params.id);

    return sendSuccess(res, 200, "Policy fetched successfully", policy);
  } catch (error) {
    return next(error);
  }
}

export const updatePolicy = async (req, res, next) => {
  try {
    const policy = await updatePolicyService(req.params.id, req.body);

    return sendSuccess(res, 200, "Policy updated successfully", policy);
  } catch (error) {
    return next(error);
  }
}

export const deletePolicy = async (req, res, next) => {
  try {
    const policy = await deletePolicyService(req.params.id);

    return sendSuccess(res, 200, "Policy deleted successfully", policy);
  } catch (error) {
    return next(error);
  }
}
