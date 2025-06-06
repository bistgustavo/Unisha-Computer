// middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/createTokenAndHash";
import { ApiError } from "../utils/ApiError";
import { prisma } from "../db/index";

export const verifyJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decoded = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { user_id: decoded.userId },
      select: {
        user_id: true,
        username: true,
        email: true,
        first_name: true,
        last_name: true,
        profile_url: true,
        web_role: true,
        phone: true,
        address: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    // Check if the token matches the one in database
    const dbUser = await prisma.user.findUnique({
      where: { user_id: decoded.userId },
      select: { accessToken: true },
    });

    if (dbUser?.accessToken !== token) {
      throw new ApiError(401, "Token expired or invalid");
    }

    req.user = user;
    next(); // Properly call next() to continue to the next middleware/route
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        statusCode: error.statusCode,
        message: error.message,
      });
      return;
    }
    next(error); // Pass other errors to Express error handler
  }
};
