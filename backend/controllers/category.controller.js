import Category from "../models/category.model.js";

export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.json(categories);
    } catch (error) {
        console.log("Error in getAllCategories controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: "Name is required" });

        const existingCategory = await Category.findOne({ name });
        if (existingCategory) return res.status(400).json({ message: "Category already exists" });

        const category = await Category.create({ name });
        res.status(201).json(category);
    } catch (error) {
        console.log("Error in createCategory controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findOneAndDelete({ name: id });
        
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        
        res.json({ message: "Category deleted successfully from database" });
    } catch (error) {
        console.log("Error in deleteCategory controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};