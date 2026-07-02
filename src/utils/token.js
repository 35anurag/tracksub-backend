import jwt from "jsonwebtoken";
import crypto from "crypto";
import { UserModel } from "../models/Users.js";
import {RefreshTokenModel} from "../models/RefreshToken.js"

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "15m";
const REFRESH_TOKEN_DAYS = process.env.REFRESH_TOKEN_DAYS;

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  );
};

const generateRefreshToken = async (userId) => {
  const token = crypto.randomBytes(64).toString("hex");
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_DAYS);

  await RefreshTokenModel.create({
    data: { token, userId, expiresAt },
  });

  return token;
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

export {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
};
