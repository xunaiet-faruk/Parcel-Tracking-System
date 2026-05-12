"use client";
import useAuth from '@/app/(site)/hooks/useAuth';
import Swal from 'sweetalert2'
import useAxios from '@/app/(site)/hooks/useAxios';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { FiSearch, FiEdit2, FiTrash2, FiCreditCard, FiCheckCircle } from 'react-icons/fi';
import UpdateField from './UpdateField';
import Link from 'next/link';

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
        parcel.parcelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parcel.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parcel.receiverName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'paid': return 'bg-blue-100 text-blue-700';
            case 'delivered': return 'bg-green-100 text-green-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleEdit = (parcel) => {
        if (parcel.status === 'paid') {
            Swal.fire({
                title: "Cannot Edit",
                text: "This parcel has already been paid and cannot be edited.",
                icon: "warning",
                confirmButtonColor: "#03373d"
            });
            return;
        }
        setEditParcel(parcel);
    };

    const handleDelete = async (parcelId, status) => {
        if (status === 'paid') {
            Swal.fire({
                title: "Cannot Delete",
                text: "This parcel has already been paid and cannot be deleted.",
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
        <div className="min-h-screen p-4 md:p-8">
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
                    {filteredParcels.map((parcel, index) => (
                        <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                            <div className="bg-gradient-to-r from-[#03373d] to-[#1a5c64] px-6 py-3">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-white font-semibold text-lg">{parcel.parcelName}</h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(parcel.status)}`}>
                                        {parcel.status}
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

                                    
                                    <div className="flex gap-2 pt-2 border-t">
                                        <button
                                            onClick={() => handleEdit(parcel)}
                                            disabled={parcel.status === 'paid'} 
                                            className={`flex-1 px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors
            ${parcel.status === 'paid'
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-[#03373d]/10 text-[#03373d] hover:bg-[#03373d]/20 cursor-pointer'
                                                }`}
                                        >
                                            <FiEdit2 className="w-4 h-4" />
                                            <span className="text-sm font-medium">Edit</span>
                                        </button>

                                        <button
                                            onClick={() => handleDelete(parcel._id, parcel.status)}
                                            disabled={parcel.status === 'paid'} 
                                            className={`flex-1  px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors
            ${parcel.status === 'paid'
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-red-500/10 text-red-500 hover:bg-red-500/20 cursor-pointer'
                                                }`}
                                        >
                                            <FiTrash2 className="w-4 h-4" />
                                            <span className="text-sm font-medium">Delete</span>
                                        </button>

                                       
                                        {parcel.status === 'pending' ? (
                                            <Link href={`/dashboard/payment/${parcel._id}`} className="flex-1">
                                                <button className="w-full cursor-pointer bg-gradient-to-r from-[#03373d] to-[#1a5c64] text-white px-3 py-2 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2">
                                                    <FiCreditCard className="w-4 h-4" />
                                                    <span className="text-sm font-medium">Pay Now</span>
                                                </button>
                                            </Link>
                                        ) : (
                                           
                                            <button
                                                disabled
                                                    className="flex-1  cursor-not-allowed bg-green-100 text-green-600 px-3 py-2 rounded-lg flex items-center justify-center gap-2 cursor-default"
                                            >
                                                <FiCheckCircle className="w-4 h-4" />
                                                <span className="text-sm font-medium">Paid</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
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
    );
};

export default MyParcels;