import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "../lib/axios";
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

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
				setDailySalesData(response.data.dailySalesData);
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
		<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
				<AnalyticsCard
					title='Total Users'
					value={analyticsData.users.toLocaleString()}
					icon={Users}
				/>
				<AnalyticsCard
					title='Total Products'
					value={analyticsData.products.toLocaleString()}
					icon={Package}
				/>
				<AnalyticsCard
					title='Total Sales'
					value={analyticsData.totalSales.toLocaleString()}
					icon={ShoppingCart}
				/>
				<AnalyticsCard
					title='Total Revenue'
					value={`$${analyticsData.totalRevenue.toLocaleString()}`}
					icon={DollarSign}
				/>
			</div>

			<motion.div
				className='bg-white rounded-lg p-6 shadow-sm border border-gray-100'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.25 }}
			>
				<h3 className='text-lg font-semibold text-gray-900 mb-6'>Sales & Revenue Overview</h3>
				<ResponsiveContainer width='100%' height={400}>
					<LineChart data={dailySalesData}>
						<CartesianGrid strokeDasharray='3 3' vertical={false} stroke='#F3F4F6' />
						<XAxis 
							dataKey='name' 
							stroke='#9CA3AF' 
							fontSize={12}
							tickLine={false}
							axisLine={false}
						/>
						<YAxis 
							yAxisId='left' 
							stroke='#9CA3AF' 
							fontSize={12}
							tickLine={false}
							axisLine={false}
						/>
						<YAxis 
							yAxisId='right' 
							orientation='right' 
							stroke='#9CA3AF' 
							fontSize={12}
							tickLine={false}
							axisLine={false}
						/>
						<Tooltip 
							contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #F3F4F6 shadow-sm" }}
						/>
						<Legend />
						<Line
							yAxisId='left'
							type='monotone'
							dataKey='sales'
							stroke='#74090A'
							strokeWidth={3}
							dot={{ fill: "#74090A", strokeWidth: 2, r: 4 }}
							activeDot={{ r: 8 }}
							name='Sales'
						/>
						<Line
							yAxisId='right'
							type='monotone'
							dataKey='revenue'
							stroke='#3B82F6'
							strokeWidth={3}
							dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
							activeDot={{ r: 8 }}
							name='Revenue'
						/>
					</LineChart>
				</ResponsiveContainer>
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