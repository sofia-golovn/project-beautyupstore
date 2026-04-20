import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";
import Product from "../models/product.model.js";

export const getAllProducts = async (req, res) => {
    try {
        const { page = 1, limit = 12, minPrice = 0, maxPrice, sort, search } = req.query;

        let query = {
            price: { $gte: Number(minPrice) }
        };
        
        if (maxPrice) query.price.$lte = Number(maxPrice);

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { category: { $regex: search, $options: "i" } }
            ];
        }

        let sortOptions = {};
        if (sort === "az") sortOptions = { name: 1 };
        else if (sort === "za") sortOptions = { name: -1 };
        else if (sort === "low-high") sortOptions = { price: 1 };
        else if (sort === "high-low") sortOptions = { price: -1 };
        else sortOptions = { createdAt: -1 };

        const skip = (page - 1) * limit;

        const products = await Product.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(Number(limit));

        const totalProducts = await Product.countDocuments(query);

        res.json({
            products,
            totalPages: Math.ceil(totalProducts / limit),
            currentPage: Number(page),
            totalProducts
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const { page = 1, limit = 12, minPrice = 0, maxPrice, sort, search } = req.query;

        let filter = { 
            category: category, 
            price: { $gte: Number(minPrice) } 
        };
        
        if (maxPrice) {
            filter.price.$lte = Number(maxPrice);
        }

        if (search) {
            filter.name = { $regex: search, $options: "i" };
        }

        let sortOptions = {};
        if (sort === "az") sortOptions = { name: 1 };
        else if (sort === "za") sortOptions = { name: -1 };
        else if (sort === "low-high") sortOptions = { price: 1 };
        else if (sort === "high-low") sortOptions = { price: -1 };

        const skip = (page - 1) * limit;

        const products = await Product.find(filter)
            .sort(sortOptions)
            .skip(skip)
            .limit(Number(limit));

        const totalProducts = await Product.countDocuments(filter);

        res.json({
            products,
            totalPages: Math.ceil(totalProducts / limit),
            currentPage: Number(page),
            totalProducts
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getFeaturedProducts = async (req, res) => {
    try {
        let featuredProducts = await redis.get("featured_products");
        if (featuredProducts) {
            return res.json(JSON.parse(featuredProducts));
        }

        featuredProducts = await Product.find({ isFeatured: true }).lean();

        if (!featuredProducts) {
            return res.status(404).json({ message: "No featured products found" });
        }

        await redis.set("featured_products", JSON.stringify(featuredProducts));

        res.json(featuredProducts);
    } catch (error) {
        console.log("Error in getFeaturedProducts controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, image, category } = req.body;

        let cloudinaryResponse = null;

        if (image) {
            cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });
        }

        const product = await Product.create({
            name,
            description,
            price,
            image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
            category,
        });

        res.status(201).json(product);
    } catch (error) {
        console.log("Error in createProduct controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.image) {
            const publicId = product.image.split("/").pop().split(".")[0];
            try {
                await cloudinary.uploader.destroy(`products/${publicId}`);
                console.log("deleted image from cloduinary");
            } catch (error) {
                console.log("error deleting image from cloduinary", error);
            }
        }

        await Product.findByIdAndDelete(req.params.id);

        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        console.log("Error in deleteProduct controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getRecommendedProducts = async (req, res) => {
    try {
        const products = await Product.aggregate([
            { $sample: { size: 4 } },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    image: 1,
                    price: 1,
                },
            },
        ]);

        res.json(products);
    } catch (error) {
        console.log("Error in getRecommendedProducts controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const toggleFeaturedProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            product.isFeatured = !product.isFeatured;
            const updatedProduct = await product.save();
            await updateFeaturedProductsCache();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        console.log("Error in toggleFeaturedProduct controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

async function updateFeaturedProductsCache() {
    try {
        const featuredProducts = await Product.find({ isFeatured: true }).lean();
        await redis.set("featured_products", JSON.stringify(featuredProducts));
    } catch (error) {
        console.log("error in update cache function");
    }
}

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, image, category } = req.body;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        let imageUrl = product.image;

        if (image && image !== product.image) {
            if (product.image) {
                const publicId = product.image.split("/").pop().split(".")[0];
                try {
                    await cloudinary.uploader.destroy(`products/${publicId}`);
                } catch (error) {
                    console.log("Error deleting old image from Cloudinary", error);
                }
            }

            const cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });
            imageUrl = cloudinaryResponse.secure_url;
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.category = category || product.category;
        product.image = imageUrl;

        const updatedProduct = await product.save();

        if (updatedProduct.isFeatured) {
            await updateFeaturedProductsCache();
        }

        res.json(updatedProduct);
    } catch (error) {
        console.log("Error in updateProduct controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getUniqueCategories = async (req, res) => {
    try {
        if (req.method === "POST") {
            const { name } = req.body;
            if (!name) return res.status(400).json({ message: "Category name is required" });
            
            return res.status(201).json(name.toLowerCase());
        }

        const categories = await Product.distinct("category");
        res.json(categories);
    } catch (error) {
        console.log("Error in getUniqueCategories", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getMaxProductPrice = async (req, res) => {
    try {
        const topProduct = await Product.findOne().sort("-price");
        
        const maxPrice = topProduct ? topProduct.price : 200;
        
        res.json({ maxPrice });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};