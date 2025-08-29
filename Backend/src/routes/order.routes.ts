import { Router } from "express";
import {
  createOrder,
  getOrderById,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/order.controller";
import { verifyJWT } from "../middlewares/auth";

const router = Router();

router.post("/createOrder", verifyJWT, createOrder);

router.get("/getOrder/:orderId", verifyJWT, getOrderById);

router.get("/getUserOrders", verifyJWT, getUserOrders);

router.get("/getAllOrders", verifyJWT, getAllOrders);

router.patch("/updateOrderStatus/:orderId", verifyJWT, updateOrderStatus);

export default router;
