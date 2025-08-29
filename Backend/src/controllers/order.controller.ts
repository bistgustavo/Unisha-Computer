import { Request, Response } from "express";
import { prisma } from "../db/index";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { OrderStatus, PaymentMethod, PaymentStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

// Create a new order from cart
const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.user_id;
  const { addressId, paymentMethod = "cash_on_delivery" } = req.body;

  if (!userId) {
    throw new ApiError(401, "Unauthorized - User not logged in");
  }

  if (!addressId) {
    throw new ApiError(400, "Address ID is required");
  }

  // Verify address belongs to user
  const address = await prisma.address.findFirst({
    where: { address_id: addressId, user_id: userId }
  });

  if (!address) {
    throw new ApiError(404, "Address not found or doesn't belong to user");
  }

  // Get user's cart with items
  const cart = await prisma.cart.findUnique({
    where: { user_id: userId },
    include: { 
      items: { 
        include: { 
          product: true 
        } 
      } 
    }
  });

  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, "Cart is empty");
  }

  // Calculate total and verify products
  let totalAmount = 0;
  const orderItemsData: { product_id: string; quantity: number; price_at_purchase: Decimal; }[] = [];
  
  for (const item of cart.items) {
    if (item.product.stock === "outOfStock" || item.product.quantity < item.quantity) {
      throw new ApiError(400, `Product ${item.product.name} is out of stock or insufficient quantity`);
    }
    
    // Use offerPrice (discounted price) if available, otherwise use regular price
    const actualPrice = item.product.offerPrice || item.product.price;
    const itemTotal = Number(actualPrice) * item.quantity;
    totalAmount += itemTotal;
    
    orderItemsData.push({
      product_id: item.product_id,
      quantity: item.quantity,
      price_at_purchase: actualPrice
    });
  }

  // Create order with transaction
  const order = await prisma.$transaction(async (tx) => {
    // Create the order
    const newOrder = await tx.order.create({
      data: {
        user_id: userId,
        address_id: addressId,
        total_amount: totalAmount,
        status: "pending",
        items: {
          create: orderItemsData
        }
      },
      include: { items: true }
    });

    // Create payment record
    await tx.payment.create({
      data: {
        order_id: newOrder.order_id,
        user_id: userId,
        amount: totalAmount,
        method: paymentMethod,
        status: "pending"
      }
    });

    // Update product quantities
    await Promise.all(
      cart.items.map(item => 
        tx.product.update({
          where: { product_id: item.product_id },
          data: { 
            quantity: { decrement: item.quantity },
            stock: item.product.quantity - item.quantity <= 0 ? "outOfStock" : "available"
          }
        })
      )
    );

    // Clear the cart
    await tx.cartItem.deleteMany({
      where: { cart_id: cart.cart_id }
    });

    return newOrder;
  });

  return res
    .status(201)
    .json(new ApiResponse(201, order, "Order created successfully"));
});

// Get order by ID
const getOrderById = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.user_id;
  const { orderId } = req.params;

  if (!orderId) {
    throw new ApiError(400, "Order ID is required");
  }

  const order = await prisma.order.findUnique({
    where: { order_id: orderId },
    include: {
      user: {
        select: {
          user_id: true,
          username: true,
          email: true,
          first_name: true,
          last_name: true
        }
      },
      address: true,
      items: {
        include: { 
          product: {
            include: { category: true }
          } 
        }
      },
      payment: true
    }
  });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // Verify order belongs to user (unless admin)
  if (order.user_id !== userId && req.user?.web_role !== "admin") {
    throw new ApiError(403, "Unauthorized to access this order");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order retrieved successfully"));
});

// Get all orders for user
const getUserOrders = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.user_id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized - User not logged in");
  }

  const orders = await prisma.order.findMany({
    where: { user_id: userId },
    include: {
      address: true,
      items: {
        include: {
          product: {
            include: { category: true }
          }
        }
      },
      payment: true
    },
    orderBy: { createdAt: "desc" }
  });

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "User orders retrieved successfully"));
});

// Admin: Get all orders
const getAllOrders = asyncHandler(async (req: Request, res: Response) => {
  if (req.user?.web_role !== "admin") {
    throw new ApiError(403, "Unauthorized - Admin access required");
  }

  const { status, page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const whereClause = status ? { status: status as OrderStatus } : {};

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            user_id: true,
            username: true,
            first_name: true,
            last_name: true
          }
        },
        address: true,
        payment: true
      },
      skip,
      take: Number(limit),
      orderBy: { createdAt: "desc" }
    }),
    prisma.order.count({ where: whereClause })
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      orders,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    }, "Orders retrieved successfully")
  );
});

// Update order status (admin only)
const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  if (req.user?.web_role !== "admin") {
    throw new ApiError(403, "Unauthorized - Admin access required");
  }

  const { orderId } = req.params;
  const { status } = req.body;

  if (!orderId || !status) {
    throw new ApiError(400, "Order ID and status are required");
  }

  if (!Object.values(OrderStatus).includes(status)) {
    throw new ApiError(400, "Invalid order status");
  }

  const order = await prisma.order.update({
    where: { order_id: orderId },
    data: { status },
    include: {
      items: {
        include: { product: true }
      },
      payment: true
    }
  });

  // If order is cancelled, update payment status and restore product quantities
  if (status === "cancelled") {
    await prisma.$transaction([
      prisma.payment.update({
        where: { order_id: orderId },
        data: { status: "refunded" }
      }),
      ...order.items.map(item => 
        prisma.product.update({
          where: { product_id: item.product_id },
          data: { 
            quantity: { increment: item.quantity },
            stock: "available"
          }
        })
      )
    ]);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order status updated successfully"));
});

export {
  createOrder,
  getOrderById,
  getUserOrders,
  getAllOrders,
  updateOrderStatus
};