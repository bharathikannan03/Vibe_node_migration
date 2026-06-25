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

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validateLogin = (payload = {}) => {
  const errors = [];
  const value = {};

  const identifier = payload.identifier ?? payload.email ?? payload.username;

  value.identifier = requiredString(
    { identifier },
    "identifier",
    "Email or username",
    150,
    errors
  );
  value.password = requiredString(payload, "password", "Password", 255, errors);

  if (payload.email !== undefined && value.identifier && !validateEmail(value.identifier)) {
    errors.push({ field: "email", message: "Email must be valid" });
  }

  return { value, errors };
};

export const validateRefreshToken = (payload = {}) => {
  const errors = [];
  const value = {};

  value.refreshToken = requiredString(payload, "refreshToken", "Refresh token", 4096, errors);

  return { value, errors };
};
