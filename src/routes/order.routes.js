import { Router } from "express";
import {
  createOrder,
  getAllOrders,
  getUserOrders,
  cancelOrderByUser,
  updateOrderStatus,
  updatePaymentStatus,
} from "../controllers/order.controller.js";

const router = Router();

router.post("/", createOrder);
router.get("/", getAllOrders);
router.get("/user/:email", getUserOrders);
router.patch("/:id/cancel", cancelOrderByUser);
router.patch("/:id/status", updateOrderStatus);
router.patch("/:id/payment-status", updatePaymentStatus);

export default router;