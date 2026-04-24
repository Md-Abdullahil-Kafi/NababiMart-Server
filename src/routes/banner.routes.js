import { Router } from "express";
import {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from "../controllers/banner.controller.js";
import { requireAdmin, requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getBanners);
router.post("/", requireAuth, requireAdmin, createBanner);
router.patch("/:id", requireAuth, requireAdmin, updateBanner);
router.delete("/:id", requireAuth, requireAdmin, deleteBanner);

export default router;
