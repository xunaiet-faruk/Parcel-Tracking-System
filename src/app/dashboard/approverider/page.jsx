"use client";
import useAxios from '@/app/(site)/hooks/useAxios';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import AdminRouters from '../AdminRoutes/AdminRouters';

const AppoveRider = () => {
    const axios = useAxios();
    const [selectedRider, setSelectedRider] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const { data: riders, refetch, isLoading } = useQuery({
        queryKey: ['rider'],
        queryFn: async () => {
            const res = await axios.get('/rider');
            return res.data;
        }
    });

    const handleApprove = async (riderId, riderEmail) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#caeb66",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, approve it!"
        });

        if (result.isConfirmed) {
            setActionLoading(true);
            try {
                const updateData = { status: 'approved', email: riderEmail };
                const res = await axios.patch(`/rider/${riderId}`, updateData);

                if (res.data.success || res.data.modifiedCount > 0) {
                    await refetch();
                    setShowModal(false);
                    Swal.fire({
                        title: "Approved!",
                        text: "Rider has been approved successfully.",
                        icon: "success",
                        confirmButtonColor: "#caeb66",
                        timer: 2000
                    });
                }
            } catch (error) {
                Swal.fire({
                    title: "Error!",
                    text: "Failed to approve rider.",
                    icon: "error",
                    confirmButtonColor: "#caeb66"
                });
            } finally {
                setActionLoading(false);
            }
        }
    };

    const handleReject = async (riderId) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#caeb66",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, reject it!"
        });

        if (result.isConfirmed) {
            setActionLoading(true);
            try {
                const updateStatus = { status: 'rejected' };
                await axios.patch(`/rider/${riderId}`, updateStatus);
                await refetch();
                setShowModal(false);
                Swal.fire({
                    title: "Rejected!",
                    text: "Rider has been rejected.",
                    icon: "success",
                    confirmButtonColor: "#caeb66",
                    timer: 2000
                });
            } catch (error) {
                Swal.fire({
                    title: "Error!",
                    text: "Failed to reject rider.",
                    icon: "error",
                    confirmButtonColor: "#caeb66"
                });
            } finally {
                setActionLoading(false);
            }
        }
    };

    const getCardStyle = (status) => {
        switch (status) {
            case 'approved':
                return {
                    border: 'border-emerald-200',
                    shadow: 'shadow-emerald-100',
                    leftBg: 'bg-gradient-to-br from-emerald-700 to-emerald-900',
                    statusBg: 'bg-emerald-500/20',
                    statusText: 'text-emerald-300',
                    badgeIcon: '✅',
                    badgeText: 'Approved',
                    showActions: false
                };
            case 'rejected':
                return {
                    border: 'border-red-200',
                    shadow: 'shadow-red-100',
                    leftBg: 'bg-gradient-to-br from-red-700 to-red-900',
                    statusBg: 'bg-red-500/20',
                    statusText: 'text-red-300',
                    badgeIcon: '❌',
                    badgeText: 'Rejected',
                    showActions: false
                };
            default:
                return {
                    border: 'border-gray-100',
                    shadow: 'shadow-xl',
                    leftBg: 'bg-gradient-to-br from-[#03373d] to-[#1a5c64]',
                    statusBg: 'bg-amber-500/20',
                    statusText: 'text-amber-300',
                    badgeIcon: '⏳',
                    badgeText: 'Pending',
                    showActions: true
                };
        }
    };

    if (isLoading) {
        return (
            <div className="w-full max-w-7xl mx-auto px-4 py-8 flex justify-center items-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#03373d] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading riders...</p>
                </div>
            </div>
        );
    }

    return (
        <AdminRouters>
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="text-3xl">🏍️</div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#03373d] to-[#1a5c64] bg-clip-text text-transparent">
                            Rider Approval Dashboard
                        </h1>
                    </div>
                    <p className="text-gray-500 ml-12">
                        Review and manage rider applications
                    </p>
                </div>

                <div className="space-y-4">
                    {riders?.map((rider) => {
                        const style = getCardStyle(rider.status);
                        return (
                            <div
                                key={rider._id}
                                className={`bg-white rounded-2xl shadow-${style.shadow} border ${style.border} hover:shadow-2xl transition-all duration-300 overflow-hidden relative`}
                            >
                                {/* Status Badge Overlay */}
                                <div className="absolute top-4 right-4 z-10">
                                    {rider.status === 'approved' && (
                                        <div className="bg-emerald-500 rounded-full p-2 shadow-lg animate-bounce">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                    {rider.status === 'rejected' && (
                                        <div className="bg-red-500 rounded-full p-2 shadow-lg">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </div>
                                    )}
                                    {rider.status === 'pending' && (
                                        <div className="bg-amber-500 rounded-full p-2 shadow-lg animate-pulse">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col lg:flex-row">
                                    {/* Left Section - Profile & Basic Info */}
                                    <div className={`lg:w-1/4 ${style.leftBg} p-6 flex flex-col items-center text-center relative`}>
                                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-3">
                                            <span className="text-4xl">🏍️</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-1">{rider.fullName}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${style.statusBg} ${style.statusText} inline-block mb-3 flex items-center gap-1`}>
                                            <span>{style.badgeIcon}</span>
                                            <span>{style.badgeText}</span>
                                        </span>
                                        <div className="flex items-center gap-2 text-[#caeb66] text-sm">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>Applied: {new Date(rider.createAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    {/* Middle Section - Details */}
                                    <div className="lg:w-1/2 p-6 flex-1">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Contact Info */}
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                    <span className="text-gray-600">{rider.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                    <span className="text-gray-600">{rider.phone}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    <span className="text-gray-600">{rider.address}, {rider.district}</span>
                                                </div>
                                            </div>

                                            {/* Vehicle Info */}
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                                                    </svg>
                                                    <span className="text-gray-600 font-medium">{rider.vehicleType}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                                    </svg>
                                                    <span className="text-gray-600">License: {rider.licenseNumber}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span className="text-gray-600">Exp: {rider.experience}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Emergency Contact Badge */}
                                        <div className="mt-4 bg-red-50 rounded-lg p-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                    </svg>
                                                    <span className="text-sm text-red-700 font-medium">Emergency: {rider.emergencyContact}</span>
                                                </div>
                                                <span className="text-sm font-semibold text-red-700">{rider.emergencyPhone}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Section - Actions */}
                                    <div className={`lg:w-1/4 ${rider.status === 'pending' ? 'bg-gray-50' : 'bg-gray-100'} p-6 flex flex-col justify-center items-center gap-3 border-t lg:border-t-0 lg:border-l border-gray-100`}>
                                        {style.showActions ? (
                                            <>
                                                <button
                                                    onClick={() => {
                                                        setSelectedRider(rider);
                                                        setShowModal(true);
                                                    }}
                                                    disabled={actionLoading}
                                                    className="w-full cursor-pointer px-4 py-2.5 bg-gradient-to-r from-[#03373d] to-[#1a5c64] text-white rounded-lg hover:opacity-90 transition-all hover:shadow-md font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    Review Details
                                                </button>
                                                <div className="flex gap-2 w-full">
                                                    <button
                                                        onClick={() => handleReject(rider._id)}
                                                        disabled={actionLoading}
                                                        className="flex-1 px-3 py-2 bg-red-600 text-white cursor-pointer rounded-lg hover:bg-red-700 transition-all text-sm font-medium disabled:opacity-50"
                                                    >
                                                        {actionLoading ? '...' : 'Reject'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleApprove(rider._id, rider.email)}
                                                        disabled={actionLoading}
                                                        className="flex-1 px-3 py-2 bg-[#caeb66] cursor-pointer rounded-lg hover:bg-[#dcf497] transition-all text-sm font-medium text-[#03373d] disabled:opacity-50"
                                                    >
                                                        {actionLoading ? '...' : 'Approve'}
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center space-y-3 w-full">
                                                {rider.status === 'approved' && (
                                                    <>
                                                        <div className="flex justify-center">
                                                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center animate-pulse">
                                                                <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                        <p className="text-emerald-600 font-semibold">Application Approved</p>
                                                        <p className="text-xs text-gray-500">This rider has been verified and approved</p>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedRider(rider);
                                                                setShowModal(true);
                                                            }}
                                                            className="w-full mt-2 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all text-sm font-medium"
                                                        >
                                                            View Details
                                                        </button>
                                                    </>
                                                )}
                                                {rider.status === 'rejected' && (
                                                    <>
                                                        <div className="flex justify-center">
                                                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                                                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                        <p className="text-red-600 font-semibold">Application Rejected</p>
                                                        <p className="text-xs text-gray-500">This application has been declined</p>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedRider(rider);
                                                                setShowModal(true);
                                                            }}
                                                            className="w-full mt-2 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all text-sm font-medium"
                                                        >
                                                            View Details
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Empty State */}
                {(!riders || riders.length === 0) && (
                    <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-2xl shadow-lg border border-gray-100">
                        <div className="text-6xl mb-4 opacity-50">🏍️</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No riders found</h3>
                        <p className="text-gray-500 text-sm text-center">No rider applications available at the moment</p>
                    </div>
                )}

                {/* Approval Modal */}
                {showModal && selectedRider && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-gradient-to-r from-[#03373d] to-[#1a5c64] px-6 py-4 flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-white">Complete Application Review</h2>
                                <button onClick={() => setShowModal(false)} className="text-white hover:text-[#caeb66] transition-colors">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Personal Information */}
                                <div>
                                    <h3 className="text-lg font-semibold text-[#03373d] mb-3 flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Personal Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                                        <div><p className="text-xs text-gray-500">Full Name</p><p className="font-medium text-gray-900">{selectedRider.fullName}</p></div>
                                        <div><p className="text-xs text-gray-500">Email</p><p className="font-medium text-gray-900">{selectedRider.email}</p></div>
                                        <div><p className="text-xs text-gray-500">Phone</p><p className="font-medium text-gray-900">{selectedRider.phone}</p></div>
                                        <div><p className="text-xs text-gray-500">Address</p><p className="font-medium text-gray-900">{selectedRider.address}</p></div>
                                        <div><p className="text-xs text-gray-500">District</p><p className="font-medium text-gray-900">{selectedRider.district}</p></div>
                                    </div>
                                </div>

                                {/* Vehicle Information */}
                                <div>
                                    <h3 className="text-lg font-semibold text-[#03373d] mb-3 flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                                        </svg>
                                        Vehicle Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                                        <div><p className="text-xs text-gray-500">Vehicle Type</p><p className="font-medium text-gray-900">{selectedRider.vehicleType}</p></div>
                                        <div><p className="text-xs text-gray-500">License Number</p><p className="font-medium text-gray-900">{selectedRider.licenseNumber}</p></div>
                                        <div><p className="text-xs text-gray-500">Experience</p><p className="font-medium text-gray-900">{selectedRider.experience}</p></div>
                                        <div><p className="text-xs text-gray-500">Available Hours</p><p className="font-medium text-gray-900">{selectedRider.availableHours} hours/day</p></div>
                                    </div>
                                </div>

                                {/* Emergency Contact */}
                                <div>
                                    <h3 className="text-lg font-semibold text-[#03373d] mb-3 flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        Emergency Contact
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-red-50 rounded-lg p-4">
                                        <div><p className="text-xs text-red-600">Contact Name</p><p className="font-medium text-gray-900">{selectedRider.emergencyContact}</p></div>
                                        <div><p className="text-xs text-red-600">Emergency Phone</p><p className="font-medium text-gray-900">{selectedRider.emergencyPhone}</p></div>
                                    </div>
                                </div>
                            </div>

                            {selectedRider.status === 'pending' && (
                                <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3">
                                    <button onClick={() => handleReject(selectedRider._id)} disabled={actionLoading} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium disabled:opacity-50">
                                        {actionLoading ? 'Processing...' : 'Reject Application'}
                                    </button>
                                    <button onClick={() => handleApprove(selectedRider._id, selectedRider.email)} disabled={actionLoading} className="flex-1 px-4 py-2 bg-gradient-to-r from-[#03373d] to-[#1a5c64] text-white rounded-lg hover:opacity-90 transition-all font-medium disabled:opacity-50">
                                        {actionLoading ? 'Processing...' : 'Approve Application'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AdminRouters>
    );
};

export default AppoveRider;