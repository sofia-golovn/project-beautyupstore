import User from "../models/user.model.js";

export const toggleWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) return res.status(404).json({ message: "User not found" });

        if (!user.wishlist) user.wishlist = [];

        const isFavorite = user.wishlist.includes(productId);

        if (isFavorite) {
            user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
        } else {
            user.wishlist.push(productId);
        }

        await user.save();
        res.json(user.wishlist);
    } catch (error) {
        console.error("Error in toggleWishlist:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

export const getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("wishlist");
        
        res.json(user.wishlist || []);
    } catch (error) {
        console.error("Error in getWishlist:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};