import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useCartStore } from "../stores/useCartStore";

const GiftCouponCard = () => {
    const [userInputCode, setUserInputCode] = useState("");
    
    const { 
        coupons, 
        coupon, 
        isCouponApplied, 
        applyCoupon, 
        getMyCoupon, 
        removeCoupon, 
        total 
    } = useCartStore();

    useEffect(() => {
        if (typeof getMyCoupon === "function") {
            getMyCoupon();
        }
    }, [getMyCoupon]);

    useEffect(() => {
        if (coupon && coupon.code) {
            setUserInputCode(coupon.code);
        } else if (!isCouponApplied) {
            setUserInputCode("");
        }
    }, [coupon, isCouponApplied]);

    const handleApplyCoupon = () => {
        if (!userInputCode) return;
        applyCoupon(userInputCode, total);
    };

    const handleRemoveCoupon = async () => {
        await removeCoupon();
        setUserInputCode("");
    };

    return (
        <motion.div 
            className="space-y-6 rounded-[18px] border border-neutral-100 bg-white p-6 shadow-sm sm:p-7"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <div className="space-y-4">
                <div>
                    <label className="mb-2 block text-[9px] uppercase tracking-[0.3em] font-bold text-[#74090A]">
                        Voucher or gift card
                    </label>
                    <input
                        type='text'
                        id='voucher'
                        className='block w-full rounded-xl border border-neutral-200 bg-white p-3 text-sm t
                        ext-neutral-900 placeholder-neutral-300 focus:border-[#74090A] focus:ring-1 
                        focus:ring-[#74090A] outline-none transition-all'
                        placeholder='Enter code here'
                        value={userInputCode || ""} 
                        onChange={(e) => setUserInputCode(e.target.value)}
                    />
                </div>

                <motion.button
                    type="button"
                    className="flex w-full items-center justify-center rounded-lg bg-[#74090A] 
                    py-3 text-[9px] font-bold uppercase tracking-widest text-white 
                    hover:bg-[#4F0608] transition-all duration-300 shadow-sm active:scale-[0.98]"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleApplyCoupon}
                >
                    Apply Code
                </motion.button>
            </div>

            {!isCouponApplied && coupons && coupons.length > 0 && (
                <div className='mt-4 space-y-3'>
                    <h3 className='text-[9px] uppercase tracking-[0.3em] font-bold text-neutral-400 mb-1'>
                        Available for you:
                    </h3>
                    {coupons.map((c) => (
                        <motion.div 
                            key={c._id}
                            onClick={() => setUserInputCode(c.code)}
                            className='p-4 bg-neutral-50 rounded-xl border border-dashed 
                            border-neutral-200 cursor-pointer hover:border-[#74090A]/40 transition-all 
                            group relative overflow-hidden'
                            whileHover={{ x: 4 }}
                        >
                            <div className="flex justify-between items-center">
                                <p className='text-xs font-bold text-neutral-800 uppercase tracking-widest'>
                                    {c.code} <span
                                        className="font-normal text-neutral-500 ml-1">— {c.discountPercentage}% OFF
                                    </span>
                                </p>
                                <span className="text-[8px] text-[#74090A] font-bold opacity-0 
                                group-hover:opacity-100 transition-opacity uppercase">
                                    Use
                                </span>
                            </div>
                            
                            <div className="flex gap-2 mt-1">
                                {c.isFirstOrderOnly && (
                                    <span className="text-[7px] text-green-600 font-bold uppercase 
                                    px-1.5 py-0.5 bg-green-50 rounded">
                                        First Order
                                    </span>
                                )}
                                {c.minimumPurchaseAmount > 0 && (
                                    <p className="text-[7px] text-blue-600 font-bold uppercase px-1.5 
                                    py-0.5 bg-blue-50 rounded">
                                        Orders over ${c.minimumPurchaseAmount}
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {isCouponApplied && coupon && (
                <div className='mt-6 pt-6 border-t border-neutral-100'>
                    <h3 className='text-[9px] uppercase tracking-[0.3em] font-bold text-neutral-900 mb-2'>
                        Applied Coupon
                    </h3>
                    <div className='flex items-center justify-between bg-white border 
                    border-[#74090A]/20 p-3 rounded-xl'>
                        <p className='text-xs font-medium text-[#74090A] uppercase tracking-wider'>
                            {coupon.code} <span
                                className="text-neutral-400 font-light ml-1">(-{coupon.discountPercentage}%)</span>
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
        </motion.div>
    );
};

export default GiftCouponCard;