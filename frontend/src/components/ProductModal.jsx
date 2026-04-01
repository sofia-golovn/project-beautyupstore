import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Tag } from "lucide-react";

const ProductModal = ({ product, isOpen, onClose, onAddToCart }) => {
    if (!product) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
                    />

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="relative w-full max-w-2xl bg-white rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
                    >
                        <button 
                            onClick={onClose}
                            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-[#74090A] hover:text-white transition-all shadow-sm"
                        >
                            <X size={18} />
                        </button>

                        <div className="md:w-2/5 min-h-[300px] md:h-auto bg-neutral-50">
                            <img 
                                src={product.image} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="md:w-3/5 p-6 md:p-10 flex flex-col">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-[9px] uppercase tracking-[0.2em] text-[#74090A] font-bold px-2 py-0.5 border border-[#74090A]/20 rounded-full">
                                    {product.category}
                                </span>
                            </div>

                            <h2 className="text-2xl md:text-3xl font-serif text-neutral-900 mb-4 leading-tight">
                                {product.name}
                            </h2>

                            <div className="overflow-y-auto pr-2 mb-6 max-h-[150px] custom-scrollbar">
                                <p className="text-sm text-neutral-500 font-light leading-relaxed">
                                    {product.description}
                                </p>
                            </div>

                            <div className="mt-auto pt-6 border-t border-neutral-100 flex items-center justify-between">
                                <div>
                                    <span className="text-[10px] text-neutral-400 block uppercase tracking-widest">Price</span>
                                    <span className="text-xl font-medium text-neutral-900">${product.price}</span>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => {
                                        onAddToCart(product);
                                        onClose();
                                    }}
                                    className="flex items-center gap-2 bg-[#74090A] text-white px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-colors shadow-md"
                                >
                                    <ShoppingBag size={14} />
                                    Add
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ProductModal;