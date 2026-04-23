import { useState, useEffect } from "react";
import { useCouponStore } from "../stores/useCouponStore";
import { Plus, Trash2, Loader, Percent, Calendar, Tag, Ticket, CircleDollarSign, UserPlus } from "lucide-react";
import { motion } from "framer-motion";

const CouponManager = () => {
    const [formData, setFormData] = useState({ 
        code: "", 
        discountPercentage: "", 
        expirationDate: "",
        minimumPurchaseAmount: "",
        isFirstOrderOnly: false
    });
    
    const { coupons, fetchAllCoupons, createCoupon, deleteCoupon, loading } = useCouponStore();

    useEffect(() => {
        fetchAllCoupons();
    }, [fetchAllCoupons]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createCoupon(formData);
        setFormData({ code: "", discountPercentage: "", expirationDate: "", minimumPurchaseAmount: "", isFirstOrderOnly: false });
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="bg-white p-8 rounded-[24px] border border-neutral-100 shadow-sm"
            >
                <div className="flex items-center gap-3 mb-8">
                    <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#74090A]">
                        Coupon Management
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-1">
                            <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-gray-400 ml-1">
                                Code
                            </label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-3 h-4 w-4 text-gray-300" />
                                <input
                                    type="text" placeholder="WELCOME20" required
                                    className="w-full pl-10 pr-3 py-2.5 border border-neutral-200 rounded-xl 
                                    focus:ring-1 focus:ring-[#74090A] outline-none"
                                    value={formData.code} 
                                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-gray-400 ml-1">
                                Discount %
                            </label>
                            <div className="relative">
                                <Percent className="absolute left-3 top-3 h-4 w-4 text-gray-300" />
                                <input
                                    type="number" placeholder="15" required
                                    className="w-full pl-10 pr-3 py-2.5 border border-neutral-200 rounded-xl 
                                    focus:ring-1 focus:ring-[#74090A] outline-none"
                                    value={formData.discountPercentage} 
                                    onChange={(e) => setFormData({...formData, discountPercentage: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-gray-400 ml-1">
                                Expiry Date
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-300" />
                                <input
                                    type="date" required
                                    className="w-full pl-10 pr-3 py-2.5 border border-neutral-200 rounded-xl 
                                    focus:ring-1 focus:ring-[#74090A] outline-none"
                                    value={formData.expirationDate} 
                                    onChange={(e) => setFormData({...formData, expirationDate: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-50">
                        <div className="space-y-1">
                            <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-gray-400 ml-1">
                                Min Purchase Amount ($)
                            </label>
                            <div className="relative">
                                <CircleDollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-300" />
                                <input
                                    type="number" placeholder="300"
                                    className="w-full pl-10 pr-3 py-2.5 border border-neutral-200 rounded-xl 
                                    focus:ring-1 focus:ring-[#74090A] outline-none"
                                    value={formData.minimumPurchaseAmount} 
                                    onChange={(e) => setFormData({...formData, minimumPurchaseAmount: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="flex items-end">
                            <label className="flex items-center gap-3 cursor-pointer group bg-neutral-50 
                            p-2.5 rounded-xl border border-neutral-100 w-full hover:border-[#74090A]/30 transition-all">
                                <input 
                                    type="checkbox" 
                                    className="hidden" 
                                    checked={formData.isFirstOrderOnly}
                                    onChange={(e) => setFormData({...formData, isFirstOrderOnly: e.target.checked})}
                                />
                                <div className={`w-5 h-5 rounded border flex items-center justify-center 
                                    transition-all ${formData.isFirstOrderOnly ? 'bg-[#74090A] border-[#74090A]' 
                                    :
                                    'border-neutral-300'}`}>
                                    {formData.isFirstOrderOnly && <Plus className="text-white w-3 h-3 rotate-45" />}
                                </div>
                                <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-500">
                                    First Order Only
                                </span>
                                <UserPlus size={14} className="ml-auto text-gray-400" />
                            </label>
                        </div>
                    </div>

                    <button 
                        disabled={loading} 
                        className="w-full bg-[#74090A] text-white rounded-xl py-3 text-[10px] uppercase 
                        font-bold tracking-[0.2em] hover:bg-[#5a0708] transition-all shadow-sm"
                    >
                        {loading ? <Loader className="animate-spin mx-auto" /> : "Create Advanced Coupon"}
                    </button>
                </form>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coupons.map((coupon) => (
                    <div key={coupon._id} className="bg-white p-6 rounded-[22px] border border-neutral-100 
                    shadow-sm relative overflow-hidden">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-2xl font-serif text-neutral-900">{coupon.code}</p>
                            <button onClick={() => deleteCoupon(coupon._id)} className="text-gray-300 
                            hover:text-red-500 transition-colors">
                                <Trash2 size={18} />
                            </button>
                        </div>
                        <div className="space-y-2">
                            <p className="text-3xl font-light text-[#74090A]">{coupon.discountPercentage}% OFF</p>
                            
                            <div className="flex flex-wrap gap-2 mt-4">
                                {coupon.minimumPurchaseAmount > 0 && (
                                    <span className="text-[8px] bg-blue-50 text-blue-600 px-2 py-1 
                                    rounded-full font-bold uppercase">
                                        Min: ${coupon.minimumPurchaseAmount}
                                    </span>
                                )}
                                {coupon.isFirstOrderOnly && (
                                    <span className="text-[8px] bg-green-50 text-green-600 px-2 
                                    py-1 rounded-full font-bold uppercase">
                                        New Client
                                    </span>
                                )}
                            </div>
                            
                            <p className="text-[10px] text-gray-400 uppercase tracking-tighter">
                                Expires: {new Date(coupon.expirationDate).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CouponManager;