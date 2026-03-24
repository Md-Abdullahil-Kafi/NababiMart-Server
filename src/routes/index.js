import { Router } from "express";
import userRoutes from "./user.routes.js";
import bannerRoutes from "./banner.routes.js";
import productRoutes from "./product.routes.js";
import orderRoutes from "./order.routes.js";

const router = Router();

router.use("/users", userRoutes);
router.use("/banners", bannerRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API running",
  });
});

export default router;