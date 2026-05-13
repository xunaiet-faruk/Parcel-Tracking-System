"use client";

import React, { useState, useEffect } from 'react';
import {
    LineChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { motion } from 'framer-motion';
import {
    FaBox, FaCheckCircle, FaClock, FaMoneyBillWave,
    FaTruck, FaEye, FaPlus, FaCopy
} from 'react-icons/fa';
import useAuth from '../../(site)/hooks/useAuth';
import useAxios from '../../(site)/hooks/useAxios';
import Loading from '@/app/components/Loading';
import Link from 'next/link';

const Userhome = () => {
    const { user } = useAuth();
    const axios = useAxios();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalParcels: 0,
        deliveredParcels: 0,
        pendingParcels: 0,
        totalSpent: 0
    });
    const [recentParcels, setRecentParcels] = useState([]);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        if (user?.email) {
            fetchUserData();
        }
    }, [user?.email]);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const email = user?.email;

            console.log("🔍 Fetching parcels for email:", email);

            const response = await axios.get(`/parcels?email=${email}`);
            let parcels = response.data || [];

            if (!Array.isArray(parcels)) {
                parcels = [];
            }

            console.log("📦 Total parcels from API:", parcels.length);

            if (parcels.length > 0) {
                console.log("📋 First parcel sample:", parcels[0]);
            }

            // স্ট্যাটস ক্যালকুলেশন
            const totalParcels = parcels.length;
            const deliveredParcels = parcels.filter(p => {
                const status = p.deliverystatus || p.status;
                return status === 'delivered';
            }).length;

            const pendingParcels = parcels.filter(p => {
                const status = p.deliverystatus || p.status;
                return status === 'pending-pickup' || status === 'assigned' || status === 'pending';
            }).length;

            const totalSpent = parcels.reduce((sum, p) => sum + (parseFloat(p.totalPrice) || 0), 0);

            console.log("📊 Stats calculated:", { totalParcels, deliveredParcels, pendingParcels, totalSpent });

            setStats({
                totalParcels,
                deliveredParcels,
                pendingParcels,
                totalSpent
            });

            // রিসেন্ট প্যাকেল
            const recent = [...parcels]
                .sort((a, b) => {
                    const dateA = new Date(a.bookingDate || a.createdAt || a.date || a.created_date || 0);
                    const dateB = new Date(b.bookingDate || b.createdAt || b.date || b.created_date || 0);
                    return dateB - dateA;
                })
                .slice(0, 5);
            setRecentParcels(recent);

            // চার্টের জন্য ডাটা - bookingDate ব্যবহার করে
            const chartData = getChartData(parcels);
            console.log("📈 Chart data:", chartData);
            setChartData(chartData);

            setLoading(false);
        } catch (error) {
            console.error("❌ Error fetching data:", error);
            setLoading(false);
        }
    };

    const getChartData = (parcels) => {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const data = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(today.getDate() - i);
            date.setHours(0, 0, 0, 0);

            const nextDate = new Date(date);
            nextDate.setDate(date.getDate() + 1);

            // দিনের নাম বের করা
            const dayIndex = date.getDay();
            const dayName = dayIndex === 0 ? 'Sun' :
                dayIndex === 1 ? 'Mon' :
                    dayIndex === 2 ? 'Tue' :
                        dayIndex === 3 ? 'Wed' :
                            dayIndex === 4 ? 'Thu' :
                                dayIndex === 5 ? 'Fri' : 'Sat';

            // এই দিনের প্যাকেল ফিল্টার করুন - bookingDate ব্যবহার করে
            const dayParcels = parcels.filter(p => {
                let parcelDate = p.bookingDate || p.createdAt || p.date || p.created_date;
                if (!parcelDate) return false;

                try {
                    if (typeof parcelDate === 'string') {
                        parcelDate = new Date(parcelDate);
                    } else if (parcelDate._seconds) {
                        parcelDate = new Date(parcelDate._seconds * 1000);
                    }

                    if (isNaN(parcelDate.getTime())) return false;

                    parcelDate.setHours(0, 0, 0, 0);
                    return parcelDate >= date && parcelDate < nextDate;
                } catch (e) {
                    return false;
                }
            });

            data.push({
                name: dayName,
                totalParcels: dayParcels.length,
                delivered: dayParcels.filter(p => {
                    const status = p.deliverystatus || p.status;
                    return status === 'delivered';
                }).length,
                amount: dayParcels.reduce((sum, p) => sum + (parseFloat(p.totalPrice) || 0), 0)
            });
        }

        return data;
    };

    const getStatusColor = (status) => {
        const colors = {
            'delivered': 'bg-green-100 text-green-700',
            'pending-pickup': 'bg-yellow-100 text-yellow-700',
            'assigned': 'bg-blue-100 text-blue-700',
            'picked-up': 'bg-purple-100 text-purple-700',
            'cancelled': 'bg-red-100 text-red-700',
            'pending': 'bg-yellow-100 text-yellow-700'
        };
        return colors[status] || 'bg-gray-100 text-gray-700';
    };

    const getStatusText = (status) => {
        const texts = {
            'delivered': 'Delivered',
            'pending-pickup': 'Pending',
            'assigned': 'Assigned',
            'picked-up': 'Picked Up',
            'cancelled': 'Cancelled',
            'pending': 'Pending'
        };
        return texts[status] || status || 'Pending';
    };

    const copyTrackingId = (trackingId) => {
        if (trackingId) {
            navigator.clipboard.writeText(trackingId);
            alert('Tracking ID copied!');
        }
    };

    const StatCard = ({ title, value, icon, bgColor, textColor }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${bgColor} rounded-2xl p-6 shadow-lg hover:shadow-xl transition`}
            whileHover={{ scale: 1.02 }}
        >
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-gray-600 text-sm mb-1">{title}</p>
                    <p className={`text-3xl font-bold ${textColor}`}>
                        {title === 'Total Spent' ? `৳${value.toLocaleString()}` : value}
                    </p>
                </div>
                <div className={`${textColor}`}>{icon}</div>
            </div>
        </motion.div>
    );

    if (loading) {
        return <Loading />;
    }

    // চেক করুন চার্টে ডাটা আছে কিনা
    const hasChartData = chartData.some(d => d.totalParcels > 0 || d.delivered > 0 || d.amount > 0);

    return (
        <div className="space-y-6 p-6">
            {/* Welcome Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-center flex-wrap gap-4"
            >
                <div>
                    <h1 className="text-3xl font-bold text-[#03373d]">
                        Welcome back, {user?.displayName || 'User'}! 👋
                    </h1>
                    <p className="text-gray-600">Track your parcels and manage your deliveries</p>
                </div>
                <Link href="/parcel">
                    <button className="bg-[#03373d] text-white px-6 py-3 rounded-xl hover:bg-[#caeb66] hover:text-[#03373d] transition flex items-center gap-2 font-semibold">
                        <FaPlus /> Send Parcel
                    </button>
                </Link>
            </motion.div>

            {/* 4 Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Parcels" value={stats.totalParcels} icon={<FaBox className="text-2xl" />} bgColor="bg-blue-50" textColor="text-blue-600" />
                <StatCard title="Delivered" value={stats.deliveredParcels} icon={<FaCheckCircle className="text-2xl" />} bgColor="bg-green-50" textColor="text-green-600" />
                <StatCard title="Pending" value={stats.pendingParcels} icon={<FaClock className="text-2xl" />} bgColor="bg-orange-50" textColor="text-orange-600" />
                <StatCard title="Total Spent" value={stats.totalSpent} icon={<FaMoneyBillWave className="text-2xl" />} bgColor="bg-purple-50" textColor="text-purple-600" />
            </div>

            {/* Main Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg p-6"
            >
                <h3 className="text-xl font-bold text-[#03373d] mb-4">📊 Delivery Overview (Last 7 Days)</h3>
                {hasChartData ? (
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" />
                            <Tooltip />
                            <Legend />
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="totalParcels"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                name="Total Parcels"
                                dot={{ fill: '#3b82f6', r: 4 }}
                            />
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="delivered"
                                stroke="#10b981"
                                strokeWidth={2}
                                name="Delivered"
                                dot={{ fill: '#10b981', r: 4 }}
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="amount"
                                stroke="#8b5cf6"
                                strokeWidth={2}
                                name="Amount (৳)"
                                dot={{ fill: '#8b5cf6', r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-96 flex flex-col items-center justify-center text-gray-500">
                        <FaBox className="text-5xl mb-3 text-gray-300" />
                        <p className="text-lg">No chart data available</p>
                        <p className="text-sm mt-1">Send your first parcel to see analytics</p>
                    </div>
                )}
            </motion.div>

            {/* Recent Parcels Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg p-6"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-[#03373d]">📦 Recent Parcels</h2>
                    <Link href="/dashboard/my-parcels">
                        <button className="text-[#caeb66] hover:text-[#03373d] transition text-sm font-semibold">
                            View All →
                        </button>
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Tracking ID</th>
                                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Parcel Name</th>
                                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Price</th>
                                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Status</th>
                                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Date</th>
                                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentParcels.length > 0 ? (
                                recentParcels.map((parcel, index) => {
                                    const status = parcel.deliverystatus || parcel.status || 'pending';
                                    return (
                                        <tr key={parcel._id || index} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-mono font-semibold text-[#03373d]">
                                                        {parcel.trackingId || `#ZAP${index + 1001}`}
                                                    </span>
                                                    <button
                                                        onClick={() => copyTrackingId(parcel.trackingId)}
                                                        className="text-gray-400 hover:text-[#03373d]"
                                                    >
                                                        <FaCopy className="text-xs" />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-700">{parcel.parcelName}</td>
                                            <td className="py-3 px-4 text-sm font-semibold text-[#03373d]">৳{parcel.totalPrice}</td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
                                                    {getStatusText(status)}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-xs text-gray-500">
                                                {parcel.bookingDate ? new Date(parcel.bookingDate).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="py-3 px-4">
                                                <Link href={"/dashboard/track-parcel"}>
                                                    <button className="bg-[#03373d] text-white px-3 py-1 rounded-lg text-xs hover:bg-[#caeb66] hover:text-[#03373d] transition flex items-center gap-1">
                                                        <FaEye className="text-xs" /> Track
                                                    </button>
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-8 text-gray-500">
                                        <FaBox className="text-4xl mx-auto mb-2 text-gray-300" />
                                        No parcels found. Send your first parcel!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Quick Action */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-[#03373d] to-[#1a5c64] rounded-2xl p-6 text-white"
            >
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <div>
                        <FaTruck className="text-4xl mb-3" />
                        <h3 className="text-xl font-bold mb-2">Need to send a parcel?</h3>
                        <p className="text-gray-200">Book a delivery and track in real-time</p>
                    </div>
                    <Link href="/parcel">
                        <button className="bg-[#caeb66] text-[#03373d] px-6 py-3 rounded-xl font-semibold hover:scale-105 transition">
                            Send Now →
                        </button>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Userhome;