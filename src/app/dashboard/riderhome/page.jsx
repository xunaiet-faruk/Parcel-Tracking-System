"use client";

import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    AreaChart, Area
} from 'recharts';
import { motion } from 'framer-motion';
import {
    FaTruck, FaCheckCircle, FaClock, FaMoneyBillWave,
    FaArrowUp, FaArrowDown, FaBox, FaMapMarkerAlt,
    FaPhone, FaUser, FaEye, FaHistory
} from 'react-icons/fa';
import useAuth from '../../(site)/hooks/useAuth';
import useAxios from '../../(site)/hooks/useAxios';
import Loading from '@/app/components/Loading';

const Riderhome = () => {
    const { user } = useAuth();
    const axios = useAxios();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        assigned: 0,
        completed: 0,
        pending: 0,
        earnings: 0
    });
    const [deliveryTrend, setDeliveryTrend] = useState([]);
    const [earningsData, setEarningsData] = useState([]);
    const [assignedDeliveries, setAssignedDeliveries] = useState([]);
    const [deliveryHistory, setDeliveryHistory] = useState([]);
    const [selectedParcel, setSelectedParcel] = useState(null);

    useEffect(() => {
        fetchRiderData();
        const interval = setInterval(fetchRiderData, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchRiderData = async () => {
        try {
            setLoading(true);
            const email = user?.email;

            // রাইডারের সব প্যাকেল আনা
            const response = await axios.get(`/parcels?riderEmail=${email}`);
            const parcels = response.data || [];

            // স্ট্যাটিসটিক্স ক্যালকুলেশন
            const assigned = parcels.filter(p => p.deliverystatus === 'assigned').length;
            const completed = parcels.filter(p => p.deliverystatus === 'delivered').length;
            const pending = parcels.filter(p => p.deliverystatus === 'pending-pickup' || p.deliverystatus === 'picked-up').length;
            const totalEarnings = parcels
                .filter(p => p.deliverystatus === 'delivered')
                .reduce((sum, p) => sum + (p.riderEarning || p.deliveryCharge || 50), 0);

            setStats({
                assigned,
                completed,
                pending,
                earnings: totalEarnings
            });

            // ডেলিভারি ট্রেন্ড (লাস্ট ৭ দিন)
            const trend = getLast7DaysTrend(parcels);
            setDeliveryTrend(trend);

            // আর্নিংস ডাটা (লাস্ট ৩০ দিন) - নাম পরিবর্তন করা হয়েছে
            const earningsTrendData = getLast30DaysEarnings(parcels);
            setEarningsData(earningsTrendData);

            // অ্যাসাইনড ডেলিভারি (যেগুলো এখনো ডেলিভার হয়নি)
            const assignedOnly = parcels.filter(p =>
                p.deliverystatus === 'assigned' || p.deliverystatus === 'picked-up'
            );
            setAssignedDeliveries(assignedOnly);

            // ডেলিভারি হিস্ট্রি (যেগুলো ডেলিভার হয়েছে বা রিজেক্ট)
            const history = parcels.filter(p =>
                p.deliverystatus === 'delivered' || p.deliverystatus === 'cancelled'
            ).sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
            setDeliveryHistory(history);

            setLoading(false);
        } catch (error) {
            console.error("Error fetching rider data:", error);
            setLoading(false);
        }
    };

    const getLast7DaysTrend = (parcels) => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const trend = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);

            const nextDate = new Date(date);
            nextDate.setDate(date.getDate() + 1);

            const dayName = days[date.getDay()];

            const dayParcels = parcels.filter(p => {
                const parcelDate = new Date(p.deliveredAt || p.updatedAt || p.createdAt);
                parcelDate.setHours(0, 0, 0, 0);
                return parcelDate >= date && parcelDate < nextDate;
            });

            trend.push({
                name: dayName,
                deliveries: dayParcels.length,
                completed: dayParcels.filter(p => p.deliverystatus === 'delivered').length
            });
        }

        return trend;
    };

    const getLast30DaysEarnings = (parcels) => {
        const earnings = [];
        const today = new Date();

        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(today.getDate() - i);
            date.setHours(0, 0, 0, 0);

            const nextDate = new Date(date);
            nextDate.setDate(date.getDate() + 1);

            const dayName = `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;

            const dayParcels = parcels.filter(p => {
                const parcelDate = new Date(p.deliveredAt || p.updatedAt || p.createdAt);
                parcelDate.setHours(0, 0, 0, 0);
                return parcelDate >= date && parcelDate < nextDate && p.deliverystatus === 'delivered';
            });

            const dailyEarning = dayParcels.reduce((sum, p) => sum + (p.riderEarning || p.deliveryCharge || 50), 0);

            earnings.push({
                name: dayName,
                earnings: dailyEarning,
                deliveries: dayParcels.length
            });
        }

        return earnings;
    };

    const updateDeliveryStatus = async (parcelId, status, action) => {
        try {
            let updateData = { deliverystatus: status };

            if (status === 'picked-up') {
                updateData.pickedUpBy = user?.email;
                updateData.pickedUpAt = new Date();
            } else if (status === 'delivered') {
                updateData.deliveredBy = user?.email;
                updateData.deliveredAt = new Date();
            } else if (status === 'pending-pickup') {
                updateData.rejectedBy = user?.email;
                updateData.rejectionReason = action === 'reject' ? 'Rider rejected the delivery' : '';
            }

            await axios.patch(`/parcels/deliverystatus/${parcelId}`, updateData);
            fetchRiderData(); // রিফ্রেশ ডাটা
        } catch (error) {
            console.error("Error updating delivery status:", error);
        }
    };

    const StatCard = ({ title, value, icon, bgColor, textColor, trend, change }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${bgColor} rounded-2xl p-6 shadow-lg hover:shadow-xl transition cursor-pointer`}
            whileHover={{ scale: 1.02 }}
        >
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-gray-600 text-sm mb-1">{title}</p>
                    <p className={`text-3xl font-bold ${textColor}`}>
                        {title === 'Earnings' ? `৳${value.toLocaleString()}` : value}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                        {trend === "up" ?
                            <FaArrowUp className="text-green-500 text-xs" /> :
                            <FaArrowDown className="text-red-500 text-xs" />
                        }
                        <span className={`text-xs ${trend === "up" ? "text-green-500" : "text-red-500"}`}>
                            {change}
                        </span>
                        <span className="text-gray-500 text-xs">from last week</span>
                    </div>
                </div>
                <div className={`${textColor}`}>{icon}</div>
            </div>
        </motion.div>
    );

    const getStatusBadge = (status) => {
        const badges = {
            'assigned': 'bg-blue-100 text-blue-700',
            'picked-up': 'bg-purple-100 text-purple-700',
            'delivered': 'bg-green-100 text-green-700',
            'pending-pickup': 'bg-yellow-100 text-yellow-700',
            'cancelled': 'bg-red-100 text-red-700'
        };
        return badges[status] || 'bg-gray-100 text-gray-700';
    };

    const getStatusText = (status) => {
        const texts = {
            'assigned': 'Assigned',
            'picked-up': 'Picked Up',
            'delivered': 'Delivered',
            'pending-pickup': 'Pending',
            'cancelled': 'Cancelled'
        };
        return texts[status] || status;
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="space-y-6 p-6">
            {/* Welcome Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
            >
                <h1 className="text-3xl font-bold text-[#03373d]">Welcome back, {user?.displayName || 'Rider'}! 🏍️</h1>
                <p className="text-gray-600">Manage your deliveries and track your performance</p>
            </motion.div>

            {/* 4 Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Assigned"
                    value={stats.assigned}
                    icon={<FaTruck className="text-3xl" />}
                    bgColor="bg-blue-50" textColor="text-blue-600" trend="up" change="+2"
                />
                <StatCard
                    title="Completed"
                    value={stats.completed}
                    icon={<FaCheckCircle className="text-3xl" />}
                    bgColor="bg-green-50" textColor="text-green-600" trend="up" change="+5"
                />
                <StatCard
                    title="Pending"
                    value={stats.pending}
                    icon={<FaClock className="text-3xl" />}
                    bgColor="bg-orange-50" textColor="text-orange-600" trend="down" change="-1"
                />
                <StatCard
                    title="Earnings"
                    value={stats.earnings}
                    icon={<FaMoneyBillWave className="text-3xl" />}
                    bgColor="bg-purple-50" textColor="text-purple-600" trend="up" change="+12%"
                />
            </div>

            {/* Middle: Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Delivery Trend Chart */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-lg p-6"
                >
                    <h3 className="text-xl font-bold text-[#03373d] mb-4">📊 Delivery Trend (Last 7 Days)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={deliveryTrend}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="deliveries"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                name="Total Deliveries"
                                dot={{ fill: '#3b82f6', r: 4 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="completed"
                                stroke="#10b981"
                                strokeWidth={2}
                                name="Completed"
                                dot={{ fill: '#10b981', r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Earnings Chart */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-white rounded-2xl shadow-lg p-6"
                >
                    <h3 className="text-xl font-bold text-[#03373d] mb-4">💰 Earnings (Last 30 Days)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={earningsData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" interval={6} angle={-45} textAnchor="end" height={60} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Area
                                type="monotone"
                                dataKey="earnings"
                                stroke="#8b5cf6"
                                fill="#8b5cf6"
                                fillOpacity={0.3}
                                name="Earnings (৳)"
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            {/* Bottom: Assigned Deliveries Table & History */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Assigned Deliveries Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="bg-white rounded-2xl shadow-lg p-6"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-[#03373d]">📦 Assigned Deliveries</h3>
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                            {assignedDeliveries.length} Active
                        </span>
                    </div>

                    <div className="overflow-x-auto max-h-96 overflow-y-auto">
                        {assignedDeliveries.length > 0 ? (
                            <table className="w-full">
                                <thead className="sticky top-0 bg-white">
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-3 text-gray-600 font-semibold text-sm">Tracking ID</th>
                                        <th className="text-left py-3 px-3 text-gray-600 font-semibold text-sm">Customer</th>
                                        <th className="text-left py-3 px-3 text-gray-600 font-semibold text-sm">Address</th>
                                        <th className="text-left py-3 px-3 text-gray-600 font-semibold text-sm">Status</th>
                                        <th className="text-left py-3 px-3 text-gray-600 font-semibold text-sm">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assignedDeliveries.map((parcel) => (
                                        <tr key={parcel._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                            <td className="py-3 px-3 text-sm font-mono font-semibold text-[#03373d]">
                                                {parcel.trackingId || 'N/A'}
                                            </td>
                                            <td className="py-3 px-3">
                                                <div className="text-sm font-medium text-gray-800">{parcel.senderName}</div>
                                                <div className="text-xs text-gray-500 flex items-center gap-1">
                                                    <FaPhone className="text-xs" /> {parcel.senderPhone}
                                                </div>
                                            </td>
                                            <td className="py-3 px-3 text-sm text-gray-600 max-w-xs truncate">
                                                <div className="flex items-center gap-1">
                                                    <FaMapMarkerAlt className="text-xs text-gray-400" />
                                                    {parcel.deliveryAddress}
                                                </div>
                                            </td>
                                            <td className="py-3 px-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(parcel.deliverystatus)}`}>
                                                    {getStatusText(parcel.deliverystatus)}
                                                </span>
                                            </td>
                                            <td className="py-3 px-3">
                                                <div className="flex gap-2">
                                                    {parcel.deliverystatus === 'assigned' && (
                                                        <button
                                                            onClick={() => updateDeliveryStatus(parcel._id, 'picked-up', 'pickup')}
                                                            className="bg-blue-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-blue-600 transition"
                                                        >
                                                            Pick Up
                                                        </button>
                                                    )}
                                                    {parcel.deliverystatus === 'picked-up' && (
                                                        <button
                                                            onClick={() => updateDeliveryStatus(parcel._id, 'delivered', 'deliver')}
                                                            className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-green-600 transition"
                                                        >
                                                            Deliver
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => updateDeliveryStatus(parcel._id, 'pending-pickup', 'reject')}
                                                        className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-red-600 transition"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center py-12">
                                <FaBox className="text-5xl text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">No assigned deliveries at the moment</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Delivery History */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="bg-white rounded-2xl shadow-lg p-6"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-[#03373d]">📜 Delivery History</h3>
                        <FaHistory className="text-gray-400" />
                    </div>

                    <div className="overflow-x-auto max-h-96 overflow-y-auto">
                        {deliveryHistory.length > 0 ? (
                            <table className="w-full">
                                <thead className="sticky top-0 bg-white">
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-3 text-gray-600 font-semibold text-sm">Tracking ID</th>
                                        <th className="text-left py-3 px-3 text-gray-600 font-semibold text-sm">Customer</th>
                                        <th className="text-left py-3 px-3 text-gray-600 font-semibold text-sm">Status</th>
                                        <th className="text-left py-3 px-3 text-gray-600 font-semibold text-sm">Earning</th>
                                        <th className="text-left py-3 px-3 text-gray-600 font-semibold text-sm">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {deliveryHistory.map((parcel) => (
                                        <tr key={parcel._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                            <td className="py-3 px-3 text-sm font-mono font-semibold text-[#03373d]">
                                                {parcel.trackingId || 'N/A'}
                                            </td>
                                            <td className="py-3 px-3">
                                                <div className="text-sm font-medium text-gray-800">{parcel.senderName}</div>
                                                <div className="text-xs text-gray-500">{parcel.senderPhone}</div>
                                            </td>
                                            <td className="py-3 px-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(parcel.deliverystatus)}`}>
                                                    {getStatusText(parcel.deliverystatus)}
                                                </span>
                                            </td>
                                            <td className="py-3 px-3 text-sm font-semibold text-green-600">
                                                ৳{parcel.riderEarning || parcel.deliveryCharge || 50}
                                            </td>
                                            <td className="py-3 px-3 text-xs text-gray-500">
                                                {new Date(parcel.deliveredAt || parcel.updatedAt || parcel.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center py-12">
                                <FaHistory className="text-5xl text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">No delivery history yet</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Riderhome;