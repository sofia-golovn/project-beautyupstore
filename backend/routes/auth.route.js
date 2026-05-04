import express from "express";
import { 
    login, logout, signup, refreshToken, getProfile, 
    forgotPassword, resetPassword, googleLogin, toggleBlockUser 
} from "../controllers/auth.controller.js";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/profile", protectRoute, getProfile);
router.post("/google", googleLogin);

router.put("/users/block/:id", protectRoute, adminRoute, toggleBlockUser);

export default router;