// controllers/authController.ts
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response, NextFunction } from "express";
import { registerSchema, loginSchema } from "../validation/authValidation";
import { prisma } from "../db/index";
import {
  hashPassword,
  comparePassword,
  generateToken,
  setTokenCookie,
} from "../utils/createTokenAndHash";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary";
import { userInfo } from "os";
import { json } from "stream/consumers";

const registerUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let profile = null;
    try {
      registerSchema.parse(req.body);
      const {
        username,
        first_name,
        last_name,
        email,
        password,
        phone,
        address,
      } = req.body;

      const userExists = await prisma.user.findFirst({
        where: { OR: [{ username }, { email }] },
      });

      if (userExists) {
        throw new ApiError(400, "User already exists");
      }

      const hashedPassword = await hashPassword(password);
      const profileLocalPath = req.file?.path;

      if (!profileLocalPath) {
        throw new ApiError(400, "Profile image is required");
      }

      // Upload to Cloudinary
      profile = await uploadOnCloudinary(profileLocalPath);
      if (!profile) {
        throw new ApiError(500, "Failed to upload profile image");
      }

      const user = await prisma.user.create({
        data: {
          username,
          first_name,
          last_name,
          email,
          password: hashedPassword,
          phone: phone || null,
          address: address || null,
          profile_url: profile,
        },
        select: {
          user_id: true,
          username: true,
          email: true,
          first_name: true,
          last_name: true,
          profile_url: true,
        },
      });

      const accessToken = generateToken(user.user_id);
      setTokenCookie(res, accessToken);

      await prisma.user.update({
        where: { user_id: user.user_id },
        data: { accessToken },
      });

      return res
        .status(201)
        .json(new ApiResponse(201, { user }, "User registered successfully"));
    } catch (error) {
      // Clean up Cloudinary upload if registration fails
      if (profile) {
        try {
          await deleteFromCloudinary(profile);
        } catch (cloudinaryError) {
          console.error(
            "Failed to delete image from Cloudinary:",
            cloudinaryError
          );
          // Continue with the original error
        }
      }
      // Re-throw ApiError instances
      if (error instanceof ApiError) {
        throw error;
      }

      // Handle any other unexpected errors
      console.error("Unexpected error during registration:", error);
      throw new ApiError(
        500,
        "An unexpected error occurred during registration"
      );
    }
  }
);

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = loginSchema.parse(req.body);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new ApiError(400, "Invalid credentials");
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid credentials");
  }

  const accessToken = generateToken(user.user_id);
  setTokenCookie(res, accessToken);

  await prisma.user.update({
    where: { user_id: user.user_id },
    data: { accessToken },
  });

  const loggedInUser = await prisma.user.findUnique({
    where: { user_id: user.user_id },
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

  res
    .status(200)
    .json(new ApiResponse(200, { user: loggedInUser }, "Login successful"));
});

const logOutUser = asyncHandler(async (req: Request, res: Response) => {
  if (req.user?.user_id) {
    await prisma.user.update({
      where: { user_id: req.user.user_id },
      data: { accessToken: null },
    });
  }

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
  };

  res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "Logout successful"));
});

const changeUserPassword = asyncHandler(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  const user = await prisma.user.findUnique({
    where: { user_id: req.user?.user_id },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await comparePassword(currentPassword, user.password);
  if (!isPasswordValid) {
    throw new ApiError(400, "Current password is incorrect");
  }

  const hashedPassword = await hashPassword(newPassword);
  await prisma.user.update({
    where: { user_id: user.user_id },
    data: { password: hashedPassword, accessToken: null },
  });

  res.clearCookie("accessToken");
  res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current User Details"));
});

const changeUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const profileLocalPath = req.file?.path;

  if (!profileLocalPath) {
    throw new ApiError(400, "Profile path required");
  }

  const profile = await uploadOnCloudinary(profileLocalPath);

  if (!profile) {
    throw new ApiError(400, "Something went wrong while uploading the profile");
  }

  const user = await prisma.user.findUnique({
    where: { user_id: req.user?.user_id },
  });

  if (!user) {
    throw new ApiError(400, "Unauthorised to upload the image");
  }

  await prisma.user.update({
    where: { user_id: user.user_id },
    data: { profile_url: profile },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, { profile }, "profile image updated successfully")
    );
});

const updateAccountDetails = asyncHandler(
  async (req: Request, res: Response) => {
    const { username, email } = req.body;
    if (!username || !email) {
      throw new ApiError(400, "Please provide user details to update");
    }

    const user = await prisma.user.findUnique({
      where: { user_id: req.user?.user_id },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    await prisma.user.update({
      where: { user_id: user.user_id },
      data: { username: username, email: email },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { username, email },
          "User data updated successfully"
        )
      );
  }
);

const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const user = await prisma.user.findUnique({
    where: { user_id: userId },
    select: {
      user_id: true,
      username: true,
      first_name: true,
      last_name: true,
      email: true,
      profile_url: true,
      phone: true,
      address: true,
      status: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User profile retrieved successfully"));
});

const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { user_id: req.user?.user_id },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.profile_url) {
    await deleteFromCloudinary(user.profile_url);
  }

  await prisma.user.delete({
    where: { user_id: user.user_id },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User deleted successfully"));
});

const getUserCart = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const cart = await prisma.cart.findUnique({
    where: { user_id: userId },
    include: {
      items: {
        include: {
          product: {
            select: {
              product_id: true,
              name: true,
              price: true,
              description: true,
              image_url: true,
              stock: true,
              stock_quantity: true,
            },
          },
        },
      },
    },
  });

  if (!cart) {
    return res.status(404).json(new ApiResponse(404, {}, "Cart not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { cart }, "User cart retrieved successfully"));
});

const addToCart = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { productId, quantity = 1 } = req.body;

  //check if the product exists

  const product = await prisma.product.findUnique({
    where: { product_id: productId },
    select: {
      stock: true,
      stock_quantity: true,
    },
  });

  if (
    !product ||
    product.stock === "outOfStock" ||
    product.stock_quantity < quantity
  ) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Product not available"));
  }
  //Get user's cart

  const cart = await prisma.cart.findUnique({
    where: { user_id: userId },
  });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  //Check if the product is already in the cart
  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cart_id: cart.cart_id,
      product_id: productId,
    },
  });

  let cartItem;

  if (existingItem) {
    //Update the quantity of the existing item
    cartItem = await prisma.cartItem.update({
      where: { cart_item_id: existingItem.cart_item_id },
      data: { quantity: existingItem.quantity + quantity },
    });
  } else {
    //Add new item to the cart
    cartItem = await prisma.cartItem.create({
      data: {
        cart_id: cart.cart_id,
        product_id: productId,
        quantity,
      },
      include: { product: true },
    });
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { cartItem }, "Product added to cart successfully")
    );
});

const removeFromCart = asyncHandler(async (req: Request, res: Response) => {
  const { userId, itemId } = req.params;

  //get user's cart

  const cart = await prisma.cart.findUnique({
    where: { user_id: userId },
  });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  await prisma.cartItem.delete({
    where: { cart_item_id: itemId, cart_id: cart.cart_id },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Product removed from cart successfully"));
});

//update cart item quantity
const updateCartItemQuantity = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId, itemId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      throw new ApiError(400, "Quantity must be at least 1");
    }

    // Get user's cart
    const cart = await prisma.cart.findUnique({
      where: { user_id: userId },
    });

    if (!cart) {
      throw new ApiError(404, "Cart not found");
    }

    // Get the cart item
    const cartItem = await prisma.cartItem.findUnique({
      where: { cart_item_id: itemId, cart_id: cart.cart_id },
      include: { product: true },
    });

    if (!cartItem) {
      throw new ApiError(404, "Cart item not found");
    }

    // Check product availability
    if (
      cartItem.product.stock === "outOfStock" ||
      cartItem.product.stock_quantity < quantity
    ) {
      throw new ApiError(
        400,
        "Product is not available in the requested quantity"
      );
    }

    // Update quantity
    const updatedCartItem = await prisma.cartItem.update({
      where: { cart_item_id: itemId },
      data: { quantity },
      include: { product: true },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedCartItem,
          "Cart item quantity updated successfully"
        )
      );
  }
);

export {
  registerUser,
  loginUser,
  logOutUser,
  changeUserPassword,
  getCurrentUser,
  updateAccountDetails,
  changeUserProfile,
  deleteUser,
};
