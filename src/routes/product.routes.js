import { Router } from "express";
import {
  getProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { requireAdmin, requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getProducts);
router.get("/:id", getSingleProduct);
router.post("/", requireAuth, requireAdmin, createProduct);
router.patch("/:id", requireAuth, requireAdmin, updateProduct);
router.delete("/:id", requireAuth, requireAdmin, deleteProduct);

export default router;
