"use client";
import useAuth from '@/app/(site)/hooks/useAuth';
import Swal from 'sweetalert2'
import useAxios from '@/app/(site)/hooks/useAxios';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { FiSearch, FiEdit2, FiTrash2, FiCreditCard, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import UpdateField from './UpdateField';
import Link from 'next/link';
import Userprotract from '../Userprotuct/Userprotract';

const MyParcels = () => {
    const { user } = useAuth();
    const [editParcel, setEditParcel] = useState(null);
    const axios = useAxios();
    const [searchTerm, setSearchTerm] = useState('');

    const { data: myParcels = [], refetch } = useQuery({
        queryKey: ['myParcels', user?.email],
        queryFn: async () => {
            const res = await axios.get(`/parcels?email=${user?.email}`)
            return res.data;
        }
    });

    const filteredParcels = myParcels.filter(parcel =>
        parcel.parcelName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parcel.senderName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parcel.receiverName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status, deliverystatus) => {
        // প্রথমে deliverystatus চেক করুন, তারপর status
        const currentStatus = deliverystatus || status;

        switch (currentStatus) {
            case 'delivered': return 'bg-green-100 text-green-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            case 'paid': return 'bg-blue-100 text-blue-700';
            case 'pending-pickup': return 'bg-yellow-100 text-yellow-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusText = (status, deliverystatus) => {
        const currentStatus = deliverystatus || status;

        const texts = {
            'delivered': 'Delivered',
            'cancelled': 'Cancelled',
            'paid': 'Paid',
            'pending-pickup': 'Pending',
            'pending': 'Pending'
        };
        return texts[currentStatus] || currentStatus || 'Pending';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (e) {
            return 'N/A';
        }
    };

    // চেক করা প্যার্সেলটি ক্যান্সেল হয়েছে কিনা
    const isCancelled = (parcel) => {
        return parcel.deliverystatus === 'cancelled' || parcel.status === 'cancelled';
    };

    // চেক করা প্যার্সেলটি ডেলিভারি হয়েছে কিনা
    const isDelivered = (parcel) => {
        return parcel.deliverystatus === 'delivered';
    };

    // চেক করা প্যার্সেলটি পেমেন্ট করা হয়েছে কিনা
    const isPaid = (parcel) => {
        return parcel.paymentStatus === 'completed' || parcel.status === 'paid';
    };

    const handleEdit = (parcel) => {
        if (isPaid(parcel)) {
            Swal.fire({
                title: "Cannot Edit",
                text: "This parcel has already been paid and cannot be edited.",
                icon: "warning",
                confirmButtonColor: "#03373d"
            });
            return;
        }

        if (isCancelled(parcel)) {
            Swal.fire({
                title: "Cannot Edit",
                text: "This parcel has been cancelled and cannot be edited.",
                icon: "warning",
                confirmButtonColor: "#03373d"
            });
            return;
        }

        setEditParcel(parcel);
    };

    const handleDelete = async (parcelId, parcel) => {
        if (isPaid(parcel)) {
            Swal.fire({
                title: "Cannot Delete",
                text: "This parcel has already been paid and cannot be deleted.",
                icon: "warning",
                confirmButtonColor: "#03373d"
            });
            return;
        }

        if (isCancelled(parcel)) {
            Swal.fire({
                title: "Cannot Delete",
                text: "This parcel has been cancelled and cannot be deleted.",
                icon: "warning",
                confirmButtonColor: "#03373d"
            });
            return;
        }

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#03373d",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`/parcels/${parcelId}`);
                Swal.fire({
                    title: "Deleted!",
                    text: "Your parcel has been deleted.",
                    icon: "success",
                });
                refetch();
            } catch (error) {
                console.error("Delete failed:", error);
                Swal.fire({
                    title: "Error!",
                    text: "Failed to delete parcel.",
                    icon: "error",
                });
            }
        }
    };

    if (myParcels.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
                    <div className="text-7xl mb-4">📦</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">No Parcels Found</h2>
                    <p className="text-gray-600">You haven't created any parcels yet.</p>
                </div>
            </div>
        );
    }

    return (
       <Userprotract>
            <div className=" p-4 md:p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">📮 My Parcels</h1>
                        <p className="text-gray-400">You have {filteredParcels.length} parcel(s) in total</p>
                    </div>

                    <div className="mb-6 max-w-md mx-auto">
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by parcel, sender or receiver name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#03373d] focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {filteredParcels.map((parcel, index) => {
                            const cancelled = isCancelled(parcel);
                            const delivered = isDelivered(parcel);
                            const paid = isPaid(parcel);

                            return (
                                <div key={index} className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300
                                ${cancelled ? 'border-l-4 border-l-red-500 opacity-75' : ''}
                                ${delivered ? 'border-l-4 border-l-green-500' : ''}
                            `}>
                                    <div className={`px-6 py-3 ${cancelled ? 'bg-red-50' : delivered ? 'bg-green-50' : 'bg-gradient-to-r from-[#03373d] to-[#1a5c64]'}`}>
                                        <div className="flex justify-between items-center">
                                            <h3 className={`font-semibold text-lg ${cancelled || delivered ? 'text-gray-700' : 'text-white'}`}>
                                                {parcel.parcelName}
                                            </h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(parcel.status, parcel.deliverystatus)}`}>
                                                {getStatusText(parcel.status, parcel.deliverystatus)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <div className="text-3xl font-bold text-[#213d03]">৳{parcel.totalPrice}</div>
                                            <div className="text-sm text-gray-500">📅 {formatDate(parcel.bookingDate)}</div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                                            <div className="bg-[#03373d]/10 rounded-lg p-3">
                                                <p className="text-xs text-[#03373d] font-medium mb-1">SENDER</p>
                                                <p className="font-medium text-gray-800">{parcel.senderName}</p>
                                                <p className="text-sm text-gray-600">{parcel.senderPhone}</p>
                                                <p className="text-xs text-gray-500">{parcel.senderDistrict}</p>
                                            </div>

                                            <div className="bg-[#caeb66]/30 rounded-lg p-3">
                                                <p className="text-xs text-[#03373d] font-medium mb-1">RECEIVER</p>
                                                <p className="font-medium text-gray-800">{parcel.receiverName}</p>
                                                <p className="text-sm text-gray-600">{parcel.receiverPhone}</p>
                                                <p className="text-xs text-gray-500">{parcel.receiverDistrict}</p>
                                            </div>
                                        </div>

                                        <div className="border-t pt-3 mt-2">
                                            <div className="flex justify-between text-sm mb-3">
                                                <div>
                                                    <p className="text-gray-500">Weight</p>
                                                    <p className="font-medium">{parcel.parcelWeight} kg</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Discount</p>
                                                    <p className="font-medium capitalize">{parcel.discount || 'none'}</p>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-2 pt-2 border-t">
                                                {/* Edit Button - ক্যান্সেল বা ডেলিভারি হলে বন্ধ */}
                                                <button
                                                    onClick={() => handleEdit(parcel)}
                                                    disabled={paid || cancelled || delivered}
                                                    className={`flex-1 px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors
                                                    ${(paid || cancelled || delivered)
                                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                            : 'bg-[#03373d]/10 text-[#03373d] hover:bg-[#03373d]/20 cursor-pointer'
                                                        }`}
                                                >
                                                    <FiEdit2 className="w-4 h-4" />
                                                    <span className="text-sm font-medium">Edit</span>
                                                </button>

                                                {/* Delete Button - ক্যান্সেল বা ডেলিভারি বা পেমেন্ট হলে বন্ধ */}
                                                <button
                                                    onClick={() => handleDelete(parcel._id, parcel)}
                                                    disabled={paid || cancelled || delivered}
                                                    className={`flex-1 px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors
                                                    ${(paid || cancelled || delivered)
                                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                            : 'bg-red-500/10 text-red-500 hover:bg-red-500/20 cursor-pointer'
                                                        }`}
                                                >
                                                    <FiTrash2 className="w-4 h-4" />
                                                    <span className="text-sm font-medium">Delete</span>
                                                </button>

                                                {/* Pay Button - শুধু পেন্ডিং এবং ক্যান্সেল নয় এমন প্যার্সেলের জন্য */}
                                                {!paid && !cancelled && !delivered && (
                                                    <Link href={`/dashboard/payment/${parcel._id}`} className="flex-1">
                                                        <button className="w-full cursor-pointer bg-gradient-to-r from-[#03373d] to-[#1a5c64] text-white px-3 py-2 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2">
                                                            <FiCreditCard className="w-4 h-4" />
                                                            <span className="text-sm font-medium">Pay Now</span>
                                                        </button>
                                                    </Link>
                                                )}

                                                {/* Paid Button - পেমেন্ট করা হলে */}
                                                {paid && !cancelled && (
                                                    <button disabled className="flex-1 bg-green-100 text-green-600 px-3 py-2 rounded-lg flex items-center justify-center gap-2 cursor-default">
                                                        <FiCheckCircle className="w-4 h-4" />
                                                        <span className="text-sm font-medium">Paid</span>
                                                    </button>
                                                )}

                                                {/* Cancelled Badge - ক্যান্সেল হলে */}
                                                {cancelled && (
                                                    <button disabled className="flex-1 bg-red-100 text-red-600 px-3 py-2 rounded-lg flex items-center justify-center gap-2 cursor-default">
                                                        <FiXCircle className="w-4 h-4" />
                                                        <span className="text-sm font-medium">Cancelled</span>
                                                    </button>
                                                )}

                                                {/* Delivered Badge - ডেলিভারি হলে */}
                                                {delivered && !cancelled && (
                                                    <button disabled className="flex-1 bg-green-100 text-green-600 px-3 py-2 rounded-lg flex items-center justify-center gap-2 cursor-default">
                                                        <FiCheckCircle className="w-4 h-4" />
                                                        <span className="text-sm font-medium">Delivered</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {filteredParcels.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No parcels match your search.</p>
                        </div>
                    )}
                </div>

                <UpdateField
                    editParcel={editParcel}
                    setEditParcel={setEditParcel}
                    refetch={refetch}
                />
            </div>
       </Userprotract>
    );
};

export default MyParcels;