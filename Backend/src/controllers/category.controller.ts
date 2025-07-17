import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response, NextFunction } from "express";
import { prisma } from "../db/index";

const createCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, description } = req.body;
    const userId = req.user?.user_id; // Assuming user_id is available in req.user

    if (!userId) {
      return next(new ApiError(401, "User not authenticated"));
    }

    const isAdmin = await prisma.user.findUnique({
      where: { user_id: userId },
      select: { web_role: true },
    });

    if (isAdmin?.web_role !== "admin") {
      return next(new ApiError(403, "Access denied. Admins only."));
    }

    if (!name) {
      return next(new ApiError(400, "Category name is required"));
    }

    const existingCategory = await prisma.category.findFirst({
      where: { name },
    });

    if (existingCategory) {
      return next(new ApiError(400, "Category already exists"));
    }

    const category = await prisma.category.create({
      data: {
        name,
        description,
      },
    });

    return res
      .status(201)
      .json(new ApiResponse(201, category, "Category created successfully"));
  }
);

const updateCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const userId = req.user?.user_id; // Assuming user_id is available in req.user

    if (!userId) {
      return next(new ApiError(401, "User not authenticated"));
    }

    const isAdmin = await prisma.user.findUnique({
      where: { user_id: userId },
      select: { web_role: true },
    });

    if (isAdmin?.web_role !== "admin") {
      return next(new ApiError(403, "Access denied. Admins only."));
    }

    if (!id) {
      return next(new ApiError(400, "Category ID is required"));
    }

    const category = await prisma.category.findFirst({
      where: { category_id: id },
    });

    if (!category) {
      return next(new ApiError(404, "Category not found"));
    }

    const updatedCategory = await prisma.category.update({
      where: { category_id: id },
      data: {
        name,
        description,
      },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedCategory, "Category updated successfully")
      );
  }
);

const deleteCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = req.user?.user_id; // Assuming user_id is available in req.user

    if (!userId) {
      return next(new ApiError(401, "User not authenticated"));
    }

    const isAdmin = await prisma.user.findUnique({
      where: { user_id: userId },
      select: { web_role: true },
    });

    if (isAdmin?.web_role !== "admin") {
      return next(new ApiError(403, "Access denied. Admins only."));
    }

    if (!id) {
      return next(new ApiError(400, "Category ID is required"));
    }

    const category = await prisma.category.findFirst({
      where: { category_id: id },
    });

    if (!category) {
      return next(new ApiError(404, "Category not found"));
    }

    await prisma.category.delete({
      where: { category_id: id },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Category deleted successfully"));
  }
);

const getAllCategories = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const categories = await prisma.category.findMany();
    const userId = req.user?.user_id; // Assuming user_id is available in req.user

    if (!userId) {
      return next(new ApiError(401, "User not authenticated"));
    }

    const isAdmin = await prisma.user.findUnique({
      where: { user_id: userId },
      select: { web_role: true },
    });

    if (isAdmin?.web_role !== "admin") {
      return next(new ApiError(403, "Access denied. Admins only."));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, categories, "Categories retrieved successfully")
      );
  }
);

const getCategoryById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!id) {
      return next(new ApiError(400, "Category ID is required"));
    }

    const category = await prisma.category.findFirst({
      where: { category_id: id },
    });

    if (!category) {
      return next(new ApiError(404, "Category not found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, category, "Category retrieved successfully"));
  }
);

export {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
};
