"use client";
import useAuth from '@/app/(site)/hooks/useAuth';
import useAxios from '@/app/(site)/hooks/useAxios';
import { useQuery } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
    FaMotorcycle, FaUser, FaMapMarkerAlt, FaBox, FaSearch,
    FaHashtag, FaPhone, FaEnvelope, FaWeightHanging,
    FaTag, FaCalendarAlt, FaCreditCard, FaTruck
} from 'react-icons/fa';
import AssignRiderModal from './AssignriderModal';

const AssignRider = () => {
    const { user } = useAuth();
    const axios = useAxios();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedParcel, setSelectedParcel] = useState(null);
    const [selectedRider, setSelectedRider] = useState('');

    const { data: assignRider = [], refetch } = useQuery({
        queryKey: ['assignRider', user?.email],
        queryFn: async () => {
            const res = await axios.get('/parcels?deliverystatus=pending-pickup');
            return res.data;
        }
    });
    const { data: riders = [], isLoading: ridersLoading, refetch: refetchRiders } = useQuery({
        queryKey: ['riders', selectedParcel?.senderDistrict],
        queryFn: async () => {
            if (!selectedParcel?.senderDistrict) return [];
            const params = new URLSearchParams({
                status: 'approved',
                district: selectedParcel.senderDistrict,
                workstatus: 'available'
            });
            const res = await axios.get(`/rider?${params.toString()}`);
            console.log('Fetched riders:', res.data);
            return res.data;
        },
        enabled: isModalOpen && !!selectedParcel?.senderDistrict, 
    });

  
    useEffect(() => {
        if (!isModalOpen) {
            setSelectedRider('');
        }
    }, [isModalOpen]);

    const handleAssignRiderClick = (parcel) => {
        console.log('Selected parcel:', parcel); 
        setSelectedParcel(parcel);
        setIsModalOpen(true);
    };

    const handleConfirmAssignment = async (riderInfo) => {
        if (!riderInfo) {
            return Swal.fire({
                icon: 'warning',
                title: 'Rider select korun!',
                text: 'Assignment confirm korar age ekjon rider select kora dorkar.',
                confirmButtonColor: '#2563eb'
            });
        }

        try {
            const res = await axios.patch(`/parcels/${riderInfo.parentId}`, riderInfo);

            if (res.data.modifiedCount > 0) {
                Swal.fire({
                    icon: 'success',
                    title: 'Assigned!',
                    text: `Rider ${riderInfo.riderName} assigned successfully.`,
                    timer: 1500,
                    showConfirmButton: false
                });

                refetch();
                setIsModalOpen(false);
                setSelectedParcel(null);
                setSelectedRider('');

                return res.data;
            }
        } catch (error) {
            console.error('Assignment error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.response?.data?.message || 'Something went wrong!',
            });
            throw error;
        }
    };

    const filteredParcels = assignRider.filter(parcel =>
        parcel.trackingId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parcel.receiverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parcel.senderName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const formatTime = (dateString) => new Date(dateString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex justify-between items-center flex-wrap gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Assign Riders</h1>
                            <p className="text-gray-600 mt-1">Manage and assign delivery riders to pending parcels</p>
                        </div>
                        <div className="bg-blue-50 rounded-lg px-4 py-2">
                            <span className="text-blue-600 font-semibold">Pending Pickup: {filteredParcels.length}</span>
                        </div>
                    </div>
                </div>

                {/* Search Section */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by Tracking ID, Receiver, or Sender..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>

                {/* Parcels Grid */}
                {filteredParcels.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600">No pending parcels</h3>
                        <p className="text-gray-400 mt-1">
                            {searchTerm ? 'No parcels match your search criteria' : 'All parcels have been assigned to riders'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredParcels.map((parcel) => (
                            <div key={parcel._id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                                {/* Parcel Header */}
                                <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white rounded-t-xl">
                                    <div className="flex justify-between items-start flex-wrap gap-2">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <FaHashtag className="text-blue-500 text-sm" />
                                                <span className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">{parcel.trackingId}</span>
                                            </div>
                                            <div className="flex items-center gap-4 mt-2 flex-wrap">
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <FaCalendarAlt className="text-green-500" />
                                                    <span>{formatDate(parcel.bookingDate)} at {formatTime(parcel.bookingDate)}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
                                                    <FaCreditCard />
                                                    <span>${parcel.totalPrice}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full uppercase">{parcel.deliverystatus?.replace('-', ' ')}</span>
                                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full uppercase">{parcel.paymentStatus}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Parcel Info Body */}
                                <div className="p-5 space-y-4">
                                    <div className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <FaBox className="text-purple-500" />
                                            <span className="font-medium text-gray-700">{parcel.parcelName}</span>
                                        </div>
                                        <span className="text-sm text-gray-600"><FaWeightHanging className="inline mr-1 text-orange-500" />{parcel.parcelWeight} kg</span>
                                    </div>

                                    {/* Sender Info */}
                                    <div className="border-l-4 border-blue-400 pl-3">
                                        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2"><FaTruck className="text-blue-500 text-xs" /> Sender Information</h4>
                                        <div className="ml-2 text-sm text-gray-600 space-y-1">
                                            <p className="font-medium text-gray-800">{parcel.senderName}</p>
                                            <p><FaMapMarkerAlt className="inline mr-1 text-red-400" /> {parcel.senderAddress} ({parcel.senderDistrict})</p>
                                            <p><FaPhone className="inline mr-1 text-blue-400" /> {parcel.senderPhone}</p>
                                        </div>
                                    </div>

                                    {/* Receiver Info */}
                                    <div className="border-l-4 border-green-400 pl-3">
                                        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2"><FaUser className="text-green-500 text-xs" /> Receiver Information</h4>
                                        <div className="ml-2 text-sm text-gray-600 space-y-1">
                                            <p className="font-medium text-gray-800">{parcel.receiverName}</p>
                                            <p><FaMapMarkerAlt className="inline mr-1 text-green-400" /> {parcel.receiverAddress} ({parcel.receiverDistrict})</p>
                                            <p><FaPhone className="inline mr-1 text-blue-400" /> {parcel.receiverPhone}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <div className="p-5 bg-gray-50 rounded-b-xl flex gap-3">
                                    <button
                                        onClick={() => handleAssignRiderClick(parcel)}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-sm"
                                    >
                                        <FaMotorcycle /> Assign Rider
                                    </button>
                                    <button className="px-4 py-2 border border-gray-300 hover:bg-white text-gray-700 rounded-lg transition-colors">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <AssignRiderModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedParcel(null);
                    setSelectedRider('');
                }}
                selectedParcel={selectedParcel}
                riders={riders}
                selectedRider={selectedRider}
                setSelectedRider={setSelectedRider}
                onConfirm={handleConfirmAssignment}
            />
        </div>
    );
};

export default AssignRider;