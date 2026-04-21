import { useState } from "react";
import { Mail, Lock, ShieldCheck, Loader, ChevronLeft } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const ForgotPasswordPage = () => {
    const [step, setStep] = useState(1); // 1 - Email, 2 - Code & New Password
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const { forgotPassword, resetPassword, loading } = useUserStore();
    const navigate = useNavigate();

    const handleSendCode = async (e) => {
        e.preventDefault();
        const success = await forgotPassword(email);
        if (success) setStep(2);
    };

    const handleReset = async (e) => {
        e.preventDefault();
        const success = await resetPassword(email, code, newPassword);
        if (success) navigate("/login");
    };

    return (
        <div className='flex flex-col justify-center py-12 px-6 min-h-[85vh]'>
            <motion.div
                className='sm:mx-auto sm:w-full sm:max-w-md'
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className="flex justify-center mb-8">
                    <h2 className="text-[#74090A] text-2xl font-serif">
                        {step === 1 ? "Password Recovery" : "New Password"}
                    </h2>
                </div>
            </motion.div>

            <motion.div
                className='sm:mx-auto sm:w-full sm:max-w-md'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100'>
                    {step === 1 ? (
                        <form onSubmit={handleSendCode} className='space-y-6'>
                            <p className='text-sm text-gray-500 text-center leading-relaxed'>
                                Enter your email address and we'll send you a 6-digit code to reset your password.
                            </p>
                            
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>Email Address</label>
                                <div className='mt-1 relative rounded-md shadow-sm'>
                                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center 
                                    pointer-events-none'>
                                        <Mail className='h-5 w-5 text-gray-400' />
                                    </div>
                                    <input
                                        type='email'
                                        name='reset-email'
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder='example@example.com'
                                        className='block w-full px-3 py-2 pl-10 border border-gray-300 
                                        rounded-md placeholder-gray-400 focus:ring-[#74090A] 
                                        focus:border-[#74090A] sm:text-sm'
                                    />
                                </div>
                            </div>

                            <button
                                type='submit'
                                disabled={loading}
                                className='w-full flex justify-center py-2 px-4 border 
                                border-transparent rounded-md shadow-sm text-sm font-medium 
                                text-white bg-[#74090A] hover:bg-[#5a0708] transition duration-150'
                            >
                                {loading ? <Loader className='animate-spin' /> : "Send Reset Code"}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleReset} className='space-y-6' autoComplete='off'>
                            <p className='text-sm text-gray-500 text-center leading-relaxed'>
                                Please check your inbox and enter the verification code along with your new password.
                            </p>

                            <div>
                                <label className='block text-sm font-medium text-gray-700'>Verification Code</label>
                                <div className='mt-1 relative rounded-md shadow-sm'>
                                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center 
                                    pointer-events-none'>
                                        <ShieldCheck className='h-5 w-5 text-gray-400' />
                                    </div>
                                    <input
                                        type='text'
                                        name='verification-code'
                                        autoComplete='off'
                                        required
                                        placeholder='Enter 6-digit code'
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                            className='block w-full px-3 py-2 pl-10 border border-gray-300 
                                        rounded-md placeholder-gray-400 focus:ring-[#74090A] 
                                        focus:border-[#74090A] sm:text-sm'
                                    />
                                </div>
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700'>New Password</label>
                                <div className='mt-1 relative rounded-md shadow-sm'>
                                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center 
                                    pointer-events-none'>
                                        <Lock className='h-5 w-5 text-gray-400' />
                                    </div>
                                    <input
                                        type='password'
                                        name='new-password-field'
                                        autoComplete='new-password'
                                        required
                                        placeholder='••••••••'
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                            className='block w-full px-3 py-2 pl-10 border border-gray-300 
                                        rounded-md placeholder-gray-400 focus:ring-[#74090A] 
                                        focus:border-[#74090A] sm:text-sm'
                                    />
                                </div>
                            </div>

                            <button
                                type='submit'
                                disabled={loading}
                                    className='w-full flex justify-center py-2 px-4 border 
                                border-transparent rounded-md shadow-sm text-sm font-medium 
                                text-white bg-[#74090A] hover:bg-[#5a0708] transition duration-150'
                            >
                                {loading ? <Loader className='animate-spin' /> : "Reset Password"}
                            </button>
                        </form>
                    )}

                    <div className='mt-6'>
                        <Link
                            to='/login'
                            className='flex items-center justify-center text-sm font-medium text-gray-500 
                            hover:text-[#3d0506] transition duration-150'
                        >
                            <ChevronLeft className='h-4 w-4 mr-1' />
                            Back to Login
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPasswordPage;