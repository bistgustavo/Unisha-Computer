import { Router } from "express";
import {
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  getProductRatingSummary,
} from "../controllers/review.controller";

const router = Router();

// List & filters
router.get("/", getReviews);

// Aggregated summary for a product (must come before /:id)
router.get("/product/:product_id/summary", getProductRatingSummary);

// Single
router.get("/:id", getReviewById);

// Create / Update / Delete
router.post("/", createReview);
router.put("/:id", updateReview);
router.delete("/:id", deleteReview);

export default router;
