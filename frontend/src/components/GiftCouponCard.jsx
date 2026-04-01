import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useCartStore } from "../stores/useCartStore";

const GiftCouponCard = () => {
    const [userInputCode, setUserInputCode] = useState("");
    const { coupon, isCouponApplied, applyCoupon, getMyCoupon, removeCoupon } = useCartStore();

    useEffect(() => {
    if (typeof getMyCoupon === "function") {
        getMyCoupon();
    }
    }, [getMyCoupon]);

    useEffect(() => {
        if (coupon && coupon.code) {
            setUserInputCode(coupon.code);
        }
    }, [coupon]);

    const handleApplyCoupon = () => {
        if (!userInputCode) return;
        applyCoupon(userInputCode);
    };

    const handleRemoveCoupon = async () => {
        await removeCoupon();
        setUserInputCode("");
    };

    return (
        <motion.div
            className='space-y-6 rounded-[32px] border border-neutral-100 bg-neutral-50/30 p-6 shadow-sm sm:p-8'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <div className='space-y-4'>
                <div>
					<label htmlFor='voucher' className='mb-3 block text-[10px] uppercase tracking-[0.2em] 
					font-bold text-[#74090A]'>
                        Voucher or Gift Card
                    </label>
                    <input
                        type='text'
                        id='voucher'
                        className='block w-full rounded-xl border border-neutral-200 bg-white 
                        p-3 text-sm text-neutral-900 placeholder-neutral-300 focus:border-[#74090A] 
                        focus:ring-1 focus:ring-[#74090A] outline-none transition-all'
                        placeholder='Enter code here'
                        value={userInputCode}
                        onChange={(e) => setUserInputCode(e.target.value)}
                        required
                    />
                </div>

                <motion.button
                    type='button'
                    className='flex w-full items-center justify-center rounded-xl bg-[#74090A] px-10 py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:bg-neutral-800 transition-all duration-300 shadow-sm'
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleApplyCoupon}
                >
                    Apply Code
                </motion.button>
            </div>

            {isCouponApplied && coupon && (
                <div className='mt-6 pt-6 border-t border-neutral-100'>
                    <h3 className='text-sm font-serif text-neutral-900'>Applied Coupon</h3>
					<div className='mt-2 flex items-center justify-between bg-white border border-[#74090A]/20 
					p-3 rounded-xl'>
                        <p className='text-xs font-medium text-[#74090A] uppercase tracking-wider'>
                            {coupon.code} <span className="text-neutral-400 font-light ml-1">(-{coupon.discountPercentage}%)</span>
                        </p>
                        <button 
                            onClick={handleRemoveCoupon}
							className="text-[10px] font-bold uppercase tracking-tighter text-neutral-400 
							hover:text-red-600 transition-colors"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            )}

            {!isCouponApplied && coupon && (
                <div className='mt-4 p-4 bg-neutral-100/50 rounded-xl border border-dashed border-neutral-200'>
                    <h3 className='text-[10px] uppercase tracking-widest text-neutral-500 mb-1'>Available for you:</h3>
                    <p className='text-xs font-bold text-neutral-800 uppercase'>
                        {coupon.code} <span className="font-normal text-neutral-500">— {coupon.discountPercentage}% OFF</span>
                    </p>
                </div>
            )}
        </motion.div>
    );
};

export default GiftCouponCard;