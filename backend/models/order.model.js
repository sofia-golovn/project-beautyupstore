import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                price: {
                    type: Number,
                    required: true,
                    min: 0,
                },
            },
        ],
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        stripeSessionId: {
            type: String,
            required: true,
            unique: true,
        },
        status: {
            type: String,
            required: true,
            enum: ["Paid", "Packed", "Shipped", "Delivered"],
            default: "Paid",
        },
        phone: {
            type: String,
            required: true,
        },
        shippingAddress: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

orderSchema.index({ user: 1, createdAt: -1 });

const Order = mongoose.model("Order", orderSchema);

export default Order;