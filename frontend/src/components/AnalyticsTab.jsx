import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "../lib/axios";
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react";
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";

const AnalyticsTab = () => {
    const [analyticsData, setAnalyticsData] = useState({
        users: 0,
        products: 0,
        totalSales: 0,
        totalRevenue: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [dailySalesData, setDailySalesData] = useState([]);

    useEffect(() => {
        const fetchAnalyticsData = async () => {
            try {
                const response = await axios.get("/analytics");
                setAnalyticsData(response.data.analyticsData);

                const formattedData = response.data.dailySalesData.map(item => ({
                    ...item,
                    name: item.name || item.date || "Unknown" 
                }));
                
                setDailySalesData(formattedData);
            } catch (error) {
                console.error("Error fetching analytics data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalyticsData();
    }, []);

    if (isLoading) {
        return (
            <div className='flex justify-center items-center h-64'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#74090A]'></div>
            </div>
        );
    }

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
                <AnalyticsCard title='Total Users' value={analyticsData.users.toLocaleString()} icon={Users} />
                <AnalyticsCard title='Total Products' value={analyticsData.products.toLocaleString()} icon={Package} />
                <AnalyticsCard title='Total Sales' value={analyticsData.totalSales.toLocaleString()} icon={ShoppingCart} />
                <AnalyticsCard title='Total Revenue' value={`$${analyticsData.totalRevenue.toLocaleString()}`} icon={DollarSign} />
            </div>

            <motion.div
                className='bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 overflow-hidden'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
            >
                <div className="flex flex-col mb-8">
                    <h3 className='text-xl font-bold text-gray-900'>Sales & Revenue Overview</h3>
                </div>

                <div className="h-[400px] w-full">
                    {dailySalesData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dailySalesData}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#74090A" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#74090A" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='#F3F4F6' />
                                <XAxis 
                                    dataKey='name' 
                                    stroke='#9CA3AF' 
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{dy: 10}}
                                />
                                <YAxis 
                                    yAxisId='left' 
                                    stroke='#9CA3AF' 
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value}`}
                                />
                                <YAxis 
                                    yAxisId='right' 
                                    orientation='right' 
                                    stroke='#9CA3AF' 
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: "#fff", borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Area
                                    yAxisId='left'
                                    type='monotone'
                                    dataKey='sales'
                                    stroke='#74090A'
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorSales)"
                                    name='Orders'
                                />
                                <Area
                                    yAxisId='right'
                                    type='monotone'
                                    dataKey='revenue'
                                    stroke='#3B82F6'
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                    name='Revenue ($)'
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full w-full flex items-center justify-center border-2 border-dashed border-gray-100 rounded-xl">
                            <p className="text-gray-400 text-sm">No data available for the selected period</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

const AnalyticsCard = ({ title, value, icon: Icon }) => (
	<motion.div
		className='bg-white rounded-lg p-6 shadow-sm border border-gray-100 overflow-hidden relative'
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5 }}
	>
		<div className='flex justify-between items-center relative z-10'>
			<div>
				<p className='text-gray-500 text-xs uppercase tracking-wider mb-1 font-bold'>{title}</p>
				<h3 className='text-gray-900 text-3xl font-bold'>{value}</h3>
			</div>
			<div className='p-3 bg-red-50 rounded-full'>
				<Icon className='h-6 w-6 text-[#74090A]' />
			</div>
		</div>
		<div className='absolute -bottom-2 -right-2 text-gray-50 opacity-[0.03]'>
			<Icon className='h-24 w-24' />
		</div>
	</motion.div>
);

export default AnalyticsTab;