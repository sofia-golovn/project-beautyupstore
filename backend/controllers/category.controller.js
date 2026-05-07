import Category from "../models/category.model.js";
import cloudinary from "../lib/cloudinary.js"; 

export const createCategory = async (req, res) => {
    try {
        const { name, image } = req.body;
        let imageUrl = "";

        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image, { folder: "categories" });
            imageUrl = uploadResponse.secure_url;
        }

        const href = `/catalog/${name.toLowerCase().replace(/\s+/g, "-")}`;

        const category = await Category.create({ name, imageUrl, href });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: "Category not found" });

        if (category.imageUrl) {
            const urlParts = category.imageUrl.split("/");
            const fileNameWithExtension = urlParts[urlParts.length - 1]; 
            const publicId = fileNameWithExtension.split(".")[0];

            await cloudinary.uploader.destroy(`categories/${publicId}`);
        }

        await Category.findByIdAndDelete(req.params.id);
        res.json({ message: "Category deleted successfully" });
    } catch (error) {
        console.error("Cloudinary error:", error.message);
        res.status(500).json({ message: error.message });
    }
};