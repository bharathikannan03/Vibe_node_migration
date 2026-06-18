import AppError from "../utils/app-error.js";

const validateRequest = (validator) => {
  return (req, res, next) => {
    const { value, errors } = validator(req.body);

    if (errors.length > 0) {
      return next(new AppError("Validation failed", 400, errors));
    }

    req.body = value;
    return next();
  };
};

export default validateRequest;
