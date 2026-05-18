"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaBox, FaEye, FaCopy, FaSearch, FaFilter,
    FaTruck, FaUser, FaMapMarkerAlt, FaPhone, FaEnvelope,
    FaCheckCircle, FaClock, FaTimesCircle, FaArrowUp, FaArrowDown,
    FaEdit, FaTrash, FaBan, FaCheck, FaSpinner,
    FaFileAlt
} from 'react-icons/fa';
import useAxios from '../../(site)/hooks/useAxios';
import Loading from '@/app/components/Loading';
import Link from 'next/link';
import Swal from 'sweetalert2';

const AllParcel = () => {
    const axios = useAxios();
    const [loading, setLoading] = useState(true);
    const [parcels, setParcels] = useState([]);
    const [filteredParcels, setFilteredParcels] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedParcel, setSelectedParcel] = useState(null);
    const [sortField, setSortField] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');
    const [updatingId, setUpdatingId] = useState(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [updateData, setUpdateData] = useState();

    useEffect(() => {
        fetchAllParcels();
    }, []);

    useEffect(() => {
        filterAndSortParcels();
    }, [searchTerm, statusFilter, sortField, sortOrder, parcels]);

    const fetchAllParcels = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/admin/parcels/all');
            const data = response.data || [];
            setParcels(data);
            setFilteredParcels(data);
        } catch (error) {
            console.error("Error fetching parcels:", error);
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortParcels = () => {
        let filtered = [...parcels];

        if (searchTerm) {
            filtered = filtered.filter(p =>
                p.trackingId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.parcelName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.senderName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.senderEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.receiverName?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(p => p.deliverystatus === statusFilter);
        }

        filtered.sort((a, b) => {
            let aVal, bVal;
            switch (sortField) {
                case 'date':
                    aVal = new Date(a.bookingDate || a.createdAt || 0);
                    bVal = new Date(b.bookingDate || b.createdAt || 0);
                    break;
                case 'amount':
                    aVal = a.totalPrice || 0;
                    bVal = b.totalPrice || 0;
                    break;
                default:
                    aVal = new Date(a.bookingDate || a.createdAt || 0);
                    bVal = new Date(b.bookingDate || b.createdAt || 0);
            }
            return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
        });

        setFilteredParcels(filtered);
    };

    const updateStatus = async (parcelId, newStatus) => {
        try {
            setUpdatingId(parcelId);
            await axios.patch(`/parcels/deliverystatus/${parcelId}`, { deliverystatus: newStatus });
            await fetchAllParcels();
            Swal.fire({
                title: `Status updated to ${newStatus}`,
                icon: "success",
                draggable: true
            });
        } catch (error) {
            console.error("Error updating status:", error);
            Swal.fire({
                title: "Failed to update status",
                icon: "error",
                draggable: true
            });
        } finally {
            setUpdatingId(null);
        }
    };

    const cancelParcel = async (parcelId) => {
        if (confirm("Are you sure you want to cancel this parcel?")) {
            try {
                setUpdatingId(parcelId);
                await axios.patch(`/parcels/deliverystatus/${parcelId}`, { deliverystatus: 'cancelled' });
                await fetchAllParcels();
                     Swal.fire({
                         title: "Parcel cancelled successfully",
                                icon: "success",
                                draggable: true
                            })

            } catch (error) {

                Swal.fire({
                    title: "Error cancelling parcel:", error,
                    icon: "error",
                    draggable: true
                })
            } finally {
                setUpdatingId(null);
            }
        }
    };

    const openUpdateModal = (parcel) => {
        setSelectedParcel(parcel);
        setUpdateData({
            parcelName: parcel.parcelName,
            parcelWeight: parcel.parcelWeight,
            totalPrice: parcel.totalPrice,
            receiverName: parcel.receiverName,
            receiverPhone: parcel.receiverPhone,
            receiverAddress: parcel.receiverAddress,
            receiverDistrict: parcel.receiverDistrict
        });
        setShowUpdateModal(true);
    };

    const handleUpdateParcel = async () => {
        try {
            setUpdatingId(selectedParcel._id);
            await axios.put(`/parcels/${selectedParcel._id}`, updateData);
            await fetchAllParcels();
            setShowUpdateModal(false);
            Swal.fire({
                title:"Parcel updated successfully",
                icon: "success",
                draggable: true
            })
        } catch (error) {
            console.error("Error updating parcel:", error);
            Swal.fire({
                title: "Failed to update parcel",
                icon: "success",
                draggable: true
            })
        } finally {
            setUpdatingId(null);
        }
    };

    const formatDate = (dateValue) => {
        if (!dateValue) return 'N/A';
        try {
            const date = new Date(dateValue);
            if (isNaN(date.getTime())) return 'N/A';
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (e) {
            return 'N/A';
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'delivered': 'bg-green-100 text-green-700',
            'pending-pickup': 'bg-yellow-100 text-yellow-700',
            'assigned': 'bg-blue-100 text-blue-700',
            'picked-up': 'bg-purple-100 text-purple-700',
            'cancelled': 'bg-red-100 text-red-700'
        };
        return colors[status] || 'bg-gray-100 text-gray-700';
    };

    const getStatusText = (status) => {
        const texts = {
            'delivered': 'Delivered',
            'pending-pickup': 'Pending',
            'assigned': 'Assigned',
            'picked-up': 'Picked Up',
            'cancelled': 'Cancelled'
        };
        return texts[status] || status || 'Pending';
    };

    const getStatusIcon = (status) => {
        const icons = {
            'delivered': <FaCheckCircle className="text-green-600" />,
            'cancelled': <FaTimesCircle className="text-red-600" />,
            'picked-up': <FaTruck className="text-purple-600" />
        };
        return icons[status] || <FaClock className="text-yellow-600" />;
    };

    const copyToClipboard = (text) => {
        if (text) {
            navigator.clipboard.writeText(text);
            Swal.fire({
                text: "Copied to clipboard!",
                icon: "success"
            });

        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">

            <div className='flex justify-between items-center'>
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <FaBox className="text-3xl text-[#03373d]" />
                            <h1 className="text-3xl font-bold text-[#03373d]">All Parcels</h1>
                            <span className="bg-[#caeb66] text-[#03373d] px-3 py-1 rounded-full text-sm font-semibold">
                                {filteredParcels.length} Total
                            </span>
                        </div>
                        <p className="text-gray-500">View and manage all parcels across the platform</p>
                    </motion.div>

                    <Link href="/dashboard/allparcel/reports">
                        <button className="bg-[#03373d] text-white cursor-pointer px-4 py-2 rounded-lg hover:bg-[#caeb66] hover:text-[#03373d] transition flex items-center gap-2">
                            <FaFileAlt /> Reports & Invoices
                        </button>
                    </Link>

            </div>




                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredParcels.length > 0 ? (
                            filteredParcels.map((parcel, index) => {
                                const isDelivered = parcel.deliverystatus === 'delivered';
                                const isCancelled = parcel.deliverystatus === 'cancelled';

                                return (
                                    <motion.div
                                        key={parcel._id || index}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: index * 0.05 }}
                                        className={`bg-white rounded-2xl shadow-lg hover:shadow-xl  transition-all overflow-hidden flex flex-col h-full ${isDelivered ? 'border-l-4 border-l-green-500' :
                                                isCancelled ? 'border-l-4 border-l-red-500' : ''
                                            }`}
                                    >

                                        <div className={`p-4 ${isDelivered ? 'bg-green-50' : isCancelled ? 'bg-red-50' : 'bg-gradient-to-r from-[#03373d] to-[#1a5c64]'}`}>
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <FaBox className={`text-sm ${isDelivered || isCancelled ? 'text-gray-600' : 'text-white'}`} />
                                                        <span className={`text-xs ${isDelivered || isCancelled ? 'text-gray-500' : 'text-white/80'}`}>Tracking ID</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className={`font-mono text-sm font-semibold ${isDelivered || isCancelled ? 'text-gray-700' : 'text-white'}`}>
                                                            {parcel.trackingId || 'N/A'}
                                                        </span>
                                                        <button
                                                            onClick={() => copyToClipboard(parcel.trackingId)}
                                                            className={`${isDelivered || isCancelled ? 'text-gray-400 hover:text-gray-600' : 'text-white/70 hover:text-white'} transition`}
                                                        >
                                                            <FaCopy className="text-xs" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <span className={`px-2 py-1 flex items-center gap-1 rounded-full text-xs font-semibold ${getStatusColor(parcel.deliverystatus)}`}>
                                                    {getStatusIcon(parcel.deliverystatus)} {getStatusText(parcel.deliverystatus)}
                                                </span>
                                            </div>
                                        </div>


                                        <div className="p-4 flex-1">
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-500 text-sm">Parcel</span>
                                                    <span className="font-semibold text-gray-800">{parcel.parcelName || 'N/A'}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-500 text-sm">Weight / Price</span>
                                                    <span className="font-semibold text-gray-800">{parcel.parcelWeight} kg / ৳{parcel.totalPrice || 0}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-500 text-sm">Sender</span>
                                                    <span className="text-sm text-gray-700 truncate max-w-[150px]">{parcel.senderName}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-500 text-sm">Receiver</span>
                                                    <span className="text-sm text-gray-700 truncate max-w-[150px]">{parcel.receiverName}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-500 text-sm">Date</span>
                                                    <span className="text-xs text-gray-500">{formatDate(parcel.bookingDate)}</span>
                                                </div>
                                            </div>
                                        </div>


                                        <div className="p-4 bg-gray-50 border-t border-gray-100">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setSelectedParcel(parcel)}
                                                    className="flex-1 bg-[#03373d] text-white px-3 py-2 rounded-lg text-sm hover:bg-[#caeb66] hover:text-[#03373d] transition flex items-center justify-center gap-1"
                                                >
                                                    <FaEye className="text-xs" /> View
                                                </button>

                                                {!isDelivered && !isCancelled && (
                                                    <>

                                                        <button
                                                            onClick={() => cancelParcel(parcel._id)}
                                                            disabled={updatingId === parcel._id}
                                                            className="flex-1 bg-red-500 text-white px-3 cursor-pointer py-2 rounded-lg text-sm hover:bg-red-600 transition flex items-center justify-center gap-1 disabled:opacity-50"
                                                        >
                                                            {updatingId === parcel._id ? <FaSpinner className="animate-spin" /> : <FaBan className="text-xs" />}
                                                            Cancel
                                                        </button>
                                                    </>
                                                )}


                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <div className="col-span-full text-center py-16 bg-white rounded-2xl">
                                <FaBox className="text-5xl text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">No parcels found</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>


            <AnimatePresence>
                {selectedParcel && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={() => setSelectedParcel(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="sticky top-0 bg-gradient-to-r from-[#03373d] to-[#1a5c64] p-6 text-white">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-xl font-bold">Parcel Details</h2>
                                        <p className="text-sm opacity-80 font-mono">{selectedParcel.trackingId}</p>
                                    </div>
                                    <button onClick={() => setSelectedParcel(null)} className="text-white/80 hover:text-white text-2xl">×</button>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                                    <span className="text-gray-600">Current Status</span>
                                    <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedParcel.deliverystatus)}`}>
                                        {getStatusIcon(selectedParcel.deliverystatus)} {getStatusText(selectedParcel.deliverystatus)}
                                    </span>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-4">
                                    <h3 className="font-semibold text-[#03373d] mb-3">Parcel Information</h3>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div><span className="text-gray-500">Name:</span> {selectedParcel.parcelName}</div>
                                        <div><span className="text-gray-500">Weight:</span> {selectedParcel.parcelWeight} kg</div>
                                        <div><span className="text-gray-500">Amount:</span> ৳{selectedParcel.totalPrice}</div>
                                        <div><span className="text-gray-500">Date:</span> {formatDate(selectedParcel.bookingDate)}</div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-4">
                                    <h3 className="font-semibold text-[#03373d] mb-3">Sender</h3>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div><span className="text-gray-500">Name:</span> {selectedParcel.senderName}</div>
                                        <div><span className="text-gray-500">Phone:</span> {selectedParcel.senderPhone}</div>
                                        <div className="col-span-2"><span className="text-gray-500">Address:</span> {selectedParcel.senderAddress}, {selectedParcel.senderDistrict}</div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-4">
                                    <h3 className="font-semibold text-[#03373d] mb-3">Receiver</h3>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div><span className="text-gray-500">Name:</span> {selectedParcel.receiverName}</div>
                                        <div><span className="text-gray-500">Phone:</span> {selectedParcel.receiverPhone}</div>
                                        <div className="col-span-2"><span className="text-gray-500">Address:</span> {selectedParcel.receiverAddress}, {selectedParcel.receiverDistrict}</div>
                                    </div>
                                </div>

                                {selectedParcel.riderName && (
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <h3 className="font-semibold text-[#03373d] mb-3">Rider</h3>
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div><span className="text-gray-500">Name:</span> {selectedParcel.riderName}</div>
                                            <div><span className="text-gray-500">Phone:</span> {selectedParcel.riderPhone || 'N/A'}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>


            <AnimatePresence>
                {showUpdateModal && selectedParcel && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={() => setShowUpdateModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-bold text-[#03373d]">Update Parcel</h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Parcel Name</label>
                                    <input type="text" value={updateData.parcelName} onChange={(e) => setUpdateData({ ...updateData, parcelName: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                                    <input type="number" value={updateData.parcelWeight} onChange={(e) => setUpdateData({ ...updateData, parcelWeight: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (৳)</label>
                                    <input type="number" value={updateData.totalPrice} onChange={(e) => setUpdateData({ ...updateData, totalPrice: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <button onClick={() => setShowUpdateModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                                    <button onClick={handleUpdateParcel} className="px-4 py-2 bg-[#03373d] text-white rounded-lg hover:bg-[#caeb66] hover:text-[#03373d] transition">Update</button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AllParcel;