import { loginService, refreshAccessTokenService } from "../service/auth-service.js";
import { sendSuccess } from "../utils/api-response.js";

export const login = async (req, res, next) => {
  try {
    const authData = await loginService(req.body);

    return sendSuccess(res, 200, "Login successful", authData);
  } catch (error) {
    return next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const authData = await refreshAccessTokenService(req.body);

    return sendSuccess(res, 200, "Token refreshed successfully", authData);
  } catch (error) {
    return next(error);
  }
};
