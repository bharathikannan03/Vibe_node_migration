import jwt from "jsonwebtoken";
import AppError from "../utils/app-error.js";

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw new AppError("Authentication token is required", 401);
    }

    if (!process.env.JWT_SECRET) {
      throw new AppError("JWT secret is not configured", 500);
    }

    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return next(new AppError("Invalid or expired authentication token", 401));
    }

    return next(error);
  }
};

export default authenticate;
