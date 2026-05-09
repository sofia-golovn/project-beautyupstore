import { ShoppingCart, Heart } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";
import { useWishlistStore } from "../stores/useWishlistStore";
import { useUserStore } from "../stores/useUserStore"; 
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const ProductCard = ({ product, isCompact }) => {
    const { addToCart } = useCartStore();
    const { toggleWishlist, isInWishlist } = useWishlistStore();
    const { user } = useUserStore(); 
    
    const isFavorite = isInWishlist(product._id);

    const handleWishlistClick = (e) => {
        e.preventDefault();
        e.stopPropagation(); 
        
        if (!user) {
            toast.error("Please login to add products to your wishlist");
            return;
        }
        toggleWishlist(product);
    };

    const handleCartClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!user) {
            toast.error("Please login to add products to your cart");
            return;
        }
        addToCart(product);
    };

    return (
        <motion.div 
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative bg-white rounded-[24px] overflow-hidden border 
            border-neutral-50 hover:shadow-2xl hover:shadow-neutral-100 transition-all duration-500 w-full"
        >
            <div className="relative aspect-[4/5] overflow-hidden bg-neutral-50">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 
                transition-opacity duration-300" />
                
                <div className={`absolute bottom-3 right-3 md:bottom-4 md:right-4 flex flex-col gap-2 
                translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100
                transition-all duration-500 ${isCompact ? "scale-75 md:scale-100" : ""}`}>
                    <button
                        onClick={handleWishlistClick}
                        className={`p-2.5 md:p-3 rounded-full backdrop-blur-md shadow-sm transition-all duration-300 ${
                            isFavorite 
                            ? "bg-[#74090A] text-white" 
                            : "bg-white/90 text-neutral-600 hover:text-[#74090A]"
                        }`}
                    >
                        <Heart size={18} className={isFavorite ? "fill-white" : "fill-none"} />
                    </button>

                    <button
                        onClick={handleCartClick}
                        className="p-2.5 md:p-3 rounded-full bg-[#74090A] text-white 
                        hover:bg-[#4F0608] backdrop-blur-md shadow-sm transition-all duration-300"
                    >
                        <ShoppingCart size={18} />
                    </button>
                </div>

                {product.category && (
                    <span className="absolute top-3 left-3 md:top-4 md:left-4 text-[7px] md:text-[8px] uppercase 
                    tracking-[0.2em] bg-white/90 backdrop-blur-md text-[#74090A] font-bold px-2 md:px-2.5 py-1
                    rounded-full shadow-sm z-10">
                        {product.category}
                    </span>
                )}
            </div>

            <div className="p-3 md:p-5">
                <h3 className={`font-serif text-neutral-800 mb-1 leading-snug 
                group-hover:text-[#74090A] transition-colors line-clamp-1 ${
                    isCompact ? "text-[10px] md:text-sm" : "text-sm"
                }`}>
                    {product.name}
                </h3>
                <div className="flex justify-between items-center">
                    <p className={`font-medium text-neutral-900 ${
                        isCompact ? "text-[11px] md:text-sm" : "text-sm"
                    }`}>
                        ${product.price}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;