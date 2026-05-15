"use client";
import useAuth from '@/app/(site)/hooks/useAuth';
import useAxios from '@/app/(site)/hooks/useAxios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import {
    FaTruck, FaBox, FaMapMarkerAlt, FaUser, FaPhone,
    FaWeightHanging, FaCalendarAlt, FaCheckCircle,
    FaStar, FaHandPaper
} from 'react-icons/fa';
import Loading from '@/app/components/Loading';
import Swal from 'sweetalert2';
import Riderprotract from '../Riderprotuct/Riderprotract';

const CompleteDeliveries = () => {
    const { user } = useAuth();
    const axios = useAxios();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('ongoing');
    const [selectedParcel, setSelectedParcel] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    // Fetch all parcels for this rider
    const { data: allParcels = [], isLoading, refetch } = useQuery({
        queryKey: ['completeDeliveries', user?.email],
        queryFn: async () => {
            const res = await axios.get(`/parcels?riderEmail=${user?.email}`);
            return res.data;
        },
        enabled: !!user?.email
    });

    // Ongoing deliveries (accepted, picked-up) - যেগুলো এখনো সম্পন্ন হয়নি
    const ongoingDeliveries = allParcels.filter(p =>
        p.deliverystatus === 'accepted' ||
        p.deliverystatus === 'picked-up'
    );

    // History deliveries (delivered, completed) - যেগুলো সম্পন্ন হয়েছে
    const historyDeliveries = allParcels.filter(p =>
        p.deliverystatus === 'delivered' ||
        p.deliverystatus === 'completed'
    );

    // Pick Up Mutation
    const pickUpMutation = useMutation({
        mutationFn: async (parcel) => {
            const updateInfo = {
                deliverystatus: 'picked-up',
                pickedUpAt: new Date(),
                pickedUpBy: user?.email
            };
            const res = await axios.patch(`/parcels/deliverystatus/${parcel._id}`, updateInfo);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['completeDeliveries', user?.email]);
            Swal.fire({
                icon: 'success',
                title: 'Picked Up!',
                text: 'Parcel marked as picked up successfully.',
                timer: 1500,
                showConfirmButton: false
            });
        },
        onError: () => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
            });
        }
    });

    // Deliver Mutation
    const deliverMutation = useMutation({
        mutationFn: async (parcel) => {
            const updateInfo = {
                deliverystatus: 'delivered',
                deliveredAt: new Date(),
                deliveredBy: user?.email
            };
            const res = await axios.patch(`/parcels/deliverystatus/${parcel._id}`, updateInfo);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['completeDeliveries', user?.email]);
            Swal.fire({
                icon: 'success',
                title: 'Delivered!',
                text: 'Parcel marked as delivered successfully.',
                timer: 1500,
                showConfirmButton: false
            });
        },
        onError: () => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
            });
        }
    });

    const handlePickUp = async (parcel) => {
        const result = await Swal.fire({
            title: 'Mark as Picked Up?',
            text: `Have you picked up this parcel from the sender?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#1a5c64',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Picked Up!',
            cancelButtonText: 'Cancel'
        });
        if (result.isConfirmed) {
            pickUpMutation.mutate(parcel);
        }
    };

    const handleDeliver = async (parcel) => {
        const result = await Swal.fire({
            title: 'Mark as Delivered?',
            text: `Has this parcel been delivered to the customer?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#1a5c64',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Delivered!',
            cancelButtonText: 'Cancel'
        });
        if (result.isConfirmed) {
            deliverMutation.mutate(parcel);
        }
    };

    const viewDetails = (parcel) => {
        setSelectedParcel(parcel);
        setShowDetailsModal(true);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'accepted':
                return { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Accepted', icon: <FaCheckCircle className="text-blue-500" size={12} /> };
            case 'picked-up':
                return { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Picked Up', icon: <FaHandPaper className="text-purple-500" size={12} /> };
            case 'delivered':
                return { bg: 'bg-green-100', text: 'text-green-700', label: 'Delivered', icon: <FaCheckCircle className="text-green-500" size={12} /> };
            case 'completed':
                return { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Completed', icon: <FaStar className="text-emerald-500" size={12} /> };
            default:
                return { bg: 'bg-gray-100', text: 'text-gray-700', label: status, icon: null };
        }
    };

    const getActionButton = (delivery) => {
        if (delivery.deliverystatus === 'accepted') {
            return (
                <button
                    onClick={() => handlePickUp(delivery)}
                    disabled={pickUpMutation.isPending}
                    className="px-4 cursor-pointer py-2 bg-gradient-to-br from-[#03373d] to-[#1a5c64] text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2 shadow-md"
                >
                    <FaHandPaper size={14} /> Pick Up
                </button>
            );
        }
        if (delivery.deliverystatus === 'picked-up') {
            return (
                <button
                    onClick={() => handleDeliver(delivery)}
                    disabled={deliverMutation.isPending}
                    className="px-4 cursor-pointer py-2 bg-[#caeb66] text-[#03373d] rounded-lg text-sm font-medium transition-all flex items-center gap-2 shadow-md"
                >
                    <FaTruck size={14} /> Ready to Delivery
                </button>
            );
        }
        return null;
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
       <Riderprotract>
            <div className="py-12">
                <div className="container mx-auto">
                    {/* Header Section */}
                    <div className="flex items-center justify-between gap-3 mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#03373d] to-[#1a5c64] rounded-xl flex items-center justify-center">
                                <FaTruck className="text-2xl text-[#caeb66]" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">My Deliveries</h1>
                                <p className="text-gray-500 text-sm">View and manage your delivery tasks</p>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setActiveTab('ongoing')}
                                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'ongoing'
                                    ? 'bg-gradient-to-br from-[#03373d] to-[#1a5c64] text-white shadow-md'
                                    : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                Ongoing ({ongoingDeliveries.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('history')}
                                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'history'
                                    ? 'bg-gradient-to-br from-[#03373d] to-[#1a5c64] text-white shadow-md'
                                    : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                History ({historyDeliveries.length})
                            </button>
                        </div>
                    </div>

                    {/* Ongoing Deliveries Tab */}
                    {activeTab === 'ongoing' && (
                        <>
                            {ongoingDeliveries.length === 0 ? (
                                <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FaTruck className="text-3xl text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-700 mb-1">No Ongoing Deliveries</h3>
                                    <p className="text-gray-400 text-sm">You don't have any active deliveries at the moment.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {ongoingDeliveries.map((delivery) => {
                                        const statusStyle = getStatusBadge(delivery.deliverystatus);
                                        return (
                                            <div key={delivery._id} className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                                                <div className="p-5">
                                                    <div className="flex flex-wrap justify-between items-start gap-3 mb-4">
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <FaBox className="text-gray-400 text-sm" />
                                                                <span className="font-semibold text-gray-800">{delivery.parcelName}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                                                                    {delivery.trackingId}
                                                                </span>
                                                                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${statusStyle.bg}`}>
                                                                    {statusStyle.icon}
                                                                    <span className={`text-xs font-medium ${statusStyle.text}`}>{statusStyle.label}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <div className="text-right">
                                                                <p className="text-xs text-gray-400">Total Amount</p>
                                                                <p className="text-xl font-bold text-[#03373d]">${delivery.totalPrice}</p>
                                                            </div>
                                                            {getActionButton(delivery)}
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                                                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                                <FaUser className="text-blue-500 text-sm" />
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-400">Sender</p>
                                                                <p className="text-sm font-medium text-gray-800">{delivery.senderName}</p>
                                                                <p className="text-xs text-gray-500">{delivery.senderPhone}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                                                <FaUser className="text-green-500 text-sm" />
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-400">Receiver</p>
                                                                <p className="text-sm font-medium text-gray-800">{delivery.receiverName}</p>
                                                                <p className="text-xs text-gray-500">{delivery.receiverPhone}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                                                <FaMapMarkerAlt className="text-orange-500 text-sm" />
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-400">Delivery Location</p>
                                                                <p className="text-sm font-medium text-gray-800">{delivery.receiverDistrict}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap gap-4 pt-3 border-t border-gray-100">
                                                        <div className="flex items-center gap-1">
                                                            <FaWeightHanging className="text-gray-400 text-xs" />
                                                            <span className="text-xs text-gray-500">{delivery.parcelWeight} kg</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <FaCalendarAlt className="text-gray-400 text-xs" />
                                                            <span className="text-xs text-gray-500">
                                                                {delivery.acceptedAt ? `Accepted: ${formatDate(delivery.acceptedAt)}` : formatDate(delivery.bookingDate)}
                                                            </span>
                                                        </div>
                                                        {delivery.pickedUpAt && (
                                                            <div className="flex items-center gap-1">
                                                                <FaHandPaper className="text-purple-500 text-xs" />
                                                                <span className="text-xs text-purple-600">Picked: {formatDate(delivery.pickedUpAt)}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    )}

                    {/* History Deliveries Tab */}
                    {activeTab === 'history' && (
                        <>
                            {historyDeliveries.length === 0 ? (
                                <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FaCheckCircle className="text-3xl text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-700 mb-1">No Delivery History</h3>
                                    <p className="text-gray-400 text-sm">You haven't completed any deliveries yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {historyDeliveries.map((delivery) => {
                                        const statusStyle = getStatusBadge(delivery.deliverystatus);
                                        return (
                                            <div key={delivery._id} className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                                                <div className="p-5">
                                                    <div className="flex flex-wrap justify-between items-start gap-3 mb-4">
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <FaBox className="text-gray-400 text-sm" />
                                                                <span className="font-semibold text-gray-800">{delivery.parcelName}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                                                                    {delivery.trackingId}
                                                                </span>
                                                                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${statusStyle.bg}`}>
                                                                    {statusStyle.icon}
                                                                    <span className={`text-xs font-medium ${statusStyle.text}`}>{statusStyle.label}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <div className="text-right">
                                                                <p className="text-xs text-gray-400">Total Amount</p>
                                                                <p className="text-xl font-bold text-[#03373d]">${delivery.totalPrice}</p>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                                                                <FaCheckCircle size={14} />
                                                                <span className="text-sm font-medium">Completed</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                                                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                                <FaUser className="text-blue-500 text-sm" />
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-400">Sender</p>
                                                                <p className="text-sm font-medium text-gray-800">{delivery.senderName}</p>
                                                                <p className="text-xs text-gray-500">{delivery.senderPhone}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                                                <FaUser className="text-green-500 text-sm" />
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-400">Receiver</p>
                                                                <p className="text-sm font-medium text-gray-800">{delivery.receiverName}</p>
                                                                <p className="text-xs text-gray-500">{delivery.receiverPhone}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                                                <FaMapMarkerAlt className="text-orange-500 text-sm" />
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-400">Delivery Location</p>
                                                                <p className="text-sm font-medium text-gray-800">{delivery.receiverDistrict}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap gap-4 pt-3 border-t border-gray-100">
                                                        <div className="flex items-center gap-1">
                                                            <FaWeightHanging className="text-gray-400 text-xs" />
                                                            <span className="text-xs text-gray-500">{delivery.parcelWeight} kg</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <FaCalendarAlt className="text-gray-400 text-xs" />
                                                            <span className="text-xs text-gray-500">
                                                                Delivered: {formatDate(delivery.deliveredAt || delivery.updatedAt)}
                                                            </span>
                                                        </div>
                                                        {delivery.pickedUpAt && (
                                                            <div className="flex items-center gap-1">
                                                                <FaHandPaper className="text-purple-500 text-xs" />
                                                                <span className="text-xs text-purple-600">Picked: {formatDate(delivery.pickedUpAt)}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
       </Riderprotract>
    );
};

export default CompleteDeliveries;