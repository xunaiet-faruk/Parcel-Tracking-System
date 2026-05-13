import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    AreaChart, Area
} from 'recharts';
import { motion } from 'framer-motion';
import useAxios from '../../(site)/hooks/useAxios';
import Loading from '@/app/components/Loading';

const AdminOverview = () => {
    const axios = useAxios();
    const [loading, setLoading] = useState(true);
    const [statusDistribution, setStatusDistribution] = useState([]);
    const [deliveryTrend, setDeliveryTrend] = useState([]);
    const [riderPerformance, setRiderPerformance] = useState([]);
    const [revenueData, setRevenueData] = useState([]);
    const [topUsers, setTopUsers] = useState([]);

    useEffect(() => {
        fetchAllData();
        const interval = setInterval(fetchAllData, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            const parcelsResponse = await axios.get('/admin/parcels/all');
            const parcels = parcelsResponse.data || [];
            const ridersResponse = await axios.get('/rider');
            const riders = ridersResponse.data || [];

            console.log('Total parcels found:', parcels.length);
            if (parcels.length > 0) {
                console.log('Sample parcel dates:', {
                    bookingDate: parcels[0]?.bookingDate,
                    createdAt: parcels[0]?.createdAt,
                    date: parcels[0]?.date
                });
            }

            // 1. Parcel Status Distribution (Pie Chart)
            const delivered = parcels.filter(p => p.deliverystatus === 'delivered').length;
            const pending = parcels.filter(p => p.deliverystatus === 'pending-pickup' || p.deliverystatus === 'assigned').length;
            const pickedUp = parcels.filter(p => p.deliverystatus === 'picked-up').length;
            const cancelled = parcels.filter(p => p.deliverystatus === 'cancelled').length;

            setStatusDistribution([
                { name: 'Delivered', value: delivered || 1, color: '#10b981' },
                { name: 'Pending', value: pending || 1, color: '#f59e0b' },
                { name: 'Picked Up', value: pickedUp || 1, color: '#3b82f6' },
                { name: 'Cancelled', value: cancelled || 1, color: '#ef4444' }
            ]);

            // 2. Delivery Trend (Line Chart - Last 7 days) - FIXED with bookingDate
            const last7Days = getLast7DaysData(parcels);
            console.log('Delivery trend data:', last7Days);
            setDeliveryTrend(last7Days);

            // 3. Rider Performance (Bar Chart)
            const riderStats = getRiderPerformance(parcels, riders);
            setRiderPerformance(riderStats);

            // 4. Revenue (Area Chart - Last 30 days) - FIXED with bookingDate
            const revenueStats = getRevenueDataLast30Days(parcels);
            console.log('Revenue data sample:', revenueStats.slice(0, 3));
            setRevenueData(revenueStats);

            // 5. Top Users (Bar Chart)
            const topUsersData = getTopUsers(parcels);
            setTopUsers(topUsersData);

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            // একটু delay দিয়ে loading false করছি smooth transition এর জন্য
            setTimeout(() => {
                setLoading(false);
            }, 500);
        }
    };

    // প্যাকেলের তারিখ বের করার ফাংশন
    const getParcelDate = (parcel) => {
        const date = parcel.bookingDate || parcel.createdAt || parcel.date || parcel.created_date;
        if (!date) return null;

        try {
            if (typeof date === 'string') {
                return new Date(date);
            } else if (date._seconds) {
                return new Date(date._seconds * 1000);
            } else if (date instanceof Date) {
                return date;
            }
            return new Date(date);
        } catch (e) {
            console.error('Error parsing date:', e);
            return null;
        }
    };

    const getLast7DaysData = (parcels) => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const last7Days = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(today.getDate() - i);
            date.setHours(0, 0, 0, 0);

            const nextDate = new Date(date);
            nextDate.setDate(date.getDate() + 1);

            const dayName = days[date.getDay()];

            // bookingDate ব্যবহার করে ফিল্টার করা
            const dayParcels = parcels.filter(p => {
                const parcelDate = getParcelDate(p);
                if (!parcelDate) return false;

                parcelDate.setHours(0, 0, 0, 0);
                return parcelDate >= date && parcelDate < nextDate;
            });

            last7Days.push({
                name: dayName,
                date: date.toISOString().split('T')[0],
                parcels: dayParcels.length,
                delivered: dayParcels.filter(p => p.deliverystatus === 'delivered').length,
                revenue: dayParcels.reduce((sum, p) => sum + (p.totalPrice || 0), 0)
            });
        }

        return last7Days;
    };

    const getRevenueDataLast30Days = (parcels) => {
        const revenueStats = [];
        const today = new Date();

        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(today.getDate() - i);
            date.setHours(0, 0, 0, 0);

            const nextDate = new Date(date);
            nextDate.setDate(date.getDate() + 1);

            const dayName = `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;

            const dayParcels = parcels.filter(p => {
                const parcelDate = getParcelDate(p);
                if (!parcelDate) return false;

                parcelDate.setHours(0, 0, 0, 0);
                return parcelDate >= date && parcelDate < nextDate;
            });

            const dailyRevenue = dayParcels.reduce((sum, p) => sum + (p.totalPrice || 0), 0);

            revenueStats.push({
                name: dayName,
                fullDate: date.toISOString().split('T')[0],
                revenue: dailyRevenue,
                parcels: dayParcels.length
            });
        }

        return revenueStats;
    };

    const getRiderPerformance = (parcels, riders) => {
        const riderMap = new Map();

        riders.forEach(rider => {
            if (rider.email && rider.status === 'approved') {
                riderMap.set(rider.email, {
                    name: rider.name || rider.email.split('@')[0],
                    deliveries: 0,
                    completed: 0
                });
            }
        });

        parcels.forEach(parcel => {
            if (parcel.riderEmail) {
                if (!riderMap.has(parcel.riderEmail)) {
                    riderMap.set(parcel.riderEmail, {
                        name: parcel.riderName || parcel.riderEmail.split('@')[0],
                        deliveries: 0,
                        completed: 0
                    });
                }
                const rider = riderMap.get(parcel.riderEmail);
                rider.deliveries++;
                if (parcel.deliverystatus === 'delivered') {
                    rider.completed++;
                }
            }
        });

        const result = Array.from(riderMap.values())
            .sort((a, b) => b.deliveries - a.deliveries)
            .slice(0, 5);

        if (result.length === 0) {
            return [
                { name: 'No Data', deliveries: 0, completed: 0 }
            ];
        }

        return result;
    };

    const getTopUsers = (parcels) => {
        const userMap = new Map();

        parcels.forEach(parcel => {
            const email = parcel.senderEmail;
            if (email) {
                if (!userMap.has(email)) {
                    userMap.set(email, {
                        name: parcel.senderName || email.split('@')[0],
                        email: email,
                        parcels: 0,
                        totalSpent: 0
                    });
                }
                const user = userMap.get(email);
                user.parcels++;
                user.totalSpent += parcel.totalPrice || 0;
            }
        });

        const result = Array.from(userMap.values())
            .sort((a, b) => b.parcels - a.parcels)
            .slice(0, 5);

        if (result.length === 0) {
            return [
                { name: 'No Users', parcels: 0, totalSpent: 0 }
            ];
        }

        return result;
    };

    // চেক করা চার্টে ডাটা আছে কিনা
    const hasDeliveryData = deliveryTrend.some(d => d.parcels > 0 || d.delivered > 0);
    const hasRevenueData = revenueData.some(d => d.revenue > 0);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="space-y-6 p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
            >
                <h1 className="text-3xl font-bold text-[#03373d]">Analytics Dashboard</h1>
                <p className="text-gray-600">Real-time delivery insights and performance metrics</p>
            </motion.div>

            {/* Row 1: Parcel Status (Pie) + Delivery Trend (Line) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Parcel Status - Pie Chart */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-2xl shadow-lg p-6"
                >
                    <h3 className="text-xl font-bold text-[#03373d] mb-4">📊 Parcel Status Distribution</h3>
                    <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                            <Pie
                                data={statusDistribution}
                                cx="50%"
                                cy="50%"
                                labelLine={true}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {statusDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Delivery Trend - Line Chart */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white rounded-2xl shadow-lg p-6"
                >
                    <h3 className="text-xl font-bold text-[#03373d] mb-4">📈 Delivery Trend (Last 7 Days)</h3>
                    {hasDeliveryData ? (
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart data={deliveryTrend}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="parcels"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    name="Total Parcels"
                                    dot={{ fill: '#3b82f6', r: 5 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="delivered"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    name="Delivered"
                                    dot={{ fill: '#10b981', r: 5 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-[350px] flex flex-col items-center justify-center text-gray-500">
                            <svg className="w-16 h-16 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <p className="text-lg">No delivery data available</p>
                            <p className="text-sm mt-1">for the last 7 days</p>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Row 2: Rider Performance (Bar) + Revenue (Area) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Rider Performance - Bar Chart */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-lg p-6"
                >
                    <h3 className="text-xl font-bold text-[#03373d] mb-4">🏍️ Rider Performance</h3>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={riderPerformance} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis type="category" dataKey="name" width={100} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="deliveries" fill="#3b82f6" name="Total Assignments" radius={[0, 4, 4, 0]} />
                            <Bar dataKey="completed" fill="#10b981" name="Completed" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Revenue - Area Chart */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-white rounded-2xl shadow-lg p-6"
                >
                    <h3 className="text-xl font-bold text-[#03373d] mb-4">💰 Revenue Trend (Last 30 Days)</h3>
                    {hasRevenueData ? (
                        <ResponsiveContainer width="100%" height={350}>
                            <AreaChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="name"
                                    interval={6}
                                    angle={-45}
                                    textAnchor="end"
                                    height={60}
                                />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#8b5cf6"
                                    fill="#8b5cf6"
                                    fillOpacity={0.3}
                                    name="Revenue (৳)"
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-[350px] flex flex-col items-center justify-center text-gray-500">
                            <svg className="w-16 h-16 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-lg">No revenue data available</p>
                            <p className="text-sm mt-1">for the last 30 days</p>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Row 3: Top Users (Bar Chart) */}
            <div className="grid grid-cols-1 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="bg-white rounded-2xl shadow-lg p-6"
                >
                    <h3 className="text-xl font-bold text-[#03373d] mb-4">👥 Top Users by Parcel Count</h3>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={topUsers}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="parcels" fill="#f59e0b" name="Total Parcels" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminOverview;