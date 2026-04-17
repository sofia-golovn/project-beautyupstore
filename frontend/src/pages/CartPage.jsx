import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useCartStore } from "../stores/useCartStore";
import CartItem from "../components/CartItem";
import PeopleAlsoBought from "../components/PeopleAlsoBought";
import OrderSummary from "../components/OrderSummary";
import GiftCouponCard from "../components/GiftCouponCard";
import ProductModal from "../components/ProductModal";

const CartPage = () => {
    const { cart, addToCart } = useCartStore();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="py-12 md:py-16 bg-white min-h-screen mt-10">
            <div className="mx-auto max-w-6xl px-6">
                <header className="mb-12 border-b border-neutral-100 pb-8">
                    <span className="text-[9px] uppercase tracking-[0.3em] text-[#74090A] font-bold mb-2 block">
                        Your selection
                    </span>
                    <div className="flex items-baseline justify-between">
                        <h1 className="text-3xl md:text-4xl font-light 
                        tracking-tight text-neutral-900 font-serif lowercase first-letter:uppercase">
                            Shopping Bag
                        </h1>
                        <span className="text-neutral-400 text-[9px] uppercase tracking-[0.2em] font-medium">
                            {cart.length} {cart.length === 1 ? "Item" : "Items"}
                        </span>
                    </div>
                </header>

                <div className="flex flex-col lg:flex-row gap-12 lg:gap-14">
                    <div className="flex-1 min-w-0">
                        {cart.length === 0 ? (
                            <EmptyCartUI />
                        ) : (
                            <>
                                <div
                                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-10 
                                    md:gap-x-8 md:gap-y-12"
                                >
                                    <AnimatePresence>
                                        {cart.map((item) => (
                                            <motion.div
                                                key={item._id}
                                                layout
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                            >
                                                <CartItem
                                                    item={item}
                                                    onOpenModal={(product) => {
                                                        setSelectedProduct(product);
                                                        setIsModalOpen(true);
                                                    }}
                                                />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>

                                <div className="mt-16 pt-12 border-t border-neutral-100">
                                    <PeopleAlsoBought />
                                </div>
                            </>
                        )}
                    </div>

                    {cart.length > 0 && (
                         <aside className="w-full lg:w-[300px] xl:w-[320px] shrink-0">
                            <div className="lg:sticky lg:top-28 space-y-6">
                                <OrderSummary />
                                <GiftCouponCard />
                            </div>
                        </aside>
                    )}
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

export default CartPage;

const EmptyCartUI = () => (
    <div
        className="flex flex-col items-center justify-center py-24 text-center bg-neutral-50/30 rounded-[32px] 
        border border-dashed border-neutral-100"
    >
        <div className="relative mb-6">
            <ShoppingBag className="h-10 w-10 text-neutral-400" strokeWidth={1} />
            <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-[#74090A] rounded-full" />
        </div>
         <h3 className="text-lg font-light text-neutral-700 font-serif">Your bag is empty</h3>
        <p
            className="text-neutral-500 text-[10px] mt-2 mb-8 tracking-wide font-light max-w-[200px] mx-auto 
            leading-relaxed"
        >
            Your self-care journey starts here. Add your essentials to begin.
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