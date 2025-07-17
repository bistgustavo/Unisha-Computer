import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response, NextFunction } from "express";
import { prisma } from "../db/index";

const setAddress = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { street, city, state, postal_code, country } = req.body;
    const userId = req.user?.user_id;

    if (!city || !state || !postal_code || !country) {
      throw new ApiError(400, "All address fields are required");
    }

    if (!userId) {
      throw new ApiError(401, "User not authenticated");
    }

    const address = await prisma.address.create({
      data: {
        street: street || "",
        city,
        state,
        postal_code,
        country,
        user_id: userId,
      },
    });

    if (!address) {
      throw new ApiError(500, "Failed to set address");
    }

    res
      .status(201)
      .json(new ApiResponse(201, { address }, "Address set successfully"));
  }
);

// Get ALL addresses for the logged-in user
const getUserAddress = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.user_id; // Ensure `user` is in `Request` type

  if (!userId) {
    throw new ApiError(401, "User not authenticated");
  }

  // Fetch ALL addresses (not just the first one)
  const addresses = await prisma.address.findMany({
    where: { user_id: userId },
  });

  if (!addresses || addresses.length === 0) {
    throw new ApiError(404, "No addresses found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, { addresses }, "Addresses retrieved successfully")
    );
});

export { setAddress, getUserAddress };
