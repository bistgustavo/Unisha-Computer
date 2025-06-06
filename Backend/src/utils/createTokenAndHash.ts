import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { jwtSecret, jwtExpiryIn } from "../secrets";
import { Response } from "express";




export const generateToken = (userId: string): string => {
  if (!jwtSecret) {
    throw new Error("JWT secret is not defined");
  }
  return jwt.sign({ userId }, jwtSecret, {
    expiresIn: "30d",
  });
};

export const setTokenCookie = (res: Response, token: string): void => {
  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    path: "/",
  });
};

export const verifyToken = (token: string): { userId: string } => {
  if (!jwtSecret) {
    throw new Error("JWT secret is not defined");
  }
  return jwt.verify(token, jwtSecret) as { userId: string };
};

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};
