import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response, NextFunction } from "express";
import { prisma } from "../db/index";
import { Prisma } from "@prisma/client";
import { uploadProductOnCloudinary } from "../utils/cloudinary";
import { ApiResponse } from "../utils/ApiResponse";

interface UploadedFile {
  path: string;
  // Add other file properties as needed
}

interface RequestFiles {
  image1?: UploadedFile[];
  image2?: UploadedFile[];
  image3?: UploadedFile[];
  image4?: UploadedFile[];
}

const createProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, description, price, quantity, offerPrice, category_id } =
        req.body;

      const userId = req.user?.user_id;

      if (!userId) {
        return next(new ApiError(401, "User not authenticated"));
      }

      const categoryExists = await prisma.category.findUnique({
        where: { category_id },
      });

      if (!categoryExists) {
        return next(new ApiError(404, "Category not found"));
      }

      // Verify admin role
      const user = await prisma.user.findUnique({
        where: { user_id: userId },
        select: { web_role: true },
      });

      if (user?.web_role !== "admin") {
        return next(new ApiError(403, "Access denied. Admins only."));
      }

      // Validate required fields
      if (!name || !price || !quantity || !category_id) {
        return next(
          new ApiError(400, "Name, price, quantity, and category are required")
        );
      }

      // Handle image uploads
      const files = req.files as RequestFiles;

      const image1LocalPath = files?.image1?.[0]?.path;
      const image2LocalPath = files?.image2?.[0]?.path;
      const image3LocalPath = files?.image3?.[0]?.path;
      const image4LocalPath = files?.image4?.[0]?.path;

      // Upload images to Cloudinary in parallel for better performance
      const [image1Url, image2Url, image3Url, image4Url] = await Promise.all([
        image1LocalPath
          ? uploadProductOnCloudinary(image1LocalPath)
          : Promise.resolve(undefined),
        image2LocalPath
          ? uploadProductOnCloudinary(image2LocalPath)
          : Promise.resolve(undefined),
        image3LocalPath
          ? uploadProductOnCloudinary(image3LocalPath)
          : Promise.resolve(undefined),
        image4LocalPath
          ? uploadProductOnCloudinary(image4LocalPath)
          : Promise.resolve(undefined),
      ]);

      // Determine stock status
      const stock = quantity > 0 ? "available" : "outOfStock";

      // Create product in database
      const product = await prisma.product.create({
        data: {
          name,
          description,
          price: new Prisma.Decimal(price),
          quantity: parseInt(quantity),
          offerPrice: offerPrice ? new Prisma.Decimal(offerPrice) : null,
          stock,
          image_url1: image1Url ? image1Url : null,
          image_url2: image2Url ? image2Url : null,
          image_url3: image3Url ? image3Url : null,
          image_url4: image4Url ? image4Url : null,
          category_id,
        },
      });

      res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product,
      });
    } catch (error) {
      console.error("Error creating product:", error);
      next(new ApiError(500, "Internal Server Error", error));
    }
  }
);

const allProducts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await prisma.product.findMany({
        include: {
          category: true,
        },
      });

      res.status(200).json({
        success: true,
        message: "Products retrieved successfully",
        data: products,
      });
    } catch (error) {
      console.error("Error retrieving products:", error);
      next(new ApiError(500, "Internal Server Error", error));
    }
  }
);

const productByCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { category_id } = req.params;

    if (!category_id) {
      return next(new ApiError(400, "Category ID is required"));
    }

    try {
      const products = await prisma.product.findMany({
        where: { category_id },
      });

      res.status(200).json({
        success: true,
        message: "Products retrieved successfully",
        data: products,
      });
    } catch (error) {
      console.error("Error retrieving products:", error);
      next(new ApiError(500, "Internal Server Error", error));
    }
  }
);

const bestSellingProducts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await prisma.product.findMany({
        orderBy: {
          quantity: "desc",
        },
        include: {
          category: true,
        },
        take: 10, // Adjust the number of best-selling products to retrieve
      });

      res.status(200).json({
        success: true,
        message: "Best-selling products retrieved successfully",
        data: products,
      });
    } catch (error) {
      console.error("Error retrieving best-selling products:", error);
      next(new ApiError(500, "Internal Server Error", error));
    }
  }
);

const searchProducts = asyncHandler(async (req: Request, res: Response) => {
  const { query } = req.query;

  // Validate search query
  if (!query || typeof query !== "string") {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          null,
          "Search query is required and must be a string"
        )
      );
  }

  const searchTerm = query.trim();

  // Return empty result for empty query
  if (searchTerm === "") {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "Please enter a search term"));
  }

  try {
    // Search products with case-insensitive matching
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: "insensitive" } },
          { description: { contains: searchTerm, mode: "insensitive" } },
          {
            category: {
              name: { contains: searchTerm, mode: "insensitive" },
            },
          },
        ],
      },
      include: {
        category: true,
      },
      // Pagination options
      take: 20, // Limit results
      orderBy: {
        name: "asc", // Default sorting
      },
    });

    if (products.length === 0) {
      return res
        .status(200)
        .json(
          new ApiResponse(200, [], "No products found matching your search")
        );
    }

    return res
      .status(200)
      .json(new ApiResponse(200, products, "Products found successfully"));
  } catch (error) {
    console.error("[SEARCH_ERROR]", error);
    throw new ApiError(
      500,
      "Failed to search products",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
});

export { createProduct, allProducts, productByCategory, bestSellingProducts , searchProducts };
