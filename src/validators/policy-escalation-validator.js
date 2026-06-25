export const validateCreatePolicyEM = (payload) => {
  const errors = [];
  const value = {};

  if (payload.policy_id !== undefined && payload.policy_id !== null) {
    value.policyId = Number(payload.policy_id);
    if (!Number.isFinite(value.policyId)) {
      errors.push({ field: "policy_id", message: "Policy ID must be a number" });
    }
  } else {
    errors.push({ field: "policy_id", message: "Policy ID is required" });
    value.policyId = null;
  }

  if (!payload.em_level || !Array.isArray(payload.em_level) || payload.em_level.length === 0) {
    errors.push({ field: "em_level", message: "EM level is required and must be a non-empty array" });
    value.em_level = [];
  } else {
    value.em_level = payload.em_level.map((em, index) => {
      const validated = {};

      if (!em.level_id || typeof em.level_id !== "number") {
        errors.push({ field: `em_level[${index}].level_id`, message: "Level ID is required and must be a number" });
        validated.level_id = null;
      } else {
        validated.level_id = em.level_id;
      }

      if (!em.level || typeof em.level !== "string" || em.level.trim() === "") {
        errors.push({ field: `em_level[${index}].level`, message: "Level is required and must be a string" });
        validated.level = null;
      } else {
        validated.level = em.level.trim();
      }

      if (!em.user_id || typeof em.user_id !== "number") {
        errors.push({ field: `em_level[${index}].user_id`, message: "User ID is required and must be a number" });
        validated.user_id = null;
      } else {
        validated.user_id = em.user_id;
      }

      if (!em.user_fullname || typeof em.user_fullname !== "string" || em.user_fullname.trim() === "") {
        errors.push({ field: `em_level[${index}].user_fullname`, message: "User fullname is required and must be a string" });
        validated.user_fullname = null;
      } else {
        validated.user_fullname = em.user_fullname.trim();
      }

      return validated;
    });
  }

  return { value, errors };
};