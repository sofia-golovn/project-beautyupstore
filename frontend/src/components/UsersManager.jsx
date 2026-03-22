import { useEffect } from "react";
import { motion } from "framer-motion";
import { Trash, Shield, ShieldAlert, User } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";

const UsersManager = () => {
    const { allUsers, fetchAllUsers, deleteUser, updateUserRole, loading } = useUserStore();

    useEffect(() => {
        fetchAllUsers();
    }, [fetchAllUsers]);

    return (
        <motion.div
            className='bg-white shadow-sm rounded-lg max-w-4xl mx-auto border border-gray-100 overflow-hidden'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <div className='overflow-x-auto w-full'>
                <table className='min-w-[650px] w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                        <tr>
                            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                                User
                            </th>
                            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                                Email
                            </th>
                            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                                Role
                            </th>
                            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className='bg-white divide-y divide-gray-100'>
                        {allUsers?.map((user) => (
                            <tr key={user._id} className='hover:bg-gray-50 transition-colors'>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='flex items-center'>
                                        <div className='flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center'>
                                            <User className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <div className='ml-4'>
                                            <div className='text-sm font-medium text-gray-900'>{user.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm text-gray-500'>{user.email}</div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        user.role === "admin" 
                                            ? "bg-red-100 text-[#74090A]" 
                                            : "bg-green-100 text-green-700"
                                    }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2'>
                                    <button
                                        onClick={() => updateUserRole(user._id)}
                                        title={user.role === "admin" ? "Demote to User" : "Promote to Admin"}
                                        className={`p-1.5 rounded-full transition-all duration-200 ${
                                            user.role === "admin"
                                                ? "bg-amber-100 text-amber-600 shadow-sm"
                                                : "bg-gray-100 text-gray-400 hover:text-[#74090A]"
                                        }`}
                                    >
                                        {user.role === "admin" ? <ShieldAlert className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                                    </button>
                                    <button
                                        onClick={() => deleteUser(user._id)}
                                        className='text-gray-400 hover:text-red-600 transition-colors p-1.5 rounded-md hover:bg-red-50'
                                    >
                                        <Trash className='h-4 w-4' />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {allUsers?.length === 0 && !loading && (
                <div className="py-10 text-center text-gray-500">No users found.</div>
            )}
        </motion.div>
    );
};

export default UsersManager;