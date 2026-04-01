import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const ProductCard = ({ product }) => {
    const { user } = useUserStore();
    const { addToCart } = useCartStore();

    const handleAddToCart = (e) => {
        e.stopPropagation(); 
        
        if (!user) {
            toast.error("Please login to add products to cart", { id: "login" });
            return;
        }
        addToCart(product);
    };

    return (
        <div className='flex w-full relative flex-col overflow-hidden rounded-[30px] 
        bg-white border border-neutral-100 shadow-sm hover:shadow-xl transition-all duration-500 group'>
            
            <div className='relative mx-4 mt-4 flex h-72 overflow-hidden rounded-[25px] bg-neutral-100'>
                <img 
                    className='object-cover w-full h-full transition-transform duration-700 group-hover:scale-110' 
                    src={product.image} 
                    alt={product.name} 
                />
                <div className='absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity 
                duration-500' />
            </div>

            <div className='mt-5 px-6 pb-6'>
                <div className="mb-2">
                    <span className="text-[10px] uppercase tracking-widest text-[#74090A] font-bold">
                        {product.category || "Premium Collection"}
                    </span>
                </div>
                
                <h5 className='text-xl font-medium tracking-tight text-neutral-900 font-sans truncate'>
                    {product.name}
                </h5>

                <div className='mt-4 flex items-center justify-between'>
                    <p className="flex flex-col">
                        <span className='text-2xl font-bold text-black'>${product.price}</span>
                    </p>
                    
                    <button
                        className='flex items-center justify-center rounded-full bg-[#74090A] p-3 text-white 
                                   hover:bg-black transition-colors duration-300 shadow-lg shadow-red-900/20'
                        onClick={handleAddToCart} 
                        title="Add to cart"
                    >
                        <ShoppingCart size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;