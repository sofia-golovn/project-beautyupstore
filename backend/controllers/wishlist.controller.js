import User from "../models/user.model.js";
import Product from "../models/product.model.js";

const orderedProductsFromIds = async (ids) => {
	const list = Array.isArray(ids) ? ids.filter(Boolean) : [];
	if (list.length === 0) return [];

	const products = await Product.find({ _id: { $in: list } });
	return list
		.map((id) => products.find((p) => p._id.equals(id)))
		.filter(Boolean)
		.map((p) => p.toJSON());
};

export const getWishlist = async (req, res) => {
	try {
		const user = await User.findById(req.user._id);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const payload = await orderedProductsFromIds(user.wishlist);
		res.json(payload);
	} catch (error) {
		console.log("Error in getWishlist controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const toggleWishlist = async (req, res) => {
	try {
		const { productId } = req.body;
		if (!productId) {
			return res.status(400).json({ message: "productId is required" });
		}

		const user = await User.findById(req.user._id);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		if (!Array.isArray(user.wishlist)) {
			user.wishlist = [];
		}

		const idx = user.wishlist.findIndex((id) => String(id) === String(productId));
		if (idx >= 0) {
			user.wishlist.splice(idx, 1);
		} else {
			user.wishlist.push(productId);
		}

		await user.save();

		const payload = await orderedProductsFromIds(user.wishlist);
		res.json(payload);
	} catch (error) {
		console.log("Error in toggleWishlist controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
