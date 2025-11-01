import { Request, Response } from "express";
import { prisma } from "../db/index";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";

// GET /api/reviews?product_id=...&user_id=...
export const getReviews = asyncHandler(async (req: Request, res: Response) => {
  const { product_id, user_id } = req.query;

  const reviews = await prisma.review.findMany({
    where: {
      ...(product_id ? { product_id: String(product_id) } : {}),
      ...(user_id ? { user_id: String(user_id) } : {}),
    },
    include: {
      user: { select: { user_id: true, username: true, first_name: true, last_name: true } },
      product: { select: { product_id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, reviews, "Reviews fetched successfully"));
});

// GET /api/reviews/:id
export const getReviewById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const review = await prisma.review.findUnique({
    where: { review_id: id },
    include: {
      user: { select: { user_id: true, username: true } },
      product: { select: { product_id: true, name: true } },
    },
  });

  if (!review) throw new ApiError(404, "Review not found");

  return res
    .status(200)
    .json(new ApiResponse(200, review, "Review fetched successfully"));
});

// POST /api/reviews
export const createReview = asyncHandler(async (req: Request, res: Response) => {
  const { user_id, product_id, rating, comment } = req.body as {
    user_id: string;
    product_id: string;
    rating: number;
    comment?: string;
  };

  if (!user_id || !product_id || rating === undefined) {
    throw new ApiError(400, "user_id, product_id and rating are required");
  }

  const numericRating = Number(rating);
  if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
    throw new ApiError(400, "rating must be a number between 1 and 5");
  }

  // Ensure user & product exist (helps avoid foreign key errors with clearer messages)
  const [user, product] = await Promise.all([
    prisma.user.findUnique({ where: { user_id } }),
    prisma.product.findUnique({ where: { product_id } }),
  ]);
  if (!user) throw new ApiError(404, "User not found");
  if (!product) throw new ApiError(404, "Product not found");

  const created = await prisma.review.create({
    data: {
      user_id,
      product_id,
      rating: numericRating,
      comment: comment ?? null,
    },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, created, "Review created successfully"));
});

// PUT /api/reviews/:id
export const updateReview = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { rating, comment } = req.body as { rating?: number; comment?: string | null };

  const existing = await prisma.review.findUnique({ where: { review_id: id } });
  if (!existing) throw new ApiError(404, "Review not found");

  if (rating !== undefined) {
    const numericRating = Number(rating);
    if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
      throw new ApiError(400, "rating must be a number between 1 and 5");
    }
  }

  const updated = await prisma.review.update({
    where: { review_id: id },
    data: {
      ...(rating !== undefined ? { rating: Number(rating) } : {}),
      ...(comment !== undefined ? { comment } : {}),
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Review updated successfully"));
});

// DELETE /api/reviews/:id
export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const existing = await prisma.review.findUnique({ where: { review_id: id } });
  if (!existing) throw new ApiError(404, "Review not found");

  await prisma.review.delete({ where: { review_id: id } });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Review deleted successfully"));
});

// GET /api/reviews/product/:product_id/summary
export const getProductRatingSummary = asyncHandler(async (req: Request, res: Response) => {
  const { product_id } = req.params;

  const product = await prisma.product.findUnique({ where: { product_id } });
  if (!product) throw new ApiError(404, "Product not found");

  const [agg, distribution] = await Promise.all([
    prisma.review.aggregate({
      where: { product_id },
      _avg: { rating: true },
      _count: { _all: true },
    }),
    prisma.review.groupBy({
      by: ["rating"],
      where: { product_id },
      _count: { _all: true },
      orderBy: { rating: "asc" },
    }),
  ]);

  const payload = {
    product_id,
    average_rating: agg._avg.rating ?? 0,
    total_reviews: agg._count._all,
    distribution: distribution.map((d: { rating: any; _count: { _all: any; }; }) => ({ rating: d.rating, count: d._count._all })),
  };

  return res
    .status(200)
    .json(new ApiResponse(200, payload, "Rating summary fetched successfully"));
});
