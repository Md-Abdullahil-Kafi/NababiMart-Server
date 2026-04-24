import { Router } from "express";
import {
  createOrder,
  getAllOrders,
  getUserOrders,
  cancelOrderByUser,
  updateOrderStatus,
  updatePaymentStatus,
} from "../controllers/order.controller.js";
import { requireAdmin, requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", requireAuth, createOrder);
router.get("/", requireAuth, requireAdmin, getAllOrders);
router.get("/user/:email", requireAuth, getUserOrders);
router.patch("/:id/cancel", requireAuth, cancelOrderByUser);
router.patch("/:id/status", requireAuth, requireAdmin, updateOrderStatus);
router.patch("/:id/payment-status", requireAuth, requireAdmin, updatePaymentStatus);

export default router;
