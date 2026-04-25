import { XCircle, ArrowLeft, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const PurchaseCancelPage = () => {
    return (
        <div className='min-h-screen flex items-center justify-center px-4 bg-white'>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className='max-w-md w-full bg-white rounded-[24px] shadow-sm border 
                border-neutral-100 overflow-hidden relative z-10'
            >
                <div className='p-8 sm:p-10 text-center'>
                    <div className='flex justify-center mb-6'>
                        <div className="bg-red-50 p-4 rounded-full">
                            <XCircle className='text-red-500 w-12 h-12' />
                        </div>
                    </div>

                    <h1 className='text-[22px] sm:text-[26px] font-bold text-neutral-900 mb-3 
                    uppercase tracking-tight'>
                        Payment Cancelled
                    </h1>

                    <p className='text-neutral-500 text-sm font-light mb-8 px-4'>
                        Your order has been cancelled. No charges were made to your account.
                    </p>

                    <div className='bg-neutral-50 rounded-[18px] p-6 mb-8 border border-neutral-100'>
                        <div className="flex items-start gap-3">
                            <HelpCircle className="text-neutral-400 shrink-0 mt-0.5" size={16} />
                            <p className='text-[11px] text-neutral-400 text-left uppercase tracking-widest 
                            leading-relaxed font-bold'>
                                If you encountered an issue during checkout or changed your mind, 
                                our support team is always here to help.
                            </p>
                        </div>
                    </div>

                    <div className='space-y-4'>
                        <Link
                            to={"/cart"}
                            className='w-full bg-[#74090A] hover:bg-[#4F0608] text-white text-[10px] 
                            font-bold uppercase tracking-widest py-4 px-4 
                            rounded-xl transition duration-300 flex items-center justify-center 
                            shadow-sm active:scale-[0.98]'
                        >
                            Try Again
                        </Link>

                        <Link
                            to={"/"}
                            className='w-full bg-white border border-neutral-200 
                            hover:bg-neutral-50 text-neutral-900 text-[10px] font-bold uppercase 
                            tracking-widest py-4 px-4 
                            rounded-xl transition duration-300 flex items-center justify-center active:scale-[0.98]'
                        >
                            <ArrowLeft className='mr-2' size={16} />
                            Return to Shop
                        </Link>
                    </div>

                    <p className='mt-8 text-[9px] text-neutral-400 uppercase tracking-[0.2em]'>
                        Your cart items are still saved
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default PurchaseCancelPage;