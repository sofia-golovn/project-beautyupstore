import express from "express";
import dotenv from "dotenv"; 
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";


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

const __dirname = path.resolve();

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", 
    credentials: true,
}));

app.use(express.json({ limit: "10mb" })); 
app.use(express.urlencoded({ limit: "15mb", extended: true }));
app.use(cookieParser());

app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);

app.use((err, req, res, next) => {
    if (err.type === 'entity.too.large') {
        return res.status(413).json({ 
            message: "The photo is too big. Please choose a smaller file size (up to 5 MB)." 
        });
    }
    res.status(500).json({ message: "Something went wrong on the server" });
});

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("(.*)", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

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