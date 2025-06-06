import { Prisma } from "@prisma/client";
import { ApiError } from "../utils/ApiError";
import { NextFunction, Request, Response } from "express";

const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err as
    | ApiError
    | Prisma.PrismaClientKnownRequestError
    | { statusCode?: number };

  if (!(error instanceof ApiError)) {
    const statusCode =
      "statusCode" in error && error.statusCode
        ? error.statusCode
        : error instanceof Prisma.PrismaClientKnownRequestError
        ? 400
        : 500;

    const message =
      "message" in error && error.message
        ? error.message
        : "Internal Server Error";

    error = new ApiError(
      statusCode,
      message,
      "errors" in error ? error.errors : [],
      "stack" in error ? error.stack : undefined
    );
  }

  const response = {
    ...error,
    message: (error as ApiError).message,
    ...(process.env.NODE_ENV === "development" &&
      error instanceof ApiError && {
        stack: error.stack,
      }),
  };

  return res.status(error.statusCode || 500).json(response);
};

export { errorHandler };
