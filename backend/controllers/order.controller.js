import Order from "../models/order.model.js";

export const getAllOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 12;
        const skip = (page - 1) * limit;
        
        const { status } = req.query; 
        
        const query = status && status !== "All" ? { status } : {};

        const totalOrders = await Order.countDocuments(query);
        const orders = await Order.find(query)
            .populate("user", "name email")
            .populate("products.product", "name image")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({ orders, totalPages: Math.ceil(totalOrders / limit), currentPage: page });
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { status },
            { returnDocument: 'after' }
        )
        .populate("user", "name email")
        .populate("products.product", "name price image");

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getUserOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const totalOrders = await Order.countDocuments({ user: req.user._id });

        const orders = await Order.find({ user: req.user._id })
            .populate("products.product", "name image price description") 
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            orders,
            totalPages: Math.ceil(totalOrders / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};