import { Request, Response } from "express";
import { prisma } from "../db/index";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";

// Get order items for an order
const getOrderItems = asyncHandler(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const userId = req.user?.user_id;

  if (!orderId) {
    throw new ApiError(400, "Order ID is required");
  }

  // Verify order exists and belongs to user (unless admin)
  const order = await prisma.order.findUnique({
    where: { order_id: orderId },
    select: { user_id: true }
  });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.user_id !== userId && req.user?.web_role !== "admin") {
    throw new ApiError(403, "Unauthorized to access these order items");
  }

  const orderItems = await prisma.orderItem.findMany({
    where: { order_id: orderId },
    include: {
      product: {
        include: { category: true }
      }
    }
  });

  return res
    .status(200)
    .json(new ApiResponse(200, orderItems, "Order items retrieved successfully"));
});

export {
  getOrderItems
};