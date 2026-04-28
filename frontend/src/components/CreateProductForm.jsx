import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Upload, Loader, Plus, X, Check, Trash2 } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";

const CreateProductForm = () => {
    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
    });

    const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");

    const { 
        createProduct, 
        loading, 
        categories, 
        fetchAllCategories, 
        createCategory, 
        deleteCategory 
    } = useProductStore();

    useEffect(() => {
        if (fetchAllCategories) fetchAllCategories();
    }, [fetchAllCategories]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!newProduct.image) {
            alert("Please upload an image first!");
            return;
        }

        try {
            const productData = {
                ...newProduct,
                price: parseFloat(newProduct.price)
            };

            await createProduct(productData);
            
            setNewProduct({ name: "", description: "", price: "", category: "", image: "" });
        } catch (error) {
            console.error("Full error object:", error);
        }
    };

    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) return;
        try {
            await createCategory(newCategoryName.trim());
            
            setNewProduct({ ...newProduct, category: newCategoryName.trim() });
            setNewCategoryName("");
            setIsAddingNewCategory(false);
        } catch (error) {
            console.log("Error creating category", error);
        }
    };

    const handleDeleteCategory = () => {
        if (!newProduct.category || newProduct.category === "All") return;
        
        if (window.confirm(`Are you sure you want to delete the category? "${newProduct.category}"?`)) {
            deleteCategory(newProduct.category);
            setNewProduct({ ...newProduct, category: "" });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewProduct({ ...newProduct, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <motion.div
            className='bg-white shadow-sm rounded-lg p-8 mb-8 max-w-xl mx-auto border border-gray-100'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <h2 className='text-xl font-semibold mb-6 text-[#74090A] tracking-wider uppercase text-center'>
                Create New Product
            </h2>
            
            <form onSubmit={handleSubmit} className='space-y-5'>
                <div>
                    <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-1'>
                        Product Name
                    </label>
                    <input
                        type='text'
                        id='name'
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                        focus:outline-none focus:ring-1 focus:ring-[#74090A] focus:border-[#74090A] sm:text-sm'
                        placeholder='Name your beauty product...'
                        required
                    />
                </div>

                <div>
                    <label htmlFor='description' className='block text-sm font-medium text-gray-700 mb-1'>
                        Description
                    </label>
                    <textarea
                        id='description'
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        rows='3'
                        className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                        focus:outline-none focus:ring-1 focus:ring-[#74090A] focus:border-[#74090A] sm:text-sm'
                        placeholder='Describe the product rituals...'
                        required
                    />
                </div>

                <div>
                    <label htmlFor='price' className='block text-sm font-medium text-gray-700 mb-1'>
                        Price
                    </label>
                    <input
                        type='number'
                        id='price'
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        step='0.5'
                        className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                        focus:outline-none focus:ring-1 focus:ring-[#74090A] focus:border-[#74090A] sm:text-sm'
                        placeholder='0.00'
                        required
                    />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label htmlFor='category' className='block text-sm font-medium text-gray-700'>
                            Category
                        </label>
                        <button
                            type="button"
                            onClick={() => setIsAddingNewCategory(!isAddingNewCategory)}
                            className="flex items-center text-xs font-semibold text-[#74090A] hover:text-[#5a0708]"
                        >
                            {isAddingNewCategory ? <><X size={14} className="mr-1" /> Cancel</> : <><Plus size={14}
                            className="mr-1" /> Add New</>}
                        </button>
                    </div>

                    <AnimatePresence>
                        {isAddingNewCategory && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="flex gap-2 mb-3 p-2 bg-gray-50 rounded-md border border-dashed
                                border-gray-300">
                                    <input
                                        type="text"
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        placeholder="New category name..."
                                        className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded 
                                        outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleCreateCategory}
                                        className="bg-[#74090A] text-white p-1.5 rounded hover:bg-[#5a0708]"
                                    >
                                        <Check size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex gap-2">
                        <select
                            id='category'
                            value={newProduct.category}
                            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                            className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                            focus:ring-[#74090A] focus:border-[#74090A] sm:text-sm capitalize'
                            required
                        >
                            <option value=''>Select a category</option>
                            {categories?.filter(c => c !== "All").map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>

                        {newProduct.category && newProduct.category !== "All" && (
                            <button
                                type="button"
                                onClick={handleDeleteCategory}
                                className="p-2 text-gray-400 hover:text-red-600 border border-gray-300 
                                rounded-md transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        )}
                    </div>
                </div>

                <div className='flex items-center pt-2'>
                    <input type='file' id='image' className='sr-only' accept='image/*' onChange={handleImageChange} />
                    <label
                        htmlFor='image'
                        className='cursor-pointer bg-gray-50 py-2 px-4 border border-gray-300 rounded-md 
                        shadow-sm text-sm font-medium text-gray-700 
                        hover:bg-gray-100 flex items-center transition-colors'
                    >
                        <Upload className='h-4 w-4 mr-2 text-[#74090A]' />
                        Upload Image
                    </label>
                    {newProduct.image && (
                        <span className='ml-3 text-xs text-green-600 font-medium'>✓ Image ready</span>
                    )}
                </div>

                <button
                    type='submit'
                    className='w-full flex justify-center py-2.5 px-4 border border-transparent 
                    rounded-md shadow-sm text-sm font-medium text-white bg-[#74090A] 
                    hover:bg-[#5a0708] disabled:opacity-50 mt-4 transition-colors'
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader className='mr-2 h-5 w-5 animate-spin' />
                            Creating...
                        </>
                    ) : (
                        <>
                            <PlusCircle className='mr-2 h-5 w-5' />
                            Create Product
                        </>
                    )}
                </button>
            </form>
        </motion.div>
    );
};

export default CreateProductForm;