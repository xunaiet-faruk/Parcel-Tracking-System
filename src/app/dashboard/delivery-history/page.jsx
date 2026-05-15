"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaBox, FaCheckCircle, FaClock, FaMoneyBillWave,
    FaTruck, FaMapMarkerAlt, FaUser, FaPhone, FaCalendarAlt,
    FaSearch, FaFilter, FaDownload, FaEye, FaStar,
    FaChartLine, FaHistory, FaArrowUp, FaArrowDown
} from 'react-icons/fa';
import useAuth from '../../(site)/hooks/useAuth';
import useAxios from '../../(site)/hooks/useAxios';
import Loading from '@/app/components/Loading';
import Link from 'next/link';
import Riderprotract from '../Riderprotuct/Riderprotract';

const Deliveryhistory = () => {
    const { user } = useAuth();
    const axios = useAxios();
    const [loading, setLoading] = useState(true);
    const [deliveries, setDeliveries] = useState([]);
    const [filteredDeliveries, setFilteredDeliveries] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');

    useEffect(() => {
        if (user?.email) {
            fetchDeliveryHistory();
        }
    }, [user?.email]);

    useEffect(() => {
        filterAndSortDeliveries();
    }, [searchTerm, statusFilter, sortBy, sortOrder, deliveries]);

    const fetchDeliveryHistory = async () => {
        try {
            setLoading(true);
            const email = user?.email;
            const response = await axios.get(`/parcels?riderEmail=${email}`);
            const parcels = response.data || [];

            console.log('Total deliveries:', parcels.length);

            setDeliveries(parcels);

        
            setLoading(false);
        } catch (error) {
            console.error("Error fetching delivery history:", error);
            setLoading(false);
        }
    };

    const filterAndSortDeliveries = () => {
        let filtered = [...deliveries];

        // সার্চ ফিল্টার
        if (searchTerm) {
            filtered = filtered.filter(d =>
                d.trackingId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                d.parcelName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                d.senderName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                d.receiverName?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // স্ট্যাটাস ফিল্টার
        if (statusFilter !== 'all') {
            filtered = filtered.filter(d => d.deliverystatus === statusFilter);
        }

        // সোর্টিং
        filtered.sort((a, b) => {
            let aVal, bVal;
            switch (sortBy) {
                case 'date':
                    aVal = new Date(a.deliveredAt || a.updatedAt || a.createdAt);
                    bVal = new Date(b.deliveredAt || b.updatedAt || b.createdAt);
                    break;
                case 'amount':
                    aVal = a.totalPrice || 0;
                    bVal = b.totalPrice || 0;
                    break;
                case 'earning':
                    aVal = a.riderEarning || a.deliveryCharge || 0;
                    bVal = b.riderEarning || b.deliveryCharge || 0;
                    break;
                default:
                    aVal = new Date(a.deliveredAt || a.updatedAt || a.createdAt);
                    bVal = new Date(b.deliveredAt || b.updatedAt || b.createdAt);
            }

            if (sortOrder === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });

        setFilteredDeliveries(filtered);
    };

    const formatDate = (dateValue) => {
        if (!dateValue) return 'N/A';
        try {
            const date = new Date(dateValue);
            if (isNaN(date.getTime())) return 'N/A';
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return 'N/A';
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'delivered': 'bg-green-100 text-green-700',
            'cancelled': 'bg-red-100 text-red-700',
            'picked-up': 'bg-purple-100 text-purple-700',
            'assigned': 'bg-blue-100 text-blue-700',
            'pending-pickup': 'bg-yellow-100 text-yellow-700'
        };
        return colors[status] || 'bg-gray-100 text-gray-700';
    };

    const getStatusText = (status) => {
        const texts = {
            'delivered': 'Delivered',
            'cancelled': 'Cancelled',
            'picked-up': 'Picked Up',
            'assigned': 'Assigned',
            'pending-pickup': 'Pending'
        };
        return texts[status] || status;
    };

    const getStatusIcon = (status) => {
        const icons = {
            'delivered': <FaCheckCircle className="text-green-600" />,
            'cancelled': <FaBox className="text-red-600" />,
            'picked-up': <FaTruck className="text-purple-600" />
        };
        return icons[status] || <FaClock className="text-yellow-600" />;
    };

    const StatCard = ({ title, value, icon, bgColor, textColor, change }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${bgColor} rounded-2xl p-6 shadow-lg hover:shadow-xl transition`}
            whileHover={{ scale: 1.02 }}
        >
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-gray-600 text-sm mb-1">{title}</p>
                    <p className={`text-2xl font-bold ${textColor}`}>
                        {title === 'Total Earnings' ? `৳${value.toLocaleString()}` : value}
                    </p>
                    {change && (
                        <div className="flex items-center gap-1 mt-2">
                            {change > 0 ? <FaArrowUp className="text-green-500 text-xs" /> : <FaArrowDown className="text-red-500 text-xs" />}
                            <span className={`text-xs ${change > 0 ? "text-green-500" : "text-red-500"}`}>{Math.abs(change)}%</span>
                            <span className="text-gray-500 text-xs">from last month</span>
                        </div>
                    )}
                </div>
                <div className={`${textColor}`}>{icon}</div>
            </div>
        </motion.div>
    );

    if (loading) {
        return <Loading />;
    }

    return (
       <Riderprotract>
            <div className=" bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h1 className="text-3xl md:text-4xl font-bold text-[#03373d] mb-2">
                            Delivery History
                        </h1>
                        <p className="text-gray-600">
                            Track your delivery performance and earnings
                        </p>
                    </motion.div>



                    {/* Search and Filter */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-lg p-6 mb-8"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by tracking ID, parcel name, customer..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#caeb66]"
                                />
                            </div>

                            <div className="relative">
                                <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#caeb66]"
                                >
                                    <option value="all">All Status</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                    <option value="picked-up">Picked Up</option>
                                    <option value="assigned">Assigned</option>
                                </select>
                            </div>

                            <div className="flex gap-2">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#caeb66]"
                                >
                                    <option value="date">Sort by Date</option>
                                    <option value="amount">Sort by Amount</option>
                                    <option value="earning">Sort by Earning</option>
                                </select>
                                <button
                                    onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                                    className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                                >
                                    {sortOrder === 'desc' ? '↓' : '↑'}
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Delivery List */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm">Tracking ID</th>
                                        <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm">Parcel</th>
                                        <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm">Customer</th>
                                        <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm">Amount</th>
                                        <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm">Earning</th>
                                        <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm">Status</th>
                                        <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm">Date</th>
                                        <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <AnimatePresence>
                                        {filteredDeliveries.length > 0 ? (
                                            filteredDeliveries.map((delivery, index) => (
                                                <motion.tr
                                                    key={delivery._id || index}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer"
                                                    onClick={() => setSelectedDelivery(delivery)}
                                                >
                                                    <td className="py-4 px-6">
                                                        <span className="font-mono font-semibold text-[#03373d] text-sm">
                                                            {delivery.trackingId || 'N/A'}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <div className="text-sm font-medium text-gray-800">{delivery.parcelName}</div>
                                                        <div className="text-xs text-gray-500">{delivery.parcelWeight} kg</div>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <div className="text-sm text-gray-800">{delivery.senderName}</div>
                                                        <div className="text-xs text-gray-500 flex items-center gap-1">
                                                            <FaPhone className="text-xs" /> {delivery.senderPhone}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6 text-sm font-semibold text-[#03373d]">
                                                        ৳{delivery.totalPrice}
                                                    </td>
                                                    <td className="py-4 px-6 text-sm font-semibold text-green-600">
                                                        ৳{delivery.riderEarning || delivery.deliveryCharge || 50}
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(delivery.deliverystatus)}`}>
                                                            {getStatusIcon(delivery.deliverystatus)}
                                                            {getStatusText(delivery.deliverystatus)}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-6 text-xs text-gray-500">
                                                        {formatDate(delivery.deliveredAt || delivery.updatedAt || delivery.createdAt)}
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedDelivery(delivery);
                                                            }}
                                                            className="bg-[#03373d] text-white px-3 py-1 rounded-lg text-xs hover:bg-[#caeb66] hover:text-[#03373d] transition flex items-center gap-1"
                                                        >
                                                            <FaEye className="text-xs" /> Details
                                                        </button>
                                                    </td>
                                                </motion.tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="8" className="text-center py-12 text-gray-500">
                                                    <FaHistory className="text-5xl mx-auto mb-3 text-gray-300" />
                                                    <p>No delivery history found</p>
                                                    <p className="text-sm mt-1">Complete some deliveries to see them here</p>
                                                </td>
                                            </tr>
                                        )}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    </motion.div>

                    {/* Pagination */}
                    {filteredDeliveries.length > 10 && (
                        <div className="flex justify-center gap-2 mt-6">
                            <button className="px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-50 transition">Previous</button>
                            <button className="px-4 py-2 bg-[#03373d] text-white rounded-lg shadow">1</button>
                            <button className="px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-50 transition">2</button>
                            <button className="px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-50 transition">3</button>
                            <button className="px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-50 transition">Next</button>
                        </div>
                    )}

                    {/* Delivery Details Modal */}
                    <AnimatePresence>
                        {selectedDelivery && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                                onClick={() => setSelectedDelivery(null)}
                            >
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.9, opacity: 0 }}
                                    className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
                                        <div className="flex justify-between items-center">
                                            <h2 className="text-2xl font-bold text-[#03373d]">Delivery Details</h2>
                                            <button
                                                onClick={() => setSelectedDelivery(null)}
                                                className="text-gray-400 hover:text-gray-600 text-2xl"
                                            >
                                                ×
                                            </button>
                                        </div>
                                        <p className="text-sm text-gray-500 font-mono">{selectedDelivery.trackingId}</p>
                                    </div>

                                    <div className="p-6 space-y-4">
                                        {/* Parcel Info */}
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <h3 className="font-semibold text-[#03373d] mb-3 flex items-center gap-2">
                                                <FaBox /> Parcel Information
                                            </h3>
                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div><span className="text-gray-500">Parcel Name:</span> <span className="font-medium">{selectedDelivery.parcelName}</span></div>
                                                <div><span className="text-gray-500">Weight:</span> <span className="font-medium">{selectedDelivery.parcelWeight} kg</span></div>
                                                <div><span className="text-gray-500">Total Price:</span> <span className="font-medium text-green-600">৳{selectedDelivery.totalPrice}</span></div>
                                                <div><span className="text-gray-500">Your Earning:</span> <span className="font-medium text-green-600">৳{selectedDelivery.riderEarning || selectedDelivery.deliveryCharge || 50}</span></div>
                                                <div><span className="text-gray-500">Delivery Status:</span> <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedDelivery.deliverystatus)}`}>{getStatusText(selectedDelivery.deliverystatus)}</span></div>
                                            </div>
                                        </div>

                                        {/* Sender Info */}
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <h3 className="font-semibold text-[#03373d] mb-3 flex items-center gap-2">
                                                <FaUser /> Sender Information
                                            </h3>
                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div><span className="text-gray-500">Name:</span> <span className="font-medium">{selectedDelivery.senderName}</span></div>
                                                <div><span className="text-gray-500">Phone:</span> <span className="font-medium">{selectedDelivery.senderPhone}</span></div>
                                                <div><span className="text-gray-500">Email:</span> <span className="font-medium">{selectedDelivery.senderEmail}</span></div>
                                                <div><span className="text-gray-500">Address:</span> <span className="font-medium">{selectedDelivery.senderAddress}, {selectedDelivery.senderDistrict}</span></div>
                                            </div>
                                        </div>

                                        {/* Receiver Info */}
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <h3 className="font-semibold text-[#03373d] mb-3 flex items-center gap-2">
                                                <FaMapMarkerAlt /> Receiver Information
                                            </h3>
                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div><span className="text-gray-500">Name:</span> <span className="font-medium">{selectedDelivery.receiverName}</span></div>
                                                <div><span className="text-gray-500">Phone:</span> <span className="font-medium">{selectedDelivery.receiverPhone}</span></div>
                                                <div><span className="text-gray-500">Email:</span> <span className="font-medium">{selectedDelivery.receiverEmail}</span></div>
                                                <div><span className="text-gray-500">Address:</span> <span className="font-medium">{selectedDelivery.receiverAddress}, {selectedDelivery.receiverDistrict}</span></div>
                                            </div>
                                        </div>

                                        {/* Timeline */}
                                        {(selectedDelivery.deliveredAt || selectedDelivery.pickedUpAt) && (
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <h3 className="font-semibold text-[#03373d] mb-3 flex items-center gap-2">
                                                    <FaCalendarAlt /> Delivery Timeline
                                                </h3>
                                                <div className="space-y-2 text-sm">
                                                    {selectedDelivery.pickedUpAt && (
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-500">Picked Up:</span>
                                                            <span className="font-medium">{formatDate(selectedDelivery.pickedUpAt)}</span>
                                                        </div>
                                                    )}
                                                    {selectedDelivery.deliveredAt && (
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-500">Delivered:</span>
                                                            <span className="font-medium text-green-600">{formatDate(selectedDelivery.deliveredAt)}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
       </Riderprotract>
    );
};

export default Deliveryhistory;