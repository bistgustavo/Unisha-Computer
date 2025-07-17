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

const getUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.userId || req.user?.user_id;
      if (!userId) {
        throw new ApiError(401, "User not authenticated");
      }

      const user = await prisma.user.findUnique({
        where: { user_id: userId },
        include: {
          addresses: true, // Include addresses if needed
          cart: {
            include: {
              items: {
                include: {
                  product: true, // Include product details in cart items
                },
              },
            },
          },
          orders: true,
        },
      });

      if (!user) {
        throw new ApiError(404, "User not found");
      }

      res
        .status(200)
        .json(new ApiResponse(200, { user }, "User fetched successfully"));
    } catch (error) {
      throw new ApiError(500, "Failed to fetch user details");
    }
  }
);

const registerUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let profile = null;

    registerSchema.parse(req.body);

    const { username, email, password, first_name, last_name, phone } =
      req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ApiError(409, "User already exists");
    }

    const hashedPassword = await hashPassword(password);

    const profileLocalPath = req.file?.path;
    if (profileLocalPath) {
      try {
        profile = await uploadOnCloudinary(profileLocalPath);
        console.log("Profile image uploaded successfully:", profile);
      } catch (error) {
        throw new ApiError(500, "Failed to upload profile image");
      }
    }

    let newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        first_name,
        last_name,
        phone,
        profile_url: profile,
      },
    });

    const accessToken = generateToken(newUser.user_id);

    newUser = await prisma.user.update({
      where: { user_id: newUser.user_id },
      data: { accessToken },
    });

    setTokenCookie(res, accessToken);

    res
      .status(201)
      .json(
        new ApiResponse(201, { user: newUser }, "User registered successfully")
      );
  }
);

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  loginSchema.parse(req.body);

  const { email, password } = req.body;

  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password");
  }

  const accessToken = generateToken(user.user_id);

  await prisma.user.update({
    where: { user_id: user.user_id },
    data: { accessToken },
  });

  const userResponse = await prisma.user.findUnique({
    where: { user_id: user.user_id },
    select: {
      user_id: true,
      username: true,
      email: true,
      first_name: true,
      web_role: true,
      last_name: true,
      phone: true,
      profile_url: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  setTokenCookie(res, accessToken);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: userResponse, accessToken },
        "User logged in successfully"
      )
    );
});

const logOutUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.user_id;

  if (!userId) {
    throw new ApiError(401, "User not authenticated");
  }

  await prisma.user.update({
    where: { user_id: userId },
    data: { accessToken: null },
  });

  res
    .status(200)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const changeUserPassword = asyncHandler(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user?.user_id;

  if (!userId) {
    throw new ApiError(401, "User not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { user_id: userId },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isCurrentPasswordValid = await comparePassword(
    currentPassword,
    user.password
  );

  if (!isCurrentPasswordValid) {
    throw new ApiError(401, "Current password is incorrect");
  }

  const hashedNewPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { user_id: userId },
    data: { password: hashedNewPassword },
  });

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const changeUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.user_id;
  if (!userId) throw new ApiError(401, "User not authenticated");

  const profileLocalPath = req.file?.path;
  if (!profileLocalPath) throw new ApiError(400, "Profile image is required");

  let profileUrl;
  try {
    profileUrl = await uploadOnCloudinary(profileLocalPath);
    console.log("Profile uploaded:", profileUrl);

    await prisma.user.update({
      where: { user_id: userId },
      data: { profile_url: profileUrl },
    });

    res
      .status(200)
      .json(new ApiResponse(200, {}, "Profile updated successfully"));
  } catch (error) {
    // Delete from Cloudinary if upload failed but URL was generated
    if (profileUrl) await deleteFromCloudinary(profileUrl);
    throw new ApiError(500, "Failed to upload profile image");
  }

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Profile updated successfully"));
});

const updateAccountDetails = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.user_id;
    if (!userId) throw new ApiError(401, "User not authenticated");

    const { username, first_name, last_name, phone } = req.body;

    const updatedUser = await prisma.user.update({
      where: { user_id: userId },
      data: {
        username,
        first_name,
        last_name,
        phone,
      },
      select: {
        user_id: true,
        username: true,
        email: true,
        first_name: true,
        last_name: true,
        phone: true,
        profile_url: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { user: updatedUser },
          "Account updated successfully"
        )
      );
  }
);

const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.user_id;
  if (!userId) throw new ApiError(401, "User not authenticated");

  await prisma.user.delete({
    where: { user_id: userId },
  });

  res.status(200).json(new ApiResponse(200, {}, "User deleted successfully"));
});

export {
  getUser,
  registerUser,
  loginUser,
  logOutUser,
  changeUserPassword,
  updateAccountDetails,
  changeUserProfile,
  deleteUser,
};
