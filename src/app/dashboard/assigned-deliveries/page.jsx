"use client";
import useAuth from '@/app/(site)/hooks/useAuth';
import useAxios from '@/app/(site)/hooks/useAxios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import {
    FaTruck, FaBox, FaMapMarkerAlt, FaUser, FaPhone,
    FaWeightHanging, FaCalendarAlt,
    FaCheckCircle, FaTimesCircle, FaEye,
    FaThumbsUp, FaThumbsDown, FaClipboardList, FaSpinner
} from 'react-icons/fa';
import Loading from '@/app/components/Loading';
import Riderprotract from '../Riderprotuct/Riderprotract';

const AssignDelivery = () => {
    const { user } = useAuth();
    const axios = useAxios();
    const queryClient = useQueryClient();
    const [selectedParcel, setSelectedParcel] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const { data: assignedParcels = [], isLoading } = useQuery({
        queryKey: ['assignedParcels', user?.email],
        queryFn: async () => {
            const res = await axios.get(`/parcels?riderEmail=${user?.email}&deliverystatus=assigned`);
            return res.data;
        },
        enabled: !!user?.email,
        staleTime: 10000,
        refetchOnWindowFocus: false,

    });

    const acceptMutation = useMutation({
        mutationFn: async (parcel) => {
            const updateInfo = { deliverystatus: 'accepted', acceptedBy: user?.email };
            const res = await axios.patch(`/parcels/deliverystatus/${parcel._id}`, updateInfo);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['assignedParcels', user?.email]);
            Swal.fire({ icon: 'success', title: 'Accepted!', text: 'Delivery accepted successfully.', timer: 1500, showConfirmButton: false });
        },
        onError: () => {
            Swal.fire({ icon: 'error', title: 'Oops...', text: 'Something went wrong!' });
        }
    });

    const rejectMutation = useMutation({
        mutationFn: async ({ parcel, reason }) => {
            const updateInfo = { deliverystatus: 'pending-pickup', rejectedBy: user?.email, rejectionReason: reason || 'No reason provided' };
            const res = await axios.patch(`/parcels/deliverystatus/${parcel._id}`, updateInfo);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['assignedParcels', user?.email]);
            Swal.fire({ icon: 'info', title: 'Rejected!', text: 'Delivery rejected. Parcel is back to pending.', timer: 1500, showConfirmButton: false });
        },
        onError: () => {
            Swal.fire({ icon: 'error', title: 'Oops...', text: 'Something went wrong!' });
        }
    });

    const handleAccept = async (parcel) => {
        const result = await Swal.fire({
            title: 'Accept Delivery?',
            text: 'Are you sure you want to accept this delivery?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#1a5c64',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Accept it!',
            cancelButtonText: 'Cancel'
        });
        if (result.isConfirmed) {
            acceptMutation.mutate(parcel);
        }
    };

    const handleReject = async (parcel) => {
        const result = await Swal.fire({
            title: 'Reject Delivery?',
            text: 'Why do you want to reject this delivery?',
            icon: 'warning',
            input: 'textarea',
            inputPlaceholder: 'Enter your reason here...',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#1a5c64',
            confirmButtonText: 'Yes, Reject it!',
            cancelButtonText: 'Cancel'
        });
        if (result.isConfirmed) {
            rejectMutation.mutate({ parcel, reason: result.value });
        }
    };

    const viewDetails = (parcel) => {
        setSelectedParcel(parcel);
        setShowDetailsModal(true);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const isLoadingAction = (parcelId) => {
        return (acceptMutation.isPending && acceptMutation.variables?._id === parcelId) ||
            (rejectMutation.isPending && rejectMutation.variables?.parcel?._id === parcelId);
    };

    return (
        <Riderprotract>
            <div className="min-h-screen bg-white p-6">
                <div className="container mx-auto">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-[#caeb66]/20 rounded-full mb-4">
                            <FaClipboardList className="text-4xl text-[#03373d]" />
                        </div>
                        <h1 className="text-3xl font-bold text-[#03373d] mb-2">My Deliveries Tasks</h1>
                        <p className="text-gray-600 text-lg">Manage your assigned parcels</p>
                    </div>

                    {isLoading ? (
                        <Loading />
                    ) : assignedParcels.length === 0 ? (
                        <div className="bg-gray-50 rounded-2xl p-12 text-center border border-gray-200">
                            <FaTruck className="text-6xl text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Deliveries Assigned</h3>
                            <p className="text-gray-400">You don't have any assigned parcels at the moment.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-2xl shadow-lg border border-gray-200">
                            <table className="w-full min-w-[800px]">
                                <thead>
                                    <tr className="bg-gradient-to-r from-[#03373d] to-[#1a5c64]">
                                        <th className="px-4 py-3 text-left text-white text-sm">Parcel Info</th>
                                        <th className="px-4 py-3 text-left text-white text-sm">Sender</th>
                                        <th className="px-4 py-3 text-left text-white text-sm">Pickup</th>
                                        <th className="px-4 py-3 text-left text-white text-sm">Receiver</th>
                                        <th className="px-4 py-3 text-left text-white text-sm">Delivery</th>
                                        <th className="px-4 py-3 text-left text-white text-sm">Price</th>
                                        <th className="px-4 py-3 text-left text-white text-sm">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assignedParcels.map((parcel, index) => (
                                        <tr key={parcel._id} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                            <td className="px-4 py-3">
                                                <p className="font-semibold text-gray-800">{parcel.parcelName}</p>
                                                <p className="text-xs text-gray-400">{parcel.trackingId}</p>
                                                <p className="text-xs text-gray-500 mt-1">{parcel.parcelWeight} kg</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="text-sm text-gray-800">{parcel.senderName}</p>
                                                <p className="text-xs text-gray-500">{parcel.senderPhone}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="text-sm text-gray-700">{parcel.senderDistrict}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="text-sm text-gray-800">{parcel.receiverName}</p>
                                                <p className="text-xs text-gray-500">{parcel.receiverPhone}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="text-sm text-gray-700">{parcel.receiverDistrict}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="font-bold text-[#03373d]">${parcel.totalPrice}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-2">
                                                    <button onClick={() => viewDetails(parcel)} className="p-1.5 text-gray-500 hover:text-[#03373d]" title="Details">
                                                        <FaEye size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleAccept(parcel)}
                                                        disabled={isLoadingAction(parcel._id)}
                                                        className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-xs flex items-center gap-1 disabled:opacity-50"
                                                    >
                                                        {isLoadingAction(parcel._id) ? <FaSpinner size={10} className="animate-spin" /> : <FaThumbsUp size={10} />}
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(parcel)}
                                                        disabled={isLoadingAction(parcel._id)}
                                                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs flex items-center gap-1 disabled:opacity-50"
                                                    >
                                                        {isLoadingAction(parcel._id) ? <FaSpinner size={10} className="animate-spin" /> : <FaThumbsDown size={10} />}
                                                        Reject
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {showDetailsModal && selectedParcel && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                        <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
                            <div className="bg-gradient-to-r from-[#03373d] to-[#1a5c64] p-4 text-white sticky top-0">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold">Parcel Details</h3>
                                    <button onClick={() => setShowDetailsModal(false)} className="text-white text-xl">×</button>
                                </div>
                            </div>
                            <div className="p-4 space-y-3">
                                <p><strong>Tracking ID:</strong> {selectedParcel.trackingId}</p>
                                <p><strong>Parcel Name:</strong> {selectedParcel.parcelName}</p>
                                <p><strong>Weight:</strong> {selectedParcel.parcelWeight} kg</p>
                                <p><strong>Price:</strong> ${selectedParcel.totalPrice}</p>
                                <hr />
                                <p><strong>Sender:</strong> {selectedParcel.senderName}</p>
                                <p><strong>Sender Phone:</strong> {selectedParcel.senderPhone}</p>
                                <p><strong>Pickup:</strong> {selectedParcel.senderAddress}, {selectedParcel.senderDistrict}</p>
                                <hr />
                                <p><strong>Receiver:</strong> {selectedParcel.receiverName}</p>
                                <p><strong>Receiver Phone:</strong> {selectedParcel.receiverPhone}</p>
                                <p><strong>Delivery:</strong> {selectedParcel.receiverAddress}, {selectedParcel.receiverDistrict}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Riderprotract>
    );
};

export default AssignDelivery;