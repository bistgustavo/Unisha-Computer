import { Router } from "express";
import {
  updatePaymentStatus,
  getPaymentById,
  getUserPayments,
  getAllPayments,
} from "../controllers/payment.controller";
import { verifyJWT } from "../middlewares/auth";

const router = Router();

// Update payment status (admin/user)
router.patch("/updateStatus/:paymentId", verifyJWT, updatePaymentStatus);

// Get payment by ID
router.get("/getPayment/:paymentId", verifyJWT, getPaymentById);

// Get user's payments
router.get("/getUserPayments", verifyJWT, getUserPayments);

// Admin: Get all payments
router.get("/getAllPayments", verifyJWT, getAllPayments);

export default router;
