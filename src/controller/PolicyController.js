import { createPolicyService, editPolicyService } from "../service/policy-service.js";
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
