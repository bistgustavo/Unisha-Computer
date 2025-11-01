import e, { Router } from "express";
import {
  updatePaymentStatus,
  getPaymentById,
  getUserPayments,
  getAllPayments,
  esewaIntegration,
} from "../controllers/payment.controller";
import { verifyJWT } from "../middlewares/auth";
import crypto from "crypto";

const router = Router();

// Update payment status (admin/user)
router.patch("/updateStatus/:paymentId", verifyJWT, updatePaymentStatus);

// Get payment by ID
router.get("/getPayment/:paymentId", verifyJWT, getPaymentById);

// Get user's payments
router.get("/getUserPayments", verifyJWT, getUserPayments);

// Admin: Get all payments
router.get("/getAllPayments", verifyJWT, getAllPayments);

router.post("/esewa/sign", esewaIntegration);

export default router;
