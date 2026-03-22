import { BarChart, PlusCircle, ShoppingBasket, Users } from "lucide-react"; 
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import AnalyticsTab from "../components/AnalyticsTab";
import CreateProductForm from "../components/CreateProductForm";
import ProductsList from "../components/ProductsList";
import UsersManager from "../components/UsersManager"; 
import { useProductStore } from "../stores/useProductStore";

const tabs = [
    { id: "create", label: "Create Product", icon: PlusCircle },
    { id: "products", label: "Products", icon: ShoppingBasket },
    { id: "users", label: "Users", icon: Users }, 
    { id: "analytics", label: "Analytics", icon: BarChart },
];

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState("create");
    const { fetchAllProducts } = useProductStore();

    useEffect(() => {
        fetchAllProducts();
    }, [fetchAllProducts]);

    return (
        <div className='min-h-screen relative overflow-hidden bg-white'>
            <div className='relative z-10 container mx-auto px-4 py-16'>
                <motion.h1
                    className='text-3xl font-semibold mb-12 text-[#74090A] text-center tracking-widest uppercase'
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Admin Dashboard
                </motion.h1>

                <div className='flex justify-center mb-12'>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center px-6 py-2 mx-2 rounded-md transition-all duration-200 font-medium text-sm tracking-wide ${
                                activeTab === tab.id
                                    ? "bg-[#74090A] text-white shadow-md"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            <tab.icon className={`mr-2 h-4 w-4 ${activeTab === tab.id ? "text-white" : "text-[#74090A]"}`} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="bg-white rounded-lg">
                    {activeTab === "create" && <CreateProductForm />}
                    {activeTab === "products" && <ProductsList />}
                    {activeTab === "users" && <UsersManager />}
                    {activeTab === "analytics" && <AnalyticsTab />}
                </div>
            </div>
        </div>
    );
};

export default AdminPage;