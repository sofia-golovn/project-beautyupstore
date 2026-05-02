import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { useCartStore } from "../stores/useCartStore";
import { useOrderStore } from "../stores/useOrderStore";

const GiftCouponCard = () => {
    const [userInputCode, setUserInputCode] = useState("");
    
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

    useEffect(() => {
        if (coupon) setUserInputCode(coupon.code);
        else if (!isCouponApplied) setUserInputCode("");
    }, [coupon, isCouponApplied]);

    const handleApply = (code) => {
        const finalCode = code || userInputCode;
        if (finalCode) applyCoupon(finalCode, total);
    };

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
            className="space-y-6 rounded-[20px] border border-neutral-100 bg-white p-6 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            {/* Поле введення коду */}
            <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-[#74090A]">
                    Promo Code
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        className="flex-1 rounded-xl border border-neutral-200 p-3 text-sm outline-none 
                        focus:border-[#74090A] transition-all"
                        placeholder="Enter code"
                        value={userInputCode}
                        onChange={(e) => setUserInputCode(e.target.value)}
                    />
                    <button 
                        onClick={() => handleApply()} 
                        className="bg-[#74090A] text-white px-5 rounded-xl text-[10px] font-bold uppercase 
                        hover:bg-neutral-800 transition-all active:scale-95"
                    >
                        Apply
                    </button>
                </div>
            </div>

            <div className="space-y-3">
                <h3 className="text-[9px] font-bold uppercase text-neutral-400 tracking-widest">
                    Offers for you
                </h3>
                
                {visibleCoupons.length > 0 ? (
                    visibleCoupons.map((c) => {
                        const isMet = total >= c.minimumPurchaseAmount;
                        const needed = c.minimumPurchaseAmount - total;

                        return (
                            <motion.div 
                                key={c._id}
                                onClick={() => isMet && handleApply(c.code)}
                                className={`p-4 rounded-2xl border transition-all ${
                                    isMet 
                                    ? "bg-neutral-50 border-dashed border-[#74090A]/30 cursor-pointer hover:bg-white shadow-sm" 
                                    : "bg-white border-neutral-50 opacity-60 cursor-not-allowed"
                                }`}
                                whileHover={isMet ? { x: 5 } : {}}
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                                        {c.code}
                                    </span>
                                    <span className="text-xs font-bold text-[#74090A]">
                                        -{c.discountPercentage}%
                                    </span>
                                </div>
                                
                                {isMet ? (
                                    <p className="text-[8px] text-green-600 font-bold uppercase tracking-tighter">
                                        Available • Click to use
                                    </p>
                                ) : (
                                    <p className="text-[8px] text-neutral-400 font-medium">
                                        Add <span className="font-bold text-[#74090A]">${needed.toFixed(2)}</span> to unlock this deal
                                    </p>
                                )}
                            </motion.div>
                        );
                    })
                ) : (
                    <p className="text-[10px] text-neutral-300 italic">
                        No additional coupons available for your account.
                    </p>
                )}
            </div>

            {isCouponApplied && coupon && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 bg-neutral-100 p-4 rounded-2xl flex justify-between items-center border 
                    border-neutral-200 shadow-sm"
                >
                    <div>
                        <p className="text-[7px] text-neutral-400 uppercase font-bold tracking-widest">Active Discount</p>
                        <p className="text-neutral-800 text-xs font-bold uppercase tracking-widest">{coupon.code}</p>
                    </div>
                    <button 
                        onClick={removeCoupon} 
                        className="text-[9px] text-[#74090A] font-bold uppercase hover:text-neutral-900 
                        transition-colors"
                    >
                        Remove
                    </button>
                </motion.div>
            )}
        </motion.div>
    );
};

export default GiftCouponCard;