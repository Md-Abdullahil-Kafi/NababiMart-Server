import { Router } from "express";
import { createUser, getUserByEmail } from "../controllers/user.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", requireAuth, createUser);
router.get("/:email", requireAuth, getUserByEmail);

export default router;
