import express from "express";
import dotenv from "dotenv"; 
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import analyticsRoutes from "./routes/analytics.route.js";
import userRoutes from "./routes/user.route.js";
import wishlistRoutes from "./routes/wishlist.route.js";
import categoryRoutes from "./routes/category.route.js";
import orderRoutes from "./routes/order.route.js";

import { connectDB } from "./lib/db.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true,
}));

app.use(express.json({ limit: "10mb" })); 
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);


app.listen(PORT, async () => {
    console.log("Server is running on http://localhost:" + PORT);
    
    await connectDB();

    try {
        const mongoose = (await import("mongoose")).default;
        const collection = mongoose.connection.db.collection("coupons");
        
        const indexes = await collection.indexes();
        console.log("Current indexes in DB:", indexes.map(i => i.name));

        if (indexes.some(i => i.name === "userId_1")) {
            await collection.dropIndex("userId_1");
            console.log("SUCCESS: Index userId_1 was found and deleted");
        } else {
            console.log("Index userId_1 not found, everything is clean.");
        }
    } catch (err) {
        console.log("Note: Index cleaning skipped or index doesn't exist.");
    }
});