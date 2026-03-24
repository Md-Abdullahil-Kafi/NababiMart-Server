import { Router } from "express";
import {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from "../controllers/banner.controller.js";

const router = Router();

router.get("/", getBanners);
router.post("/", createBanner);
router.patch("/:id", updateBanner);
router.delete("/:id", deleteBanner);

export default router;