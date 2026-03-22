import { motion } from "framer-motion";
import { Trash, Star } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";

const ProductsList = () => {
    const { deleteProduct, toggleFeaturedProduct, products } = useProductStore();

    return (
        <motion.div
            className='bg-white shadow-sm rounded-lg max-w-4xl mx-auto border border-gray-100 overflow-hidden'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <div className='overflow-x-auto w-full'>
                <table className='min-w-[700px] w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                        <tr>
                            <th scope='col' className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                                Product
                            </th>
                            <th scope='col' className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                                Price
                            </th>
                            <th scope='col' className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                                Category
                            </th>
                            <th scope='col' className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                                Featured
                            </th>
                            <th scope='col' className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className='bg-white divide-y divide-gray-100'>
                        {products?.map((product) => (
                            <tr key={product._id} className='hover:bg-gray-50 transition-colors'>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='flex items-center'>
                                        <div className='flex-shrink-0 h-10 w-10 border border-gray-100 rounded-full'>
                                            <img
                                                className='h-10 w-10 rounded-full object-cover'
                                                src={product.image}
                                                alt={product.name}
                                            />
                                        </div>
                                        <div className='ml-4'>
                                            <div className='text-sm font-medium text-gray-900'>{product.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm font-medium text-[#74090A]'>${product.price.toFixed(2)}</div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-600 capitalize'>
                                        {product.category}
                                    </span>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <button
                                        onClick={() => toggleFeaturedProduct(product._id)}
                                        className={`p-1.5 rounded-full transition-all duration-200 ${
                                            product.isFeatured 
                                                ? "bg-amber-100 text-amber-500 shadow-sm" 
                                                : "bg-gray-100 text-gray-400 hover:text-amber-400"
                                        }`}
                                    >
                                        <Star className={`h-4 w-4 ${product.isFeatured ? "fill-current" : ""}`} />
                                    </button>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                                    <button
                                        onClick={() => deleteProduct(product._id)}
                                        className='text-gray-400 hover:text-[#74090A] transition-colors p-1.5 rounded-md hover:bg-red-50'
                                    >
                                        <Trash className='h-4 w-4' />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default ProductsList;