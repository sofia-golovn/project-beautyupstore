import express from "express";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js"; // Ваші мідлвари
import { getAllUsers, deleteUser, toggleUserRole } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", protectRoute, adminRoute, getAllUsers);
router.delete("/:id", protectRoute, adminRoute, deleteUser);
router.patch("/:id", protectRoute, adminRoute, toggleUserRole);

export default router;