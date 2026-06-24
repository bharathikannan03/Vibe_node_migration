import AppError from "../utils/app-error.js";
import {
  createPolicy,
  findPolicyById,
  findPolicyByNumber,
  softDeletePolicy,
  updatePolicy
} from "../repositories/policy-repository.js";

const toPolicyResponse = (policy) => ({
  id: policy.id,
  policyNumber: policy.policyNumber,
  policyName: policy.policyName,
  policyType: policy.policyType,
  premiumAmount: policy.premiumAmount,
  coverageAmount: policy.coverageAmount,
  startDate: policy.startDate,
  endDate: policy.endDate,
  holderName: policy.holderName,
  holderEmail: policy.holderEmail,
  status: policy.status,
  description: policy.description
});

export const createPolicyService = async (policyPayload) => {
  const existingPolicy = await findPolicyByNumber(policyPayload.policyNumber);

  if (existingPolicy) {
    throw new AppError("Policy number already exists", 400, [
      { field: "policyNumber", message: "Policy number must be unique" }
    ]);
  }

  return createPolicy(policyPayload);
}

export const editPolicyService = async (policyId) => {
  const existingPolicy = await findPolicyById(policyId);

  if (!existingPolicy) {
    throw new AppError("Policy not found", 404);
  }

  return toPolicyResponse(existingPolicy);
}

export const updatePolicyService = async (policyId, updatePayload) => {
  const existingPolicy = await findPolicyById(policyId);

  if (!existingPolicy) {
    throw new AppError("Policy not found", 404);
  }

  return updatePolicy(existingPolicy.id, updatePayload);
}

export const deletePolicyService = async (policyId) => {
  const existingPolicy = await findPolicyById(policyId);

  if (!existingPolicy) {
    throw new AppError("Policy not found", 404);
  }

  await softDeletePolicy(existingPolicy.id);

  return { id: existingPolicy.id, deleted: true };
}
