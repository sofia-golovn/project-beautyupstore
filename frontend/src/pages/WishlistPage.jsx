import { useState } from "react";
import { Link } from "react-router-dom";

import { useWishlistStore } from "../stores/useWishlistStore";
import { useCartStore } from "../stores/useCartStore";
import ProductModal from "../components/ProductModal";

import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";

const EmptyWishlistUI = () => (
    <div
        className="flex flex-col items-center justify-center py-24 text-center bg-neutral-50/30 rounded-[32px] 
        border border-dashed border-neutral-100"
    >
        <div className="relative mb-6">
            <Heart className="h-10 w-10 text-neutral-400" strokeWidth={1} />
            <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-[#74090A] rounded-full" />
        </div>
        <h3 className="text-lg font-light text-neutral-700 font-serif">Your wishlist is empty</h3>
        <p
            className="text-neutral-500 text-[10px] mt-2 mb-8 tracking-wide font-light max-w-[200px] mx-auto 
            leading-relaxed"
        >
            Save your favorite beauty essentials here for your future rituals.
        </p>
        <Link
            className="inline-block bg-[#74090A] text-white px-10 py-3 rounded-full text-[9px] font-bold uppercase 
            tracking-[0.2em] hover:bg-black transition-all duration-500"
            to="/category"
        >
            Discover products
        </Link>
    </div>
);

const WishlistPage = () => {
    const { wishlist, removeFromWishlist } = useWishlistStore();
    const { addToCart } = useCartStore();
     const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className='py-12 md:py-16 bg-white min-h-screen mt-10'>
            <div className='mx-auto max-w-6xl px-6'>
                
                <header className="mb-12 border-b border-neutral-100 pb-8">
                    <span className="text-[9px] uppercase tracking-[0.3em] text-[#74090A] font-bold mb-2 block">
                        Saved for later
                    </span>
                    <div className="flex items-baseline justify-between">
                        <h1 className='text-3xl md:text-4xl font-light 
                          tracking-tight text-neutral-900 font-serif lowercase first-letter:uppercase'>
                            My Wishlist
                        </h1>
                        <span className="text-neutral-400 text-[9px] uppercase tracking-[0.2em] font-medium">
                            {wishlist.length} {wishlist.length === 1 ? 'Item' : 'Items'}
                        </span>
                    </div>
                </header>

                <div className='flex flex-col'>
                    <div className='flex-1'>
                        {wishlist.length === 0 ? (
                            <EmptyWishlistUI />
                        ) : (
                                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 
                            md:gap-x-8 md:gap-y-12'>
                                <AnimatePresence>
                                    {wishlist.map((product) => (
                                        <motion.div 
                                            key={product._id} 
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            role="button"
                                            tabIndex={0}
                                            onClick={() => {
                                                setSelectedProduct(product);
                                                setIsModalOpen(true);
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" || e.key === " ") {
                                                    e.preventDefault();
                                                    setSelectedProduct(product);
                                                    setIsModalOpen(true);
                                                }
                                            }}
                                            className="group relative flex flex-col h-full cursor-pointer"
                                        >
                                            <div className="aspect-[3/4] overflow-hidden bg-neutral-50 
                                            rounded-[18px] relative mb-4">
                                                <img 
                                                    src={product.image} 
                                                    alt={product.name}
                                                    className="w-full h-full object-cover transition-transform 
                                                    duration-700 group-hover:scale-105"
                                                />
                                                <button 
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeFromWishlist(product._id);
                                                    }}
                                                    className="absolute top-3 right-3 p-2 bg-white/80 
                                                    backdrop-blur-md rounded-full text-neutral-400 hover:text-[#74090A] transition-all shadow-sm opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>

                                            <div className="flex flex-col flex-grow mb-4">
                                                <span className="text-[8px] uppercase tracking-widest 
                                                text-[#74090A] font-bold block mb-1">
                                                    {product.category}
                                                </span>
                                                <h3 className="text-sm md:text-base font-serif text-neutral-900 
                                                leading-snug line-clamp-2">
                                                    {product.name}
                                                </h3>
                                                <p className="text-sm font-medium text-neutral-600 mt-1">
                                                    ${product.price}
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    addToCart(product);
                                                }}
                                                className="w-full flex items-center justify-center 
                                                gap-2 bg-[#74090A] text-white py-3 rounded-lg text-[9px] 
                                                font-bold uppercase tracking-widest hover:bg-[#4F0608] 
                                                transition-all duration-300 shadow-sm active:scale-[0.96]"
                                            >
                                                <ShoppingBag size={12} />
                                                Add to Cart
                                            </button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ProductModal
                product={selectedProduct}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddToCart={addToCart}
            />
        </div>
    );
};

export default WishlistPage;