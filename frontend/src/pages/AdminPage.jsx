import { BarChart, PlusCircle, ShoppingBasket, Users, ChevronLeft, ChevronRight, Ticket, Package } from "lucide-react"; 
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import AnalyticsTab from "../components/AnalyticsTab";
import CreateProductForm from "../components/CreateProductForm";
import EditProductForm from "../components/EditProductForm"; 
import ProductsList from "../components/ProductsList";
import UsersManager from "../components/UsersManager"; 
import CouponManager from "../components/CouponManager";
import OrdersList from "../components/OrdersList";
import { useProductStore } from "../stores/useProductStore";
import { useUserStore } from "../stores/useUserStore";
import { useOrderStore } from "../stores/useOrderStore";

const tabs = [
    { id: "create", label: "Create Product", icon: PlusCircle },
    { id: "coupons", label: "Coupons", icon: Ticket }, 
    { id: "products", label: "Products", icon: ShoppingBasket },
    { id: "users", label: "Users", icon: Users }, 
    { id: "orders", label: "Orders", icon: Package }, 
    { id: "analytics", label: "Analytics", icon: BarChart },
];

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState("create");
    const [orderFilter] = useState("All");
    const [editingProduct, setEditingProduct] = useState(null);
    
    const { fetchAllProducts, totalPages: productPages, currentPage: productPage } = useProductStore();
    const { fetchAllUsers, totalPages: userPages, currentPage: userPage } = useUserStore();
    const { fetchAllOrders, totalPages: orderPages, currentPage: orderPage } = useOrderStore();

    useEffect(() => {
        if (activeTab === "products") fetchAllProducts(1);
        if (activeTab === "users") fetchAllUsers(1);
        if (activeTab === "orders") fetchAllOrders(1);
    }, [fetchAllProducts, fetchAllUsers, fetchAllOrders, activeTab]);

    const handlePageChange = (page) => {
        if (activeTab === "products") fetchAllProducts(page);
        if (activeTab === "users") fetchAllUsers(page);
        if (activeTab === "orders") fetchAllOrders(page, orderFilter);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const currentPaginationPage = 
        activeTab === "products" ? productPage : 
        activeTab === "users" ? userPage : 
        orderPage;

    const currentTotalPages = 
        activeTab === "products" ? productPages : 
        activeTab === "users" ? userPages : 
        orderPages;

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
                    {activeTab === "coupons" && <CouponManager />}
                    {activeTab === "products" && (
                        <>
                            {editingProduct ? (
                                <EditProductForm 
                                    product={editingProduct} 
                                    onCancel={() => setEditingProduct(null)} 
                                />
                            ) : (
                                <ProductsList onEdit={setEditingProduct} />
                            )}
                        </>
                    )}

                    {activeTab === "users" && <UsersManager />}
                    {activeTab === "orders" && <OrdersList />}
                    {activeTab === "analytics" && <AnalyticsTab />}
                    {(activeTab === "products" || activeTab === "users" || activeTab === "orders") && !editingProduct && currentTotalPages > 1 && (
                        <div className='flex justify-center items-center mt-12 gap-4 pb-10'>
                            <button
                                disabled={currentPaginationPage === 1}
                                onClick={() => handlePageChange(currentPaginationPage - 1)}
                                className='p-2 rounded-full border border-gray-200 bg-white disabled:opacity-30 
                                hover:bg-gray-50 transition-colors shadow-sm'
                            >
                                <ChevronLeft className='text-[#74090A]' size={20} />
                            </button>

                            <div className='flex gap-2'>
                                {[...Array(currentTotalPages)].map((_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => handlePageChange(i + 1)}
                                        className={`w-9 h-9 rounded-md text-[11px] font-bold transition-all shadow-sm ${
                                            currentPaginationPage === i + 1
                                                ? "bg-[#74090A] text-white shadow-md"
                                                : "bg-white border border-gray-100 text-neutral-400 hover:bg-neutral-50"
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>

                            <button
                                disabled={currentPaginationPage === currentTotalPages}
                                onClick={() => handlePageChange(currentPaginationPage + 1)}
                                className='p-2 rounded-full border border-gray-200 
                                bg-white disabled:opacity-30 hover:bg-gray-50 transition-colors shadow-sm'
                            >
                                <ChevronRight className='text-[#74090A]' size={20} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPage;