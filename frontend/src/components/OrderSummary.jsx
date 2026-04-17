import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "../lib/axios";

const stripePromise = loadStripe(
    "pk_test_51KZYccCoOZF2UhtOwdXQl3vcizup20zqKqT9hVUIsVzsdBrhqbUI2fE0ZdEVLdZfeHjeyFXtqaNsyCJCmZWnjNZa00PzMAjlcL"
);

const OrderSummary = () => {
    const { total, subtotal, coupon, isCouponApplied, cart } = useCartStore();

    const savings = subtotal - total;
    const formattedSubtotal = subtotal.toFixed(2);
    const formattedTotal = total.toFixed(2);
    const formattedSavings = savings.toFixed(2);

    const handlePayment = async () => {
        const stripe = await stripePromise;
        const res = await axios.post("/payments/create-checkout-session", {
            products: cart,
            couponCode: coupon ? coupon.code : null,
        });

        const session = res.data;
        const result = await stripe.redirectToCheckout({
            sessionId: session.id,
        });

        if (result.error) {
            console.error("Error:", result.error);
        }
    };

    return (
        <motion.div
            className="space-y-6 rounded-[18px] border border-neutral-100 bg-white p-6 shadow-sm sm:p-7"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h3 className="mb-1 block text-[9px] uppercase tracking-[0.3em] font-bold text-[#74090A]">
                Order summary
            </h3>

            <div className='space-y-4'>
                <div className='space-y-3'>
                    <dl className='flex items-center justify-between gap-4'>
                        <dt className='text-sm font-light text-neutral-500'>Subtotal</dt>
                        <dd className='text-sm font-medium text-neutral-900'>${formattedSubtotal}</dd>
                    </dl>

                    {savings > 0 && (
                        <dl className='flex items-center justify-between gap-4'>
                            <dt className='text-sm font-light text-neutral-500'>Savings</dt>
                            <dd className='text-sm font-bold text-[#74090A]'>-${formattedSavings}</dd>
                        </dl>
                    )}

                    {coupon && isCouponApplied && (
                        <dl className='flex items-center justify-between gap-4'>
                            <dt className='text-sm font-light text-neutral-500 italic'>Coupon applied ({coupon.code})</dt>
                            <dd className='text-sm font-bold text-[#74090A]'>-{coupon.discountPercentage}%</dd>
                        </dl>
                    )}
                    
                    <dl className='flex items-center justify-between gap-4 border-t border-neutral-100 pt-4 mt-4'>
                        <dt className='text-base font-medium text-neutral-900'>Total</dt>
                        <dd className='text-lg font-bold text-[#74090A]'>${formattedTotal}</dd>
                    </dl>
                </div>

                <div className="pt-4 space-y-4">
                    <motion.button
                        className="flex w-full items-center justify-center rounded-lg bg-[#74090A] px-8 
                        py-3.5 text-[9px] font-bold uppercase tracking-widest text-white 
                        hover:bg-[#4F0608] transition-all duration-300 shadow-sm active:scale-[0.98] focus:outline-none"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handlePayment}
                    >
                        Proceed to Checkout
                    </motion.button>

                    <div className='flex items-center justify-center gap-3'>
                        <span className="text-[9px] uppercase tracking-widest text-neutral-400">or</span>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-[9px] 
                            font-bold uppercase tracking-[0.2em] text-neutral-900 hover:text-[#74090A] transition-colors"
                        >
                            Continue Shopping
                            <MoveRight size={14} />
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
export default OrderSummary;