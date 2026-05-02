import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo } from "react";
import { useCartStore } from "../stores/useCartStore";
import { useOrderStore } from "../stores/useOrderStore";

const GiftCouponCard = () => {
    const { 
        coupons, 
        coupon, 
        isCouponApplied, 
        applyCoupon, 
        removeCoupon, 
        total, 
        fetchAllCoupons 
    } = useCartStore();

    const { orders, getUserOrders } = useOrderStore();

    useEffect(() => {
        const loadData = async () => {
            if (typeof fetchAllCoupons === "function") await fetchAllCoupons();
            if (typeof getUserOrders === "function") await getUserOrders();
        };
        loadData();
    }, [fetchAllCoupons, getUserOrders]);

    const visibleCoupons = useMemo(() => {
        if (!coupons || !Array.isArray(coupons)) return [];
        return coupons.filter(c => {
            if (c.isFirstOrderOnly && orders && orders.length > 0) return false;
            if (isCouponApplied && coupon?.code === c.code) return false;
            return true;
        });
    }, [coupons, orders, isCouponApplied, coupon]);

    return (
        <motion.div 
            className="space-y-4 rounded-[24px] border border-neutral-100 bg-white p-6 shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="flex items-center justify-between border-b border-neutral-50 pb-4">
                <h3 className="text-[10px] font-bold uppercase text-neutral-400 tracking-[0.2em]">
                    Available Vouchers
                </h3>
                {isCouponApplied && (
                    <span className="text-[8px] bg-green-50 text-green-600 px-2 py-1 rounded-full font-bold uppercase">
                        Active
                    </span>
                )}
            </div>

            <div className="space-y-3">
                {visibleCoupons.length > 0 ? (
                    visibleCoupons.map((c) => {
                        const isMet = total >= c.minimumPurchaseAmount;
                        const needed = c.minimumPurchaseAmount - total;

                        return (
                            <motion.button
                                key={c._id}
                                disabled={!isMet}
                                onClick={() => applyCoupon(c.code, total)}
                                className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 ${
                                    isMet 
                                    ? "bg-neutral-50 border-dashed border-[#74090A]/20 hover:border-[#74090A] hover:bg-white" 
                                    : "bg-white border-neutral-50 opacity-50 grayscale"
                                }`}
                                whileHover={isMet ? { scale: 1.02 } : {}}
                                whileTap={isMet ? { scale: 0.98 } : {}}
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-bold text-neutral-800 tracking-wide uppercase">
                                        {c.code}
                                    </span>
                                    <span className="text-sm font-serif italic text-[#74090A]">
                                        -{c.discountPercentage}%
                                    </span>
                                </div>
                                
                                <p className="text-[9px] uppercase tracking-tighter font-medium">
                                    {isMet 
                                        ? "Click to apply discount" 
                                        : `Add $${needed.toFixed(2)} more to unlock`
                                    }
                                </p>
                            </motion.button>
                        );
                    })
                ) : !isCouponApplied && (
                    <p className="text-[10px] text-neutral-300 italic text-center py-4">
                        No vouchers available at the moment.
                    </p>
                )}
            </div>

            <AnimatePresence>
                {isCouponApplied && coupon && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="mt-2 bg-neutral-50 p-4 rounded-2xl flex justify-between items-center border border-neutral-100">
                            <div>
                                <p className="text-[7px] text-neutral-400 uppercase font-bold tracking-widest">Applied Voucher</p>
                                <p className="text-neutral-800 text-xs font-bold uppercase tracking-widest">{coupon.code}</p>
                            </div>
                            <button 
                                onClick={removeCoupon} 
                                className="text-[9px] text-[#74090A] font-bold uppercase hover:underline transition-all"
                            >
                                Remove
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default GiftCouponCard;