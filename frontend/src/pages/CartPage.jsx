import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import CartItem from "../components/CartItem";
import PeopleAlsoBought from "../components/PeopleAlsoBought";
import OrderSummary from "../components/OrderSummary";
import GiftCouponCard from "../components/GiftCouponCard";

const CartPage = () => {
    const { cart } = useCartStore();

    return (
        <div className='py-12 md:py-20 bg-white min-h-screen'>
            <div className='mx-auto max-w-6xl px-6'>
                
                <header className="mb-16 border-b border-neutral-100 pb-10">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-[#74090A] font-bold mb-3 block">
                        Your Selection
                    </span>
                    <div className="flex items-baseline justify-between">
                        <h1 className='text-4xl md:text-5xl font-light tracking-tight text-neutral-900 font-serif lowercase first-letter:uppercase'>
                            Shopping Bag
                        </h1>
                        <span className="text-neutral-400 text-[10px] uppercase tracking-[0.2em] font-medium">
                            {cart.length} {cart.length === 1 ? 'Product' : 'Products'}
                        </span>
                    </div>
                </header>

                <div className='flex flex-col lg:flex-row gap-16 xl:gap-24'>
                    <div className='flex-1'>
                        {cart.length === 0 ? (
                            <EmptyCartUI />
                        ) : (
                            <div className='divide-y divide-neutral-50'>
                                {cart.map((item) => (
                                    <motion.div 
                                        key={item._id} 
                                        className="py-10 first:pt-0"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        <CartItem item={item} />
                                    </motion.div>
                                ))}
                            </div>
                        )}
                        
                        {cart.length > 0 && (
                            <div className="mt-24 pt-16 border-t border-neutral-50">
                                <PeopleAlsoBought />
                            </div>
                        )}
                    </div>

                    {cart.length > 0 && (
                        <aside className='lg:w-[340px]'>
                            <div className="sticky top-28 space-y-8">
                                <div className="p-1 border border-neutral-50 rounded-[32px]">
                                    <OrderSummary />
                                </div>
                                <GiftCouponCard />
                            </div>
                        </aside>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CartPage;

const EmptyCartUI = () => (
    <div className='flex flex-col items-center justify-center py-32 text-center bg-neutral-50/50 rounded-[40px]'>
        <div className="relative mb-8">
            <ShoppingBag className='h-12 w-12 text-neutral-600' strokeWidth={1} />
            <div className="absolute top-0 right-0 w-2 h-2 bg-[#74090A] rounded-full" />
        </div>
        <h3 className='text-xl font-light text-neutral-700 font-serif'>Your bag is empty</h3>
		<p className='text-neutral-800 text-xs mt-3 mb-12 tracking-wide font-light
		 max-w-[220px] mx-auto leading-relaxed'>
            Your self-care journey starts here. Add your essentials to begin.
        </p>
        <Link
			className='inline-block bg-[#74090A] text-white px-12 py-4 rounded-xl text-[10px] 
			font-bold uppercase tracking-[0.2em] hover:bg-[#5b0708] transition-all duration-500 
			hover:shadow-lg active:scale-95'
			to='/category'
		>
			Explore catalog
		</Link>
    </div>
);