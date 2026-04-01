import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, Loader, Save, X } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";

const categories = ["face", "body", "hair", "sun", "accessories", "sets"];

const EditProductForm = ({ product, onCancel }) => {
    const [updatedProduct, setUpdatedProduct] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
    });

    const { updateProduct, loading } = useProductStore();

    useEffect(() => {
        if (product) {
            setUpdatedProduct({
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                image: product.image,
            });
        }
    }, [product]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateProduct(product._id, updatedProduct);
            onCancel(); 
        } catch (error) {
            console.log("Error updating product:", error);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUpdatedProduct({ ...updatedProduct, image: reader.result });
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
            <div className="flex justify-between items-center mb-6">
                <h2 className='text-xl font-semibold text-[#74090A] tracking-wider uppercase'>
                    Edit Product
                </h2>
                <button onClick={onCancel} className="text-gray-400 hover:text-[#74090A] transition-colors">
                    <X size={24} />
                </button>
            </div>
            
            <form onSubmit={handleSubmit} className='space-y-5 text-left'>
                <div>
                    <label htmlFor='edit-name' className='block text-sm font-medium text-gray-700 mb-1'>
                        Product Name
                    </label>
                    <input
                        type='text'
                        id='edit-name'
                        value={updatedProduct.name}
                        onChange={(e) => setUpdatedProduct({ ...updatedProduct, name: e.target.value })}
                        className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                        focus:outline-none focus:ring-1 focus:ring-[#74090A] focus:border-[#74090A] sm:text-sm 
                        transition-all'
                        required
                    />
                </div>

                <div>
                    <label htmlFor='edit-description' className='block text-sm font-medium text-gray-700 mb-1'>
                        Description
                    </label>
                    <textarea
                        id='edit-description'
                        value={updatedProduct.description}
                        onChange={(e) => setUpdatedProduct({ ...updatedProduct, description: e.target.value })}
                        rows='3'
                        className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                        focus:outline-none focus:ring-1 focus:ring-[#74090A] focus:border-[#74090A] 
                        sm:text-sm transition-all'
                        required
                    />
                </div>

                <div>
                    <label htmlFor='edit-price' className='block text-sm font-medium text-gray-700 mb-1'>
                        Price
                    </label>
                    <input
                        type='number'
                        id='edit-price'
                        value={updatedProduct.price}
                        onChange={(e) => setUpdatedProduct({ ...updatedProduct, price: e.target.value })}
                        step='0.5'
                        className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                        focus:outline-none focus:ring-1 focus:ring-[#74090A] focus:border-[#74090A] sm:text-sm'
                        required
                    />
                </div>

                <div>
                    <label htmlFor='edit-category' className='block text-sm font-medium text-gray-700 mb-1'>
                        Category
                    </label>
                    <select
                        id='edit-category'
                        value={updatedProduct.category}
                        onChange={(e) => setUpdatedProduct({ ...updatedProduct, category: e.target.value })}
                        className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                        focus:outline-none focus:ring-1 focus:ring-[#74090A] focus:border-[#74090A] 
                        sm:text-sm capitalize'
                        required
                    >
                        <option value='' className="capitalize">Select a category</option>
                        {categories.map((category) => (
                            <option key={category} value={category} className="capitalize">
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                <div className='flex items-center pt-2'>
                    <input type='file' id='edit-image' className='sr-only' accept='image/*' onChange={handleImageChange} />
                    <label
                        htmlFor='edit-image'
                        className='cursor-pointer bg-gray-50 py-2 px-4 border border-gray-300 rounded-md shadow-sm 
                        text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors flex items-center'
                    >
                        <Upload className='h-4 w-4 mr-2 text-[#74090A]' />
                        Update Image
                    </label>
                    {updatedProduct.image && (
                        <span className='ml-3 text-xs text-green-600 font-medium'>✓ Image selected</span>
                    )}
                </div>

                {updatedProduct.image && (
                    <div className='mt-2 flex justify-center'>
                        <img src={updatedProduct.image} alt='Preview' className='h-24 w-24 object-cover 
                        rounded-md border border-gray-200 shadow-sm' />
                    </div>
                )}

                <div className="flex gap-4 pt-4">
                    <button
                        type='button'
                        onClick={onCancel}
                        className='flex-1 justify-center py-2.5 px-4 border border-gray-300 rounded-md 
                        shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 
                        focus:outline-none transition-all'
                    >
                        Cancel
                    </button>
                    <button
                        type='submit'
                        className='flex-1 flex justify-center py-2.5 px-4 border border-transparent rounded-md 
                        shadow-sm text-sm font-medium text-white bg-[#74090A] hover:bg-[#5a0708] 
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#74090A] 
                        transition-all disabled:opacity-50'
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader className='mr-2 h-5 w-5 animate-spin' />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className='mr-2 h-5 w-5' />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

export default EditProductForm;