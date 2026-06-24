import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findUserForLogin } from "../repositories/auth-repository.js";
import AppError from "../utils/app-error.js";

const normalizeBcryptHash = (passwordHash) => {
  if (typeof passwordHash !== "string") {
    return "";
  }

  if (passwordHash.startsWith("$2y$")) {
    return `$2a$${passwordHash.slice(4)}`;
  }

  return passwordHash;
};

const toUserResponse = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  username: user.username,
  roleId: user.roleId
});

export const loginService = async ({ identifier, password }) => {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "1d";

  if (!jwtSecret) {
    throw new AppError("JWT secret is not configured", 500);
  }

  const user = await findUserForLogin(identifier);
  const passwordMatches = user
    ? await bcrypt.compare(password, normalizeBcryptHash(user.passwordHash))
    : false;

  if (!user || !passwordMatches) {
    throw new AppError("Invalid login credentials", 401);
  }

  const tokenPayload = {
    sub: String(user.id),
    userId: user.id,
    email: user.email,
    username: user.username,
    roleId: user.roleId
  };

  const token = jwt.sign(tokenPayload, jwtSecret, { expiresIn: jwtExpiresIn });

  return {
    token,
    tokenType: "Bearer",
    expiresIn: jwtExpiresIn,
  };
};
