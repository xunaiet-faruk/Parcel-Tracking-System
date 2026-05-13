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
    FaUsers,
    FaSearch,
    FaFilter,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../../(site)/hooks/useAuth";
import useAxios from "../../(site)/hooks/useAxios";
import Loading from "@/app/components/Loading";
import AdminOverview from './AdminOverview'
export default function Adminhome() {
    const { user } = useAuth();
    const axios = useAxios();
    const [stats, setStats] = useState({
        totalParcels: 0,
        deliveredParcels: 0,
        pendingParcels: 0,
        totalRevenue: 0,
        totalUsers: 0,
        activeDeliveries: 0,
        totalRiders: 0,
    });
    const [allParcels, setAllParcels] = useState([]);
    const [filteredParcels, setFilteredParcels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        fetchAdminDashboardData();
        const interval = setInterval(fetchAdminDashboardData, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        filterParcels();
    }, [searchTerm, statusFilter, allParcels]);

    const fetchAdminDashboardData = async () => {
        try {
            const [statsResponse, parcelsResponse] = await Promise.all([
                axios.get('/admin/dashboard/stats'),
                axios.get('/admin/parcels/all')
            ]);

            setStats(statsResponse.data);
            setAllParcels(parcelsResponse.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching admin dashboard data:", error);
            setLoading(false);
        }
    };

    const filterParcels = () => {
        let filtered = [...allParcels];

        if (searchTerm) {
            filtered = filtered.filter(parcel =>
                parcel.trackingId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                parcel.parcelName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                parcel.senderName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                parcel.senderEmail?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter !== "all") {
            if (statusFilter === "pending") {
                filtered = filtered.filter(parcel =>
                    parcel.deliverystatus === 'pending-pickup' ||
                    parcel.deliverystatus === 'assigned'
                );
            } else {
                filtered = filtered.filter(parcel => parcel.deliverystatus === statusFilter);
            }
        }

        setFilteredParcels(filtered);
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
            title: "Total Revenue",
            value: `৳${stats.totalRevenue.toLocaleString()}`,
            icon: <FaMoneyBillWave className="text-3xl" />,
            bgColor: "bg-purple-50",
            textColor: "text-purple-600",
            change: "+15%",
            trend: "up",
        },
        {
            title: "Total Users",
            value: stats.totalUsers,
            icon: <FaUsers className="text-3xl" />,
            bgColor: "bg-indigo-50",
            textColor: "text-indigo-600",
            change: "+5%",
            trend: "up",
        },
        {
            title: "Active Deliveries",
            value: stats.activeDeliveries,
            icon: <FaTruck className="text-3xl" />,
            bgColor: "bg-cyan-50",
            textColor: "text-cyan-600",
            change: "-2%",
            trend: "down",
        },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 text-green-700';
            case 'pending-pickup': return 'bg-yellow-100 text-yellow-700';
            case 'assigned': return 'bg-blue-100 text-blue-700';
            case 'picked-up': return 'bg-purple-100 text-purple-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'delivered': return 'Delivered';
            case 'pending-pickup': return 'Pending';
            case 'assigned': return 'Assigned';
            case 'picked-up': return 'Picked Up';
            case 'cancelled': return 'Cancelled';
            default: return status || 'Pending';
        }
    };

    if (loading) {
        return <Loading />
    }

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex justify-between items-center"
            >
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-[#03373d] mb-2">
                        Welcome back, {user?.displayName || "Admin"}! 👋
                    </h1>
                    <p className="text-gray-600">
                        Here's what's happening with all deliveries today.
                    </p>
                </div>
                <button
                    onClick={fetchAdminDashboardData}
                    className="bg-[#03373d] text-white px-4 py-2 rounded-lg hover:bg-[#caeb66] hover:text-[#03373d] transition flex items-center gap-2"
                >
                    <FaBox className="text-sm" />
                    Refresh
                </button>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

            {/* Filter Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-2xl shadow-lg p-6"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by ID, name, or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#caeb66]"
                        />
                    </div>

                    <div className="relative">
                        <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#caeb66]"
                        >
                            <option value="all">All Status</option>
                            <option value="pending-pickup">Pending</option>
                            <option value="assigned">Assigned</option>
                            <option value="picked-up">Picked Up</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>
            </motion.div>

            {/* All Parcels Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white rounded-2xl shadow-lg p-6"
            >
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-[#03373d]">All Parcels</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Showing {filteredParcels.length} of {allParcels.length} parcels
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Tracking ID</th>
                                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Sender</th>
                                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Parcel Name</th>
                                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Weight</th>
                                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Price</th>
                                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {filteredParcels.length > 0 ? (
                                    filteredParcels.map((parcel, index) => (
                                        <motion.tr
                                            key={parcel._id || index}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="border-b border-gray-100 hover:bg-gray-50 transition"
                                        >
                                            <td className="py-3 px-4 text-sm font-mono font-semibold text-[#03373d]">
                                                {parcel.trackingId || `#ZAP${index + 1001}`}
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="text-sm text-gray-700">{parcel.senderName || "N/A"}</div>
                                                <div className="text-xs text-gray-500">{parcel.senderEmail || "N/A"}</div>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-700">{parcel.parcelName}</td>
                                            <td className="py-3 px-4 text-sm text-gray-700">{parcel.parcelWeight} kg</td>
                                            <td className="py-3 px-4 text-sm font-semibold text-[#03373d]">৳{parcel.totalPrice}</td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(parcel.deliverystatus)}`}>
                                                    {getStatusText(parcel.deliverystatus)}
                                                </span>
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-8 text-gray-500">
                                            <FaBox className="text-4xl mx-auto mb-2 text-gray-300" />
                                            No parcels found.
                                        </td>
                                    </tr>
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Chart Actions */}
            <AdminOverview/>
            
        </div>
    );
}