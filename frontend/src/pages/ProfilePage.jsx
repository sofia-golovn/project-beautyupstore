import { useEffect, useState } from "react";
import { useUserStore } from "../stores/useUserStore";
import { useOrderStore } from "../stores/useOrderStore";
import { useCartStore } from "../stores/useCartStore"; 
import { LogOut, Mail, MapPin, ChevronLeft, ChevronRight, Package, CheckCircle2, Circle, Phone } from "lucide-react";
import ProductModal from "../components/ProductModal";

const ProfilePage = () => {
    const { user, logout, checkAuth, checkingAuth } = useUserStore();
    const { orders, getUserOrders, loading, totalPages, currentPage } = useOrderStore();
    const { addToCart } = useCartStore(); 
    
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); 

    useEffect(() => {
        if (user && !user.name) {
            checkAuth();
        }
    }, [user, checkAuth]);

    const handlePageChange = (page) => {
        getUserOrders(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleOpenModal = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const orderSteps = ["Paid", "Packed", "Shipped", "Delivered"];
    const getStepIndex = (status) => orderSteps.indexOf(status);

    if (checkingAuth) {
        return (
            <div className="h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#74090A]"></div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20 min-h-screen font-sans bg-white">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end 
            border-b border-neutral-100 pb-8 sm:pb-10 mb-8 sm:mb-12 gap-6">
                <div className="w-full sm:w-auto">
                    <h1 className="text-3xl sm:text-4xl font-serif font-light text-neutral-900 capitalize mb-3">
                        {user?.name || "Guest User"}
                    </h1>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 
                    text-neutral-400 text-sm tracking-wide">
                        <div className="flex items-center gap-2">
                            <Mail size={14} className="text-neutral-300" />
                            <span className="truncate">{user?.email}</span>
                        </div>
                        {user?.phone && (
                            <div className="flex items-center gap-2">
                                <Phone size={14} className="text-neutral-300" />
                                <span>{user?.phone}</span>
                            </div>
                        )}
                    </div>
                </div>
                
                <button 
                    onClick={logout}
                    className="group flex items-center gap-2 px-6 py-3 bg-neutral-50 
                    hover:bg-[#74090A] border border-neutral-200 hover:border-[#74090A] rounded-full 
                    text-neutral-500 hover:text-white transition-all duration-300 text-[10px] font-bold 
                    uppercase tracking-[0.2em] w-full sm:w-auto justify-center shadow-sm hover:shadow-md"
                >
                    <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Log Out
                </button>
            </div>

            <div className="space-y-8 sm:space-y-12">
                <div className="flex items-center gap-3">
                    <Package className="text-neutral-200" size={24} />
                    <h2 className="text-2xl font-serif text-neutral-800">Order History</h2>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-neutral-300 uppercase text-[10px] 
                    tracking-widest animate-pulse">
                        Loading your history...
                    </div>
                ) : orders.length > 0 ? (
                    <div className="space-y-12 sm:space-y-16">
                        {orders.map((order) => (
                            <div key={order._id} className="relative">
                                <div className="flex flex-col lg:flex-row justify-between mb-6 gap-6">
                                    <div>
                                        <div className="text-[10px] font-bold text-neutral-300 uppercase 
                                        tracking-widest mb-1">Order Number</div>
                                        <div className="text-sm font-medium text-neutral-600 font-mono">
                                            #{order._id.slice(-10).toUpperCase()}
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between sm:justify-start gap-1 
                                    sm:gap-2 bg-neutral-50 sm:bg-transparent p-3 sm:p-0 rounded-xl">
                                        {orderSteps.map((step, index) => {
                                            const isCompleted = index <= getStepIndex(order.status);
                                            return (
                                                <div key={step} className="flex items-center">
                                                    <div className="flex flex-col items-center gap-1">
                                                        <div className={`transition-all duration-500 ${isCompleted ? "text-[#74090A]" : "text-neutral-200"}`}>
                                                            {isCompleted ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                                                        </div>
                                                        <span className={`text-[7px] sm:text-[8px] uppercase font-bold 
                                                            tracking-tighter ${isCompleted ? "text-neutral-800" : "text-neutral-200"}`}>
                                                            {step}
                                                        </span>
                                                    </div>
                                                    {index !== orderSteps.length - 1 && (
                                                        <div className={`w-4 sm:w-8 lg:w-12 h-[1px] mb-4 mx-0.5 
                                                        sm:mx-1 ${index < getStepIndex(order.status) ?
                                                        "bg-[#74090A]" : "bg-neutral-200"}`} />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="bg-white border border-neutral-100 rounded-3xl p-5 sm:p-8 
                                hover:shadow-2xl hover:shadow-neutral-200/40 transition-all duration-500">
                                    <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
                                        
                                        <div className="space-y-5">
                                            <div className="text-[10px] font-bold text-neutral-300 uppercase 
                                            tracking-widest border-b border-neutral-50 pb-2">Items</div>
                                            {order.products.map((item, idx) => (
                                                <div key={idx} className="flex gap-4 items-center">
                                                    <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0">
                                                        <img 
                                                            src={item.product?.image} 
                                                            alt="" 
                                                            className="w-full h-full object-cover rounded-2xl 
                                                            bg-neutral-50 shadow-sm"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <button 
                                                            onClick={() => handleOpenModal(item.product)}
                                                            className="text-sm font-medium text-neutral-800 
                                                            hover:text-[#74090A] transition-colors text-left block 
                                                            truncate w-full"
                                                        >
                                                            {item.product?.name}
                                                        </button>
                                                        <div className="text-[10px] text-neutral-400 mt-1">
                                                            <span className="font-bold text-neutral-500">Qty: {item.quantity}</span> — ${item.price}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="pt-4 border-t border-neutral-50 mt-4 flex justify-between items-baseline">
                                                <span className="text-xs uppercase tracking-widest text-neutral-300 font-bold">Total Paid</span>
                                                <span className="text-2xl font-serif text-[#74090A]">${order.totalAmount}</span>
                                            </div>
                                        </div>

                                        <div className="bg-neutral-50/50 rounded-2xl p-5 sm:p-6 self-start space-y-4">
                                            <div className="flex gap-3">
                                                <MapPin size={18} className="text-[#74090A] flex-shrink-0 mt-1" />
                                                <div className="text-sm">
                                                    <div className="font-bold text-neutral-800 mb-1 uppercase text-[9px] tracking-widest">Shipping To</div>
                                                    {/* Ім'я отримувача зі Stripe, якщо воно було збережене */}
                                                    {order.shippingName && <p className="font-bold text-neutral-700 text-xs">{order.shippingName}</p>}
                                                    <p className="text-neutral-500 leading-relaxed font-light">{order.shippingAddress}</p>
                                                    {order.phone && <p className="text-[#74090A] font-bold text-[10px] mt-2">{order.phone}</p>}
                                                </div>
                                            </div>
                                            <div className="text-[9px] text-neutral-300 font-bold uppercase tracking-[0.2em] pt-4 border-t border-neutral-100 flex justify-between">
                                                <span>Date:</span>
                                                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-6 sm:gap-10 py-10">
                                <button 
                                    onClick={() => handlePageChange(currentPage - 1)} 
                                    disabled={currentPage === 1} 
                                    className="p-2 disabled:opacity-20 hover:text-[#74090A] transition-all bg-neutral-50 rounded-full"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <span className="text-[10px] font-bold tracking-[0.3em] text-neutral-400 uppercase">
                                    {currentPage} / {totalPages}
                                </span>
                                <button 
                                    onClick={() => handlePageChange(currentPage + 1)} 
                                    disabled={currentPage === totalPages} 
                                    className="p-2 disabled:opacity-20 hover:text-[#74090A] transition-all bg-neutral-50 rounded-full"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="py-32 text-center border-2 border-dashed border-neutral-100 rounded-[40px]">
                        <p className="text-neutral-400 font-serif italic">No orders yet.</p>
                    </div>
                )}
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

export default ProfilePage;