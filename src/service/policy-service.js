import AppError from "../utils/app-error.js";
import {
  createPolicy,
  findPolicyByNumber
} from "../repositories/policy-repository.js";

export const createPolicyService = async (policyPayload) => {
  const existingPolicy = await findPolicyByNumber(policyPayload.policyNumber);

  if (existingPolicy) {
    throw new AppError("Policy number already exists", 409, [
      { field: "policyNumber", message: "Policy number must be unique" }
    ]);
  }

  return createPolicy(policyPayload);
};
