"use client";

import React, { useState, useEffect } from "react";
import {
    FaBox,
    FaCheckCircle,
    FaClock,
    FaMoneyBillWave,
    FaArrowUp,
    FaArrowDown,
    FaTruck,
} from "react-icons/fa";
import { motion } from "framer-motion";
import useAuth from "../../(site)/hooks/useAuth";
import useAxios from "../../(site)/hooks/useAxios";

export default function OverviewPage() {
    const { user } = useAuth();
    const axios = useAxios();
    const [stats, setStats] = useState({
        totalParcels: 0,
        deliveredParcels: 0,
        pendingParcels: 0,
        totalSpent: 0,
    });
    const [recentParcels, setRecentParcels] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await axios.get('/parcels/user');
            const parcels = response.data || [];

            const delivered = parcels.filter(p => p.status === 'delivered').length;
            const pending = parcels.filter(p => p.status === 'pending').length;
            const totalSpent = parcels.reduce((sum, p) => sum + (p.totalPrice || 0), 0);

            setStats({
                totalParcels: parcels.length,
                deliveredParcels: delivered,
                pendingParcels: pending,
                totalSpent: totalSpent,
            });

            setRecentParcels(parcels.slice(0, 5));
            setLoading(false);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            setLoading(false);
        }
    };

    const statCards = [
        {
            title: "Total Parcels",
            value: stats.totalParcels,
            icon: <FaBox className="text-3xl" />,
            bgColor: "bg-blue-50",
            textColor: "text-blue-600",
            change: "+12%",
            trend: "up",
        },
        {
            title: "Delivered",
            value: stats.deliveredParcels,
            icon: <FaCheckCircle className="text-3xl" />,
            bgColor: "bg-green-50",
            textColor: "text-green-600",
            change: "+8%",
            trend: "up",
        },
        {
            title: "Pending",
            value: stats.pendingParcels,
            icon: <FaClock className="text-3xl" />,
            bgColor: "bg-orange-50",
            textColor: "text-orange-600",
            change: "-5%",
            trend: "down",
        },
        {
            title: "Total Spent",
            value: `৳${stats.totalSpent.toLocaleString()}`,
            icon: <FaMoneyBillWave className="text-3xl" />,
            bgColor: "bg-purple-50",
            textColor: "text-purple-600",
            change: "+15%",
            trend: "up",
        },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 text-green-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#03373d] border-t-[#caeb66] rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl md:text-4xl font-bold text-[#03373d] mb-2">
                    Welcome back, {user?.displayName || "User"}! 👋
                </h1>
                <p className="text-gray-600">
                    Here's what's happening with your deliveries today.
                </p>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`${stat.bgColor} rounded-2xl p-6 shadow-lg hover:shadow-xl transition`}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                                <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
                                <div className="flex items-center gap-1 mt-2">
                                    {stat.trend === "up" ? (
                                        <FaArrowUp className="text-green-500 text-xs" />
                                    ) : (
                                        <FaArrowDown className="text-red-500 text-xs" />
                                    )}
                                    <span className={`text-xs ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                                        {stat.change}
                                    </span>
                                    <span className="text-gray-500 text-xs">from last month</span>
                                </div>
                            </div>
                            <div className={`${stat.textColor}`}>{stat.icon}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Recent Parcels Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white rounded-2xl shadow-lg p-6"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-[#03373d]">Recent Parcels</h2>
                    <button className="text-[#caeb66] hover:text-[#03373d] transition text-sm font-semibold">
                        View All →
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Tracking ID</th>
                                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Parcel Name</th>
                                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Weight</th>
                                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Price</th>
                                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentParcels.length > 0 ? (
                                recentParcels.map((parcel, index) => (
                                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                        <td className="py-3 px-4 text-sm text-gray-700">#ZAP{index + 1001}</td>
                                        <td className="py-3 px-4 text-sm text-gray-700">{parcel.parcelName}</td>
                                        <td className="py-3 px-4 text-sm text-gray-700">{parcel.parcelWeight} kg</td>
                                        <td className="py-3 px-4 text-sm font-semibold text-[#03373d]">৳{parcel.totalPrice}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(parcel.status)}`}>
                                                {parcel.status || "Pending"}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-8 text-gray-500">
                                        No parcels found. Send your first parcel!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
                <div className="bg-gradient-to-r from-[#03373d] to-[#1a5c64] rounded-2xl p-6 text-white">
                    <FaTruck className="text-4xl mb-3" />
                    <h3 className="text-xl font-bold mb-2">Send a Parcel</h3>
                    <p className="text-gray-200 text-sm mb-4">Book a delivery for your parcel</p>
                    <button className="bg-[#caeb66] text-[#03373d] px-4 py-2 rounded-lg font-semibold text-sm hover:scale-105 transition">
                        Send Now →
                    </button>
                </div>

                <div className="bg-gradient-to-r from-[#caeb66] to-[#e0ff80] rounded-2xl p-6 text-[#03373d]">
                    <FaCheckCircle className="text-4xl mb-3" />
                    <h3 className="text-xl font-bold mb-2">Track Parcel</h3>
                    <p className="text-gray-700 text-sm mb-4">Track your delivery in real-time</p>
                    <button className="bg-[#03373d] text-white px-4 py-2 rounded-lg font-semibold text-sm hover:scale-105 transition">
                        Track Now →
                    </button>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                    <FaMoneyBillWave className="text-4xl mb-3 text-[#03373d]" />
                    <h3 className="text-xl font-bold text-[#03373d] mb-2">Check Pricing</h3>
                    <p className="text-gray-600 text-sm mb-4">View delivery rates</p>
                    <button className="bg-[#03373d] text-white px-4 py-2 rounded-lg font-semibold text-sm hover:scale-105 transition">
                        View Pricing →
                    </button>
                </div>
            </motion.div>
        </div>
    );
}