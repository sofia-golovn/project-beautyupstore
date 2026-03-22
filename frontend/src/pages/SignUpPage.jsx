import { useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus, Mail, User, Lock, Loader } from "lucide-react";
import { motion } from "framer-motion";
import { useUserStore } from "../stores/useUserStore";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { signup, loading } = useUserStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
  };

  return (
    <div className='flex flex-col justify-center py-4 sm:px-6 lg:px-8'>
      <motion.div
        className='sm:mx-auto sm:w-full sm:max-w-md'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex justify-center gap-8 mb-6 text-xl font-semibold">
          <Link to="/signup" className="text-[#74090A] border-b-2 border-[#74090A] pb-1">
            Sign up
          </Link>
          <Link to="/login" className="text-gray-400 hover:text-[#74090A] transition">
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
        <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100'>
          <form onSubmit={handleSubmit} className='space-y-4'>
            {[
              { id: 'name', label: 'Full name', icon: User, placeholder: 'John Doe', type: 'text', autoComplete: 'name' },
              { id: 'email', label: 'Email', icon: Mail, placeholder: 'example@example.com', type: 'email', autoComplete: 'email' },
              { id: 'password', label: 'Password', icon: Lock, placeholder: '••••••••', type: 'password', min: 6, autoComplete: 'new-password' },
              { id: 'confirmPassword', label: 'Confirm password', icon: Lock, placeholder: '••••••••', type: 'password', min: 6, autoComplete: 'new-password' },
            ].map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id} className='block text-sm font-medium text-gray-700'>
                  {field.label}
                </label>
                <div className='mt-1 relative rounded-md shadow-sm'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <field.icon className='h-5 w-5 text-gray-400' />
                  </div>
                  <input
                    id={field.id}
                    name={field.id}
                    type={field.type}
                    autoComplete={field.autoComplete}
                    required
                    minLength={field.min}
                    value={formData[field.id]}
                    onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                    className='block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-[#74090A] focus:border-[#74090A] sm:text-sm'
                    placeholder={field.placeholder}
                  />
                </div>
              </div>
            ))}

            <button
              type='submit'
              className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#74090A] hover:bg-[#5a0708] transition duration-150'
              disabled={loading}
            >
              {loading ? <Loader className='animate-spin' /> : "Register"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;