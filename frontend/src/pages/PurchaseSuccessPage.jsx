import { ArrowRight, CheckCircle, ShoppingBag } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import axios from "../lib/axios";
import { motion } from "framer-motion";

const PurchaseSuccessPage = () => {
    const [isProcessing, setIsProcessing] = useState(true);
    const [orderId, setOrderId] = useState(null);
    const [error, setError] = useState(null);
    const { clearCart } = useCartStore();

    const successCalled = useRef(false);

    useEffect(() => {
        const handleCheckoutSuccess = async (sessionId) => {
            if (successCalled.current) return;
            successCalled.current = true;

            try {
                const response = await axios.post("/payments/checkout-success", {
                    sessionId,
                });
                
                setOrderId(response.data.orderId);
                clearCart();
                
            } catch (error) {
                console.error("Checkout success error:", error);
                setError("Failed to verify your purchase. Please contact support.");
            } finally {
                setIsProcessing(false);
            }
        };

        const sessionId = new URLSearchParams(window.location.search).get("session_id");
        if (sessionId) {
            handleCheckoutSuccess(sessionId);
        } else {
            setIsProcessing(false);
            setError("No session ID found. It seems like the payment process was interrupted.");
        }
    }, [clearCart]);

    if (isProcessing) {
        return (
            <div className='h-screen flex items-center justify-center bg-white'>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#74090A] mx-auto mb-4"></div>
                    <p className="text-[11px] uppercase tracking-widest text-neutral-400 font-bold">Processing your order...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='h-screen flex items-center justify-center bg-white px-4'>
                <div className="max-w-md w-full text-center p-8 border border-neutral-100 rounded-[20px] shadow-sm">
                    <p className="text-[#74090A] font-bold uppercase text-[10px] tracking-widest mb-2">Error</p>
                    <p className="text-neutral-600 text-sm">{error}</p>
                    <Link to="/" className="mt-6 inline-block text-[10px] font-bold uppercase tracking-widest border-b border-[#74090A] pb-1 text-[#74090A]">
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className='h-screen flex items-center justify-center px-4 bg-white relative overflow-hidden'>
            <motion.div 
                className='max-w-md w-full bg-white rounded-[24px] shadow-sm border border-neutral-100 overflow-hidden relative z-10'
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className='p-8 sm:p-10 text-center'>
                    <div className='flex justify-center mb-6'>
                        <div className="bg-green-50 p-4 rounded-full">
                            <CheckCircle className='text-green-600 w-12 h-12' />
                        </div>
                    </div>
                    
                    <h1 className='text-[22px] sm:text-[26px] font-bold text-neutral-900 mb-3 
                    uppercase tracking-tight'>
                        Thank You!
                    </h1>

                    <p className='text-neutral-500 text-sm font-light mb-8 px-4'>
                        Your purchase was successful. We've started preparing your cosmetics for delivery.
                    </p>

                    <div className='bg-neutral-50 rounded-[18px] p-6 mb-8 border border-neutral-100'>
                        <div className='flex items-center justify-between mb-3'>
                            <span className='text-[10px] uppercase tracking-widest text-neutral-400 font-bold'>
                                Order number
                            </span>
                            <span className='text-xs font-bold text-[#74090A]'>
                                #{orderId ? orderId.slice(-8).toUpperCase() : 'SUCCESS'}
                            </span>
                        </div>
                        <div className='flex items-center justify-between'>
                            <span className='text-[10px] uppercase tracking-widest text-neutral-400 font-bold'>
                                Estimated delivery
                            </span>
                            <span className='text-xs font-bold text-neutral-900'>3-5 business days</span>
                        </div>
                    </div>

                    <div className='space-y-4'>
                        <Link
                            to={"/catalog"}
                            className='w-full bg-[#74090A] hover:bg-[#4F0608] text-white 
                            text-[10px] font-bold uppercase tracking-widest py-4 px-4 
                            rounded-xl transition duration-300 flex items-center justify-center 
                            shadow-sm active:scale-[0.98]'
                        >
                            <ShoppingBag className='mr-2' size={16} />
                            Continue Shopping
                            <ArrowRight className='ml-2' size={16} />
                        </Link>
                    </div>

                    <p className='mt-8 text-[9px] text-neutral-400 uppercase tracking-[0.2em]'>
                        A confirmation email is on its way
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default PurchaseSuccessPage;