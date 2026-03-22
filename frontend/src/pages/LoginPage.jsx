import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Loader } from "lucide-react";
import { motion } from "framer-motion";
import { useUserStore } from "../stores/useUserStore";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, loading } = useUserStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData.email, formData.password);
  };

  return (
    <div className='flex flex-col justify-center py-6 sm:px-6 lg:px-8 min-h-[85vh]'>
      <motion.div
        className='sm:mx-auto sm:w-full sm:max-w-md'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex justify-center gap-8 mb-6 text-xl font-semibold">
          <Link to="/signup" className="text-gray-400 hover:text-[#74090A] transition">
            Sign up
          </Link>
          <Link to="/login" className="text-[#74090A] border-b-2 border-[#74090A] pb-1">
            Login
          </Link>
        </div>
      </motion.div>

      <motion.div
        className='sm:mx-auto sm:w-full sm:max-w-md'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className='bg-white py-6 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100'>
          <form onSubmit={handleSubmit} className='space-y-6' method="POST">
            
            <div>
              <label className='block text-sm font-medium text-gray-700'>Email</label>
              <div className='mt-1 relative rounded-md shadow-sm'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Mail className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  type='email'
                  id='email'
                  name='email'
                  autoComplete='username email' 
                  required
                  placeholder='example@example.com'
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className='block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:ring-[#74090A] focus:border-[#74090A] sm:text-sm'
                />
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700'>Password</label>
              <div className='mt-1 relative rounded-md shadow-sm'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Lock className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  type='password'
                  id='password'
                  name='password' 
                  autoComplete='current-password' 
                  required
                  placeholder='••••••••'
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className='block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:ring-[#74090A] focus:border-[#74090A] sm:text-sm'
                />
              </div>
            </div>

            <div className="flex justify-start text-sm">
              <Link to="/forgot-password" className="text-[#74090A] hover:underline">
                Lost your password?
              </Link>
            </div>

            <button
              type='submit'
              className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#74090A] hover:bg-[#5a0708] transition duration-150'
              disabled={loading}
            >
              {loading ? <Loader className='animate-spin' /> : "Log in"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;