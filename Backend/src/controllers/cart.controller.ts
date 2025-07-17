import { Request, Response } from "express";
import { prisma } from "../db/index";
import { Prisma } from "@prisma/client";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { randomUUID } from "crypto";

// Get or create cart controller
const getOrCreateCart = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.user_id;
  let guestId = req.cookies?.guestId;

  try {
    let cart = null;

    // Step 1: If user is logged in, try to get their cart
    if (userId) {
      cart = await prisma.cart.findUnique({
        where: { user_id: userId },
        include: { items: { include: { product: { include: { category: true } } } } },
      });
    }

    // Step 2: If not logged in, try guest cart
    if (!cart && guestId) {
      cart = await prisma.cart.findUnique({
        where: { guestId },
        include: { items: { include: { product: { include: { category: true } } } } },
      });
    }

    // Step 3: If cart exists, return it
    if (cart) {
      return res.status(200).json(new ApiResponse(200, cart));
    }

    // Step 4: If no cart found, create one
    const createData: any = {
      items: { create: [] },
    };

    if (userId) {
      createData.user_id = userId;
    } else {
      // Use existing guestId from middleware or create new one
      if (!guestId) {
        guestId = randomUUID();
        // Set cookie for guest
        res.cookie("guestId", guestId, {
          httpOnly: true,
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
        });
      }
      createData.guestId = guestId;
    }

    // Create and return new cart
    try {
      const newCart = await prisma.cart.create({
        data: createData,
        include: { items: { include: { product: { include: { category: true } } } } },
      });
      return res.status(200).json(new ApiResponse(200, newCart));
    } catch (error: any) {
      // Handle unique constraint error for guestId
      if (
        error.code === "P2002" &&
        error.meta?.target?.includes("guestId")
      ) {
        const existingCart = await prisma.cart.findUnique({
          where: { guestId: createData.guestId },
          include: { items: { include: { product: { include: { category: true } } } } },
        });
        return res.status(200).json(new ApiResponse(200, existingCart));
      }
      // Otherwise, rethrow
      console.error("Cart creation error:", error);
      throw new ApiError(
        500,
        typeof error === "string"
          ? error
          : error instanceof Error
          ? error.message
          : "Failed to get or create cart"
      );
    }
  } catch (error) {
    console.error("Cart creation error:", error);
    throw new ApiError(
      500,
      typeof error === "string"
        ? error
        : error instanceof Error
        ? error.message
        : "Failed to get or create cart"
    );
  }
});

// Add item to cart
const addItemToCart = asyncHandler(async (req: Request, res: Response) => {
  const { cartId, productId, quantity = 1 } = req.body;

  if (!cartId || !productId) {
    throw new ApiError(400, "cartId and productId are required");
  }

  // Verify product exists
  const product = await prisma.product.findUnique({
    where: { product_id: productId },
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Check for existing item
  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cart_id: cartId,
      product_id: productId,
    },
  });

  if (existingItem) {
    // Update quantity
    await prisma.cartItem.update({
      where: { cart_item_id: existingItem.cart_item_id },
      data: { quantity },
    });
  } else {
    // Create new item
    await prisma.cartItem.create({
      data: {
        cart_id: cartId,
        product_id: productId,
        quantity,
      },
    });
  }

  // Return updated cart
  const updatedCart = await prisma.cart.findUniqueOrThrow({
    where: { cart_id: cartId },
    include: { items: { include: { product: { include: { category: true } } } } },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedCart, "Item added to cart"));
});

// Remove item from cart
const removeItemFromCart = asyncHandler(async (req: Request, res: Response) => {
  const { cartId, cartItemId } = req.params;

  if (!cartId || !cartItemId) {
    throw new ApiError(400, "cartId and cartItemId are required");
  }

  const cartItem = await prisma.cartItem.findFirst({
    where: {
      cart_item_id: cartItemId,
    },
  });

  if (!cartItem || typeof cartItem.quantity !== "number") {
    throw new ApiError(404, "Cart item not found or quantity is undefined");
  }

  if (cartItem.quantity === 1) {
    await prisma.cartItem.delete({
      where: { cart_item_id: cartItemId },
    });
  } else {
    await prisma.cartItem.update({
      where: { cart_item_id: cartItemId },
      data: { quantity: cartItem.quantity - 1 },
    });
  }

  // Return updated cart
  const updatedCart = await prisma.cart.findUniqueOrThrow({
    where: { cart_id: cartId },
    include: { items: { include: { product: { include: { category: true } } } } },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedCart, "Item removed from cart"));
});

// Merge guest cart with user cart
const mergeCarts = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.user_id;
  const guestId = req.cookies?.guestId;

  if (!userId) {
    throw new ApiError(400, "userId is required");
  }

  // If no guest ID, just return/create user cart
  if (!guestId) {
    let userCart = await prisma.cart.findUnique({
      where: { user_id: userId },
      include: { items: { include: { product: { include: { category: true } } } } },
    });
    
    if (!userCart) {
      userCart = await prisma.cart.create({
        data: {
          user_id: userId,
        },
        include: { items: { include: { product: { include: { category: true } } } } },
      });
    }
    
    return res
      .status(200)
      .json(new ApiResponse(200, userCart, "User cart retrieved/created successfully"));
  }

  const guestCart = await prisma.cart.findUnique({
    where: { guestId },
    include: { items: true },
  });

  // If no guest cart, just return/create user cart
  if (!guestCart) {
    let userCart = await prisma.cart.findUnique({
      where: { user_id: userId },
      include: { items: { include: { product: { include: { category: true } } } } },
    });
    
    if (!userCart) {
      userCart = await prisma.cart.create({
        data: {
          user_id: userId,
        },
        include: { items: { include: { product: { include: { category: true } } } } },
      });
    }
    
    return res
      .status(200)
      .json(new ApiResponse(200, userCart, "User cart retrieved/created successfully"));
  }

  let userCart = await prisma.cart.findUnique({
    where: { user_id: userId },
    include: { items: true },
  });

  if (!userCart) {
    userCart = await prisma.cart.create({
      data: {
        user_id: userId,
        guestId: null,
      },
      include: {
        items: true,
      },
    });
  }

  const mergedCart = await prisma.$transaction(async (tx) => {
    for (const item of guestCart.items) {
      const existingItem = userCart.items.find(
        (userItem) => userItem.product_id === item.product_id
      );

      if (existingItem) {
        await tx.cartItem.update({
          where: { cart_item_id: existingItem.cart_item_id },
          data: {
            quantity: existingItem.quantity + item.quantity,
          },
        });
      } else {
        await tx.cartItem.create({
          data: {
            cart_id: userCart.cart_id,
            product_id: item.product_id,
            quantity: item.quantity,
          },
        });
      }
    }

    await tx.cartItem.deleteMany({
      where: { cart_id: guestCart.cart_id },
    });

    await tx.cart.delete({
      where: { cart_id: guestCart.cart_id },
    });

    return await tx.cart.findUnique({
      where: { cart_id: userCart.cart_id },
      include: { items: { include: { product: { include: { category: true } } } } },
    });
  });
  res.clearCookie("guestId", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return res
    .status(200)
    .json(new ApiResponse(200, mergedCart, "Carts merged successfully"));
});

// Get current user's cart (for authenticated users)
const getCurrentUserCart = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.user_id;
  const guestId = req.cookies?.guestId;

  console.log("🔍 getCurrentUserCart - userId:", userId);
  console.log("🔍 getCurrentUserCart - guestId:", guestId);

  if (!userId && !guestId) {
    throw new ApiError(400, "User ID or guest ID is required");
  }

  let cart = null;

  // If user is authenticated, ONLY get their user cart (not guest cart)
  if (userId) {
    console.log("🔍 Looking for user cart with userId:", userId);
    cart = await prisma.cart.findUnique({
      where: { user_id: userId },
      include: { items: { include: { product: { include: { category: true } } } } },
    });
    
    console.log("🔍 Found user cart:", cart ? `Cart ID: ${cart.cart_id}` : "No cart found");
    
    // If no user cart found, create a new one for the user
    if (!cart) {
      console.log("🔍 Creating new user cart for userId:", userId);
      cart = await prisma.cart.create({
        data: {
          user_id: userId,
        },
        include: { items: { include: { product: { include: { category: true } } } } },
      });
      console.log("🔍 Created new user cart:", cart.cart_id);
    }
  } else {
    // If not authenticated, try guest cart
    if (guestId) {
      console.log("🔍 Looking for guest cart with guestId:", guestId);
      cart = await prisma.cart.findUnique({
        where: { guestId },
        include: { items: { include: { product: { include: { category: true } } } } },
      });
      console.log("🔍 Found guest cart:", cart ? `Cart ID: ${cart.cart_id}` : "No cart found");
    }
    
    if (!cart) {
      throw new ApiError(404, "Cart not found");
    }
  }

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Cart retrieved successfully"));
});

// Get cart by ID
const getCart = asyncHandler(async (req: Request, res: Response) => {
  const { cartId } = req.params;

  if (!cartId) {
    throw new ApiError(400, "cartId is required");
  }

  const cart = await prisma.cart.findUnique({
    where: { cart_id: cartId },
    include: { items: { include: { product: { include: { category: true } } } } },
  });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Cart retrieved successfully"));
});

export {
  getOrCreateCart,
  addItemToCart,
  removeItemFromCart,
  mergeCarts,
  getCart,
  getCurrentUserCart,
};
