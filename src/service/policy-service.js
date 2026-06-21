import AppError from "../utils/app-error.js";
import {
  createPolicy,
  findPolicyById
} from "../repositories/policy-repository.js";

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

  const filteredData = {
    "id": existingPolicy.id,
    "policyNumber": existingPolicy.policyNumber,
    "policyName": existingPolicy.policyName,
    "policyType": existingPolicy.policyType,
    "premiumAmount": existingPolicy.premiumAmount,
    "coverageAmount": existingPolicy.coverageAmount,
    "startDate": existingPolicy.startDate,
    "endDate": existingPolicy.endDate,
    "holderName": existingPolicy.holderName,
    "holderEmail": existingPolicy.holderEmail,
    "status": existingPolicy.status,
    "description": existingPolicy.description
  }
  if (!existingPolicy) {
    throw new AppError("Policy not found", 404);
  }
  return filteredData;
}
