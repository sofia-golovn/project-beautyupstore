import { BarChart, PlusCircle, ShoppingBasket, Users, ChevronLeft, ChevronRight } from "lucide-react"; 
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import AnalyticsTab from "../components/AnalyticsTab";
import CreateProductForm from "../components/CreateProductForm";
import EditProductForm from "../components/EditProductForm"; 
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
    const [editingProduct, setEditingProduct] = useState(null);
    
    const { fetchAllProducts, totalPages, currentPage } = useProductStore();

    useEffect(() => {
        if (activeTab === "products") {
            fetchAllProducts(1);
        }
    }, [fetchAllProducts, activeTab]);

    const handlePageChange = (page) => {
        fetchAllProducts(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

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

                <div className='flex flex-wrap justify-center mb-12 gap-y-4'>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id);
                                setEditingProduct(null);
                            }}
                            className={`flex items-center px-6 py-2 mx-2 rounded-md transition-all 
                                duration-200 font-medium text-sm tracking-wide ${
                                activeTab === tab.id
                                    ? "bg-[#74090A] text-white shadow-md"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            <tab.icon className={`mr-2 h-4 w-4 ${activeTab === tab.id ? "text-white" :
                                "text-[#74090A]"}`} />
                            <span className="whitespace-nowrap">{tab.label}</span>
                        </button>
                    ))}
                </div>

                <div className="bg-white rounded-lg">
                    {activeTab === "create" && <CreateProductForm />}
                    
                    {activeTab === "products" && (
                        <>
                            {editingProduct ? (
                                <EditProductForm 
                                    product={editingProduct} 
                                    onCancel={() => setEditingProduct(null)} 
                                />
                            ) : (
                                <>
                                    <ProductsList onEdit={setEditingProduct} />
                                    
                                    {/* ІНТЕРФЕЙС ПАГІНАЦІЇ */}
                                    {totalPages > 1 && (
                                        <div className='flex justify-center items-center mt-8 gap-4 pb-10'>
                                            <button
                                                disabled={currentPage === 1}
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                    className='p-2 rounded-full border border-gray-200 
                                                disabled:opacity-30 hover:bg-gray-50 transition-colors'
                                            >
                                                <ChevronLeft className='text-[#74090A]' size={20} />
                                            </button>

                                            <div className='flex gap-2'>
                                                {[...Array(totalPages)].map((_, i) => (
                                                    <button
                                                        key={i + 1}
                                                        onClick={() => handlePageChange(i + 1)}
                                                        className={`w-8 h-8 rounded text-xs font-bold 
                                                            transition-all ${
                                                            currentPage === i + 1
                                                                ? "bg-[#74090A] text-white"
                                                                : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                                                        }`}
                                                    >
                                                        {i + 1}
                                                    </button>
                                                ))}
                                            </div>

                                            <button
                                                disabled={currentPage === totalPages}
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                    className='p-2 rounded-full border border-gray-200 
                                                disabled:opacity-30 hover:bg-gray-50 transition-colors'
                                            >
                                                <ChevronRight className='text-[#74090A]' size={20} />
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}

                    {activeTab === "users" && <UsersManager />}
                    {activeTab === "analytics" && <AnalyticsTab />}
                </div>
            </div>
        </div>
    );
};

export default AdminPage;