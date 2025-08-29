import { Request, Response } from "express";
import { prisma } from "../db/index";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { PaymentStatus, PaymentMethod } from "@prisma/client";

// Helper function to validate payment status
const isValidPaymentStatus = (status: any): status is PaymentStatus => {
  return Object.values(PaymentStatus).includes(status);
};

// Helper function to validate payment method
const isValidPaymentMethod = (method: any): method is PaymentMethod => {
  return Object.values(PaymentMethod).includes(method);
};

// Update payment status
const updatePaymentStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { paymentId } = req.params;
    const { status, transactionId } = req.body;

    if (!paymentId || !status) {
      throw new ApiError(400, "Payment ID and status are required");
    }

    // Validate the status against the enum
    if (!isValidPaymentStatus(status)) {
      throw new ApiError(400, "Invalid payment status");
    }

    const payment = await prisma.payment.findUnique({
      where: { payment_id: paymentId },
      include: { order: true },
    });

    if (!payment) {
      throw new ApiError(404, "Payment not found");
    }

    // Authorization check
    if (
      payment.user_id !== req.user?.user_id &&
      req.user?.web_role !== "admin"
    ) {
      throw new ApiError(403, "Unauthorized to update this payment");
    }

    const updatedPayment = await prisma.payment.update({
      where: { payment_id: paymentId },
      data: {
        status,
        transaction_id: transactionId || undefined,
      },
    });

    if (status === "completed") {
      await prisma.order.update({
        where: { order_id: payment.order_id },
        data: { status: "processing" },
      });
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedPayment,
          "Payment status updated successfully"
        )
      );
  }
);

// Get payment by ID
const getPaymentById = asyncHandler(async (req: Request, res: Response) => {
  const { paymentId } = req.params;

  if (!paymentId) {
    throw new ApiError(400, "Payment ID is required");
  }

  const payment = await prisma.payment.findUnique({
    where: { payment_id: paymentId },
    include: {
      order: {
        include: {
          items: true,
        },
      },
      user: {
        select: {
          user_id: true,
          username: true,
          first_name: true,
          last_name: true,
        },
      },
    },
  });

  if (!payment) {
    throw new ApiError(404, "Payment not found");
  }

  // Verify user owns the payment or is admin
  if (payment.user_id !== req.user?.user_id && req.user?.web_role !== "admin") {
    throw new ApiError(403, "Unauthorized to access this payment");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, payment, "Payment retrieved successfully"));
});

// Get payments for user
const getUserPayments = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.user_id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized - User not logged in");
  }

  const payments = await prisma.payment.findMany({
    where: { user_id: userId },
    include: {
      order: {
        select: {
          order_id: true,
          status: true,
          total_amount: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, payments, "User payments retrieved successfully")
    );
});

// Admin: Get all payments
const getAllPayments = asyncHandler(async (req: Request, res: Response) => {
  if (req.user?.web_role !== "admin") {
    throw new ApiError(403, "Unauthorized - Admin access required");
  }

  const { status, method, page = 1, limit = 10 } = req.query;

  // Validate status if provided
  if (status && !isValidPaymentStatus(status)) {
    throw new ApiError(400, "Invalid payment status");
  }

  // Validate method if provided
  if (method && !isValidPaymentMethod(method)) {
    throw new ApiError(400, "Invalid payment method");
  }

  // Build where clause with proper typing
  const whereClause: {
    status?: PaymentStatus;
    method?: PaymentMethod;
  } = {};

  if (status) whereClause.status = status as PaymentStatus;
  if (method) whereClause.method = method as PaymentMethod;

  const skip = (Number(page) - 1) * Number(limit);

  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            user_id: true,
            username: true,
            first_name: true,
            last_name: true,
          },
        },
        order: {
          select: {
            order_id: true,
            status: true,
          },
        },
      },
      skip,
      take: Number(limit),
      orderBy: { createdAt: "desc" },
    }),
    prisma.payment.count({ where: whereClause }),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        payments,
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
      "Payments retrieved successfully"
    )
  );
});

export { updatePaymentStatus, getPaymentById, getUserPayments, getAllPayments };
