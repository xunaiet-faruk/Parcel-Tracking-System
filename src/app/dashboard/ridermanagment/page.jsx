"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaUsers, FaTruck, FaCheckCircle, FaTimesCircle,
    FaEye, FaBan, FaCheck,
    FaPhone, FaEnvelope, FaMapMarkerAlt, FaCalendarAlt,
    FaSpinner, FaUserCheck, FaUserSlash, FaStar
} from 'react-icons/fa';
import useAxios from '../../(site)/hooks/useAxios';
import Loading from '@/app/components/Loading';
import Swal from 'sweetalert2';
import AdminRouters from '../Adminprotuct/AdminRouters';
import useAuth from '@/app/(site)/hooks/useAuth';

const Ridermangment = () => {
    const axios = useAxios();
    const [loading, setLoading] = useState(true);
    const [riders, setRiders] = useState([]);
    const [selectedRider, setSelectedRider] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);
    const {user} =useAuth();

    useEffect(() => {
        fetchAllRiders();
    }, []);

    const fetchAllRiders = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/rider');
            let data = response.data || [];


            data = data.filter(rider => rider.status !== 'rejected' && rider.status !== 'deleted');


            const ridersWithPerformance = await Promise.all(data.map(async (rider) => {
                const parcelsResponse = await axios.get(`/parcels?riderEmail=${rider.email}`);
                const parcels = parcelsResponse.data || [];

                const totalDeliveries = parcels.length;
                const completedDeliveries = parcels.filter(p => p.deliverystatus === 'delivered').length;
                const totalEarnings = parcels
                    .filter(p => p.deliverystatus === 'delivered')
                    .reduce((sum, p) => sum + (p.riderEarning || p.deliveryCharge || 50), 0);
                const completionRate = totalDeliveries > 0 ? (completedDeliveries / totalDeliveries) * 100 : 0;
                const rating = totalDeliveries > 0 ? ((completedDeliveries / totalDeliveries) * 5).toFixed(1) : 0;

                return {
                    ...rider,
                    totalDeliveries,
                    completedDeliveries,
                    totalEarnings,
                    completionRate: completionRate.toFixed(1),
                    rating
                };
            }));

            setRiders(ridersWithPerformance);
        } catch (error) {
            console.error("Error fetching riders:", error);
            Swal.fire("Error", "Failed to fetch riders", "error");
        } finally {
            setLoading(false);
        }
    };

    const toggleBlockRider = async (riderId, currentStatus) => {
        const newStatus = currentStatus === 'blocked' ? 'approved' : 'blocked';
        const action = newStatus === 'blocked' ? 'block' : 'unblock';

        const result = await Swal.fire({
            title: `Are you sure?`,
            text: `You want to ${action} this rider. ${action === 'block' ? 'Blocked rider cannot take deliveries.' : 'Unblocked rider can take deliveries again.'}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#03373d',
            cancelButtonColor: '#d33',
            confirmButtonText: `Yes, ${action}`
        });

        if (result.isConfirmed) {
            try {
                setUpdatingId(riderId);
                await axios.patch(`/rider/${riderId}`, { status: newStatus });
                await fetchAllRiders();
                Swal.fire("Success", `Rider ${action}ed successfully`, "success");
            } catch (error) {
                console.error("Error blocking rider:", error);
                Swal.fire("Error", `Failed to ${action} rider`, "error");
            } finally {
                setUpdatingId(null);
            }
        }
    };

    const deleteRider = async (riderId) => {
        const result = await Swal.fire({
            title: 'Delete Rider?',
            text: "This rider will be permanently removed!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#03373d',
            confirmButtonText: 'Yes, delete!'
        });

        if (result.isConfirmed) {
            try {
                setUpdatingId(riderId);

                const response = await axios.delete(`/rider/${riderId}?email=${user?.email}`);

                if (response.data.success) {
                    await fetchAllRiders();
                    Swal.fire("Deleted!", response.data.message || "Rider has been deleted.", "success");
                } else {
                    throw new Error(response.data.message || "Delete failed");
                }
            } catch (error) {
                console.error("Error deleting rider:", error);
                const errorMessage = error.response?.data?.message || error.response?.data?.error || "Failed to delete rider";
                Swal.fire("Error", errorMessage, "error");
            } finally {
                setUpdatingId(null);
            }
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            'approved': <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700"><FaCheckCircle className="inline mr-1 text-xs" /> Active</span>,
            'pending': <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700"><FaSpinner className="inline mr-1 text-xs animate-spin" /> Pending</span>,
            'blocked': <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700"><FaBan className="inline mr-1 text-xs" /> Blocked</span>
        };
        return badges[status] || badges['pending'];
    };

    const formatDate = (dateValue) => {
        if (!dateValue) return 'N/A';
        try {
            const date = new Date(dateValue);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (e) {
            return 'N/A';
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);

        for (let i = 0; i < fullStars; i++) {
            stars.push(<FaStar key={i} className="text-yellow-400 text-xs" />);
        }
        while (stars.length < 5) {
            stars.push(<FaStar key={stars.length} className="text-gray-300 text-xs" />);
        }
        return stars;
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <AdminRouters>
            <div className="min-h-screen bg-gray-50 py-8 px-4">
                <div className="max-w-7xl mx-auto">

                    <div className="mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#03373d] rounded-lg">
                                <FaUsers className="text-xl text-[#caeb66]" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-[#03373d]">Rider Management</h1>
                                <p className="text-gray-500 text-sm">Manage all delivery riders</p>
                            </div>
                        </div>
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {riders.length > 0 ? (
                            riders.map((rider, index) => (
                                <div
                                    key={rider._id || index}
                                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden border border-gray-100"
                                >

                                    <div className={`p-4 ${rider.status === 'approved' ? 'bg-green-50' : rider.status === 'blocked' ? 'bg-red-50' : 'bg-yellow-50'}`}>
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white ${rider.status === 'approved' ? 'bg-green-600' : rider.status === 'blocked' ? 'bg-red-600' : 'bg-yellow-600'}`}>
                                                    {rider.name?.charAt(0).toUpperCase() || 'R'}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-800">{rider.name || 'N/A'}</h3>
                                                    <p className="text-xs text-gray-500">{rider.email}</p>
                                                </div>
                                            </div>
                                            {getStatusBadge(rider.status)}
                                        </div>
                                    </div>


                                    <div className="p-4 space-y-3">

                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <FaPhone className="text-gray-400 text-xs w-4" />
                                                <span>{rider.phone || 'N/A'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <FaMapMarkerAlt className="text-gray-400 text-xs w-4" />
                                                <span>{rider.district || 'N/A'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <FaCalendarAlt className="text-gray-400 text-xs w-4" />
                                                <span>Joined {formatDate(rider.createAt)}</span>
                                            </div>
                                        </div>


                                        <div className="border-t pt-3 mt-2">
                                            <div className="grid grid-cols-3 gap-2 text-center">
                                                <div>
                                                    <p className="text-lg font-bold text-[#03373d]">{rider.totalDeliveries || 0}</p>
                                                    <p className="text-xs text-gray-500">Deliveries</p>
                                                </div>
                                                <div>
                                                    <p className="text-lg font-bold text-green-600">{rider.completedDeliveries || 0}</p>
                                                    <p className="text-xs text-gray-500">Completed</p>
                                                </div>
                                                <div>
                                                    <p className="text-lg font-bold text-[#caeb66]">৳{rider.totalEarnings || 0}</p>
                                                    <p className="text-xs text-gray-500">Earnings</p>
                                                </div>
                                            </div>


                                            <div className="flex items-center justify-between mt-2 pt-2 border-t">
                                                <div className="flex items-center gap-1">
                                                    {renderStars(rider.rating)}
                                                    <span className="text-xs text-gray-500 ml-1">({rider.rating})</span>
                                                </div>
                                                <div className="text-xs">
                                                    <span className="text-gray-500">Rate:</span>
                                                    <span className="font-semibold text-[#03373d] ml-1">{rider.completionRate || 0}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="p-4 bg-gray-50 border-t flex gap-2">
                                        <button
                                            onClick={() => setSelectedRider(rider)}
                                            className="flex-1 bg-[#03373d] text-white px-3 py-2 rounded-lg text-sm hover:bg-[#caeb66] hover:text-[#03373d] transition"
                                        >
                                            <FaEye className="inline mr-1 text-xs" /> View
                                        </button>

                                        {(rider.status === 'approved' || rider.status === 'blocked') && (
                                            <>
                                                <button
                                                    onClick={() => toggleBlockRider(rider._id, rider.status)}
                                                    disabled={updatingId === rider._id}
                                                    className={`flex-1 px-3 py-2 rounded-lg text-sm transition disabled:opacity-50
                                                    ${rider.status === 'blocked'
                                                            ? 'bg-green-600 text-white hover:bg-green-700'
                                                            : 'bg-orange-600 text-white hover:bg-orange-700'
                                                        }`}
                                                >
                                                    {updatingId === rider._id ? <FaSpinner className="animate-spin inline" /> : rider.status === 'blocked' ? <FaUserCheck className="inline mr-1 text-xs" /> : <FaUserSlash className="inline mr-1 text-xs" />}
                                                    {rider.status === 'blocked' ? 'Unblock' : 'Block'}
                                                </button>
                                                <button
                                                    onClick={() => deleteRider(rider._id)}
                                                    disabled={updatingId === rider._id}
                                                    className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-700 transition disabled:opacity-50"
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-16 bg-white rounded-xl">
                                <FaUsers className="text-5xl text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">No riders found</p>
                            </div>
                        )}
                    </div>
                </div>


                <AnimatePresence>
                    {selectedRider && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                            onClick={() => setSelectedRider(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white rounded-xl shadow-xl max-w-md w-full"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="bg-[#03373d] p-5 rounded-t-xl">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-lg font-bold text-white">Rider Details</h2>
                                        <button onClick={() => setSelectedRider(null)} className="text-white/80 hover:text-white text-xl">×</button>
                                    </div>
                                    <p className="text-white/70 text-sm">{selectedRider.email}</p>
                                </div>

                                <div className="p-5 space-y-4">

                                    <div className="flex items-center gap-3 pb-3 border-b">
                                        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white ${selectedRider.status === 'approved' ? 'bg-green-600' : selectedRider.status === 'blocked' ? 'bg-red-600' : 'bg-yellow-600'}`}>
                                            {selectedRider.name?.charAt(0).toUpperCase() || 'R'}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800">{selectedRider.name}</h3>
                                            {getStatusBadge(selectedRider.status)}
                                        </div>
                                    </div>


                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Phone:</span>
                                            <span className="font-medium">{selectedRider.phone || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">District:</span>
                                            <span className="font-medium">{selectedRider.district || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Joined:</span>
                                            <span className="font-medium">{formatDate(selectedRider.createAt)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Vehicle:</span>
                                            <span className="font-medium">{selectedRider.vehicleType || 'N/A'}</span>
                                        </div>
                                    </div>


                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <h4 className="font-semibold text-[#03373d] mb-2 text-sm">Performance</h4>
                                        <div className="grid grid-cols-3 gap-2 text-center">
                                            <div>
                                                <p className="text-xl font-bold text-[#03373d]">{selectedRider.totalDeliveries || 0}</p>
                                                <p className="text-xs text-gray-500">Deliveries</p>
                                            </div>
                                            <div>
                                                <p className="text-xl font-bold text-green-600">{selectedRider.completedDeliveries || 0}</p>
                                                <p className="text-xs text-gray-500">Completed</p>
                                            </div>
                                            <div>
                                                <p className="text-xl font-bold text-[#caeb66]">৳{selectedRider.totalEarnings || 0}</p>
                                                <p className="text-xs text-gray-500">Earnings</p>
                                            </div>
                                        </div>
                                        <div className="mt-2">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-gray-500">Completion Rate</span>
                                                <span className="font-semibold text-[#03373d]">{selectedRider.completionRate || 0}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                <div className="bg-[#caeb66] h-1.5 rounded-full" style={{ width: `${selectedRider.completionRate || 0}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </AdminRouters>
    );
};

export default Ridermangment;