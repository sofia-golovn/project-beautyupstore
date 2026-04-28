import { useEffect, useState } from "react";
import { useOrderStore } from "../stores/useOrderStore";
import { Mail, Phone, MapPin } from "lucide-react";

const OrdersList = ({ onFilterChange }) => {
    const { orders, fetchAllOrders, updateStatus, loading, currentPage } = useOrderStore();
    const [filterStatus, setFilterStatus] = useState("All");

    const statuses = [
        { name: "Paid", color: "bg-blue-400", styles: "bg-blue-50 text-blue-700 border-blue-200" },
        { name: "Packed", color: "bg-yellow-400", styles: "bg-yellow-50 text-yellow-700 border-yellow-200" },
        { name: "Shipped", color: "bg-purple-400", styles: "bg-purple-50 text-purple-700 border-purple-200" },
        { name: "Delivered", color: "bg-green-400", styles: "bg-green-50 text-green-700 border-green-200" },
    ];

    useEffect(() => {
        fetchAllOrders(currentPage, filterStatus);
    }, [fetchAllOrders, currentPage]);

    const handleFilterClick = (newStatus) => {
        setFilterStatus(newStatus);
        if (onFilterChange) onFilterChange(newStatus); 
        fetchAllOrders(1, newStatus);
    };

    const getStatusStyles = (status) => {
        const found = statuses.find(s => s.name === status);
        return found ? found.styles : "bg-gray-50 text-gray-700 border-gray-200";
    };

    if (loading) return <div className="text-center py-20 text-[10px] uppercase tracking-widest text-neutral-300">
        Loading...
    </div>;

    return (
        <div className="space-y-4">
            <div className="flex justify-end items-center gap-3 px-2">
                <button
                    onClick={() => handleFilterClick("All")}
                    title="All Orders"
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${filterStatus === "All" ?
                        "bg-black scale-150" : "bg-gray-200 hover:bg-gray-400"}`}
                />
                {statuses.map((s) => (
                    <button
                        key={s.name}
                        onClick={() => handleFilterClick(s.name)}
                        title={s.name}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${s.color} ${filterStatus === s.name ?
                            "scale-150 ring-2 ring-offset-2 ring-white" : "opacity-30 hover:opacity-100"}`}
                    />
                ))}
            </div>

            <div className="overflow-hidden bg-white shadow-md rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Details</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shipping Address</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 align-top">
                                        <div className="text-sm font-bold text-gray-900 uppercase tracking-tight">
                                            {typeof order.user === 'object' ? order.user?.name : "Loading..."}
                                        </div>
                                        <div className="flex items-center text-xs text-gray-500 mt-1 font-medium">
                                            <Mail size={12} className="mr-1 text-gray-400" /> 
                                            {typeof order.user === 'object' ? order.user?.email : "..."}
                                        </div>
                                        <div className="flex items-center text-xs text-gray-500 mt-1">
                                            <Phone size={12} className="mr-1 text-gray-400" /> {order.phone || "No phone"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 align-top">
                                        <div className="text-xs text-gray-900 space-y-1">
                                            {order.products.map((p, i) => (
                                                <div key={i} className="flex justify-between gap-4">
                                                    <span className="font-medium text-gray-700">{p.product?.name || "Removed"}</span>
                                                    <span className="text-gray-400 italic font-medium">x{p.quantity}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-4 pt-2 border-t border-gray-100 flex items-baseline gap-2">
                                            <span className="text-sm font-bold text-[#74090A]">${order.totalAmount}</span>
                                            <span className="text-[10px] text-gray-400 uppercase tracking-tighter">
                                                {new Date(order.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 align-top">
                                        <div className="flex items-start gap-2 text-xs text-gray-600 
                                        max-w-[220px] leading-relaxed">
                                            <MapPin size={14} className="mt-0.5 flex-shrink-0 text-gray-400" />
                                            <span>{order.shippingAddress || "Stripe Address"}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 align-middle">
                                        <div className="flex justify-center">
                                            <select
                                                value={order.status}
                                                onChange={(e) => updateStatus(order._id, e.target.value)}
                                                className={`text-[11px] font-bold uppercase tracking-wider 
                                                    border rounded-full px-4 py-1.5 outline-none transition-all
                                                    cursor-pointer shadow-sm ${getStatusStyles(order.status)}`}
                                            >
                                                <option value="Paid">Paid</option>
                                                <option value="Packed">Packed</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                            </select>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="py-20 text-center text-neutral-300 text-xs 
                                font-light italic">
                                    No orders found for this status.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrdersList;