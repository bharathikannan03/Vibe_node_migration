const POLICY_STATUSES = ["active", "inactive", "expired", "cancelled"];

const requiredString = (payload, field, label, maxLength, errors) => {
  const value = payload[field];

  if (typeof value !== "string" || value.trim() === "") {
    errors.push({ field, message: `${label} is required` });
    return null;
  }

  const trimmedValue = value.trim();

  if (trimmedValue.length > maxLength) {
    errors.push({ field, message: `${label} must be ${maxLength} characters or less` });
  }

  return trimmedValue;
};

const optionalString = (payload, field, label, maxLength, errors) => {
  const value = payload[field];

  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    errors.push({ field, message: `${label} must be a string` });
    return null;
  }

  const trimmedValue = value.trim();

  if (trimmedValue.length > maxLength) {
    errors.push({ field, message: `${label} must be ${maxLength} characters or less` });
  }

  return trimmedValue;
};

const requiredAmount = (payload, field, label, errors) => {
  const value = Number(payload[field]);

  if (!Number.isFinite(value) || value < 0) {
    errors.push({ field, message: `${label} must be a non-negative number` });
    return null;
  }

  return Number(value.toFixed(2));
};

const requiredDate = (payload, field, label, errors) => {
  const value = payload[field];
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;

  if (typeof value !== "string" || !datePattern.test(value)) {
    errors.push({ field, message: `${label} must be in YYYY-MM-DD format` });
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    Number.isNaN(date.getTime()) ||
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    errors.push({ field, message: `${label} must be a valid date` });
    return null;
  }

  return value;
};

const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validateCreatePolicy = (payload) => {
  const errors = [];
  const value = {};

  value.policyNumber = requiredString(payload, "policyNumber", "Policy number", 50, errors);
  value.policyName = requiredString(payload, "policyName", "Policy name", 150, errors);
  value.policyType = requiredString(payload, "policyType", "Policy type", 100, errors);
  value.premiumAmount = requiredAmount(payload, "premiumAmount", "Premium amount", errors);
  value.coverageAmount = requiredAmount(payload, "coverageAmount", "Coverage amount", errors);
  value.startDate = requiredDate(payload, "startDate", "Start date", errors);
  value.endDate = requiredDate(payload, "endDate", "End date", errors);
  value.holderName = requiredString(payload, "holderName", "Holder name", 150, errors);
  value.holderEmail = optionalString(payload, "holderEmail", "Holder email", 150, errors);
  value.description = optionalString(payload, "description", "Description", 1000, errors);
  value.status = optionalString(payload, "status", "Status", 20, errors) || "active";

  if (value.holderEmail && !validateEmail(value.holderEmail)) {
    errors.push({ field: "holderEmail", message: "Holder email must be valid" });
  }

  if (!POLICY_STATUSES.includes(value.status)) {
    errors.push({
      field: "status",
      message: `Status must be one of: ${POLICY_STATUSES.join(", ")}`
    });
  }

  if (value.startDate && value.endDate && new Date(value.endDate) < new Date(value.startDate)) {
    errors.push({ field: "endDate", message: "End date must be on or after start date" });
  }

  return { value, errors };
};

export const validateUpdatePolicy = (payload) => {
  const errors = [];
  const value = {};

  value.policyType = optionalString(payload, "policyType", "Policy type", 100, errors);
  value.startDate = requiredDate(payload, "startDate", "Start date", errors);
  value.endDate = requiredDate(payload, "endDate", "End date", errors);
  value.holderName = optionalString(payload, "holderName", "Holder name", 150, errors);
  value.holderEmail = optionalString(payload, "holderEmail", "Holder email", 150, errors);
  value.status = optionalString(payload, "status", "Status", 20, errors);

  if (value.holderEmail && !validateEmail(value.holderEmail)) {
    errors.push({ field: "holderEmail", message: "Holder email must be valid" });
  }

  if (value.status && !POLICY_STATUSES.includes(value.status)) {
    errors.push({
      field: "status",
      message: `Status must be one of: ${POLICY_STATUSES.join(", ")}`
    });
  }

  if (value.startDate && value.endDate && new Date(value.endDate) < new Date(value.startDate)) {
    errors.push({ field: "endDate", message: "End date must be on or after start date" });
  }

  return { value, errors };
};
