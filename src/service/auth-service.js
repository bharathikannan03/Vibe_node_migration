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

const getJwtConfig = () => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new AppError("JWT secret is not configured", 500);
  }

  return {
    accessSecret: jwtSecret,
    accessExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
    refreshSecret: process.env.JWT_REFRESH_SECRET || jwtSecret,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d"
  };
};

const getUserId = (user) => user.id ?? user.userId ?? user.sub;

const createAccessPayload = (user) => ({
  sub: String(getUserId(user)),
  userId: getUserId(user),
  email: user.email,
  username: user.username,
  roleId: user.roleId,
  tokenType: "access"
});

const createRefreshPayload = (user) => ({
  sub: String(getUserId(user)),
  userId: getUserId(user),
  email: user.email,
  username: user.username,
  roleId: user.roleId,
  tokenType: "refresh"
});

export const loginService = async ({ identifier, password }) => {
  const jwtConfig = getJwtConfig();

  const user = await findUserForLogin(identifier);
  const passwordMatches = user
    ? await bcrypt.compare(password, normalizeBcryptHash(user.passwordHash))
    : false;

  if (!user || !passwordMatches) {
    throw new AppError("Invalid login credentials", 401);
  }

  const token = jwt.sign(createAccessPayload(user), jwtConfig.accessSecret, {
    expiresIn: jwtConfig.accessExpiresIn
  });
  const refreshToken = jwt.sign(createRefreshPayload(user), jwtConfig.refreshSecret, {
    expiresIn: jwtConfig.refreshExpiresIn
  });

  return {
    token,
    tokenType: "Bearer",
    expiresIn: jwtConfig.accessExpiresIn,
    refreshToken,
    refreshTokenType: "Bearer",
    refreshTokenExpiresIn: jwtConfig.refreshExpiresIn,
  };
};

export const refreshAccessTokenService = async ({ refreshToken }) => {
  const jwtConfig = getJwtConfig();

  try {
    const decodedToken = jwt.verify(refreshToken, jwtConfig.refreshSecret);

    if (decodedToken.tokenType !== "refresh") {
      throw new AppError("Invalid refresh token", 401);
    }

    const token = jwt.sign(createAccessPayload(decodedToken), jwtConfig.accessSecret, {
      expiresIn: jwtConfig.accessExpiresIn
    });

    return {
      token,
      tokenType: "Bearer",
      expiresIn: jwtConfig.accessExpiresIn
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      throw new AppError("Invalid or expired refresh token", 401);
    }

    throw error;
  }
};
