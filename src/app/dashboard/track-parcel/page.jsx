"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaSearch, FaBox, FaMapMarkerAlt, FaClock, FaCheckCircle,
    FaTruck, FaUser, FaPhone, FaEnvelope, FaCalendarAlt,
    FaCopy, FaShare, FaDownload, FaPrint, FaQrcode, FaSpinner
} from 'react-icons/fa';
import useAxios from '../../(site)/hooks/useAxios';
import Loading from '@/app/components/Loading';
import Link from 'next/link';
import Swal from 'sweetalert2';

const Trackingparcel = () => {
    const axios = useAxios();
    const [trackingId, setTrackingId] = useState('');
    const [parcel, setParcel] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [recentSearches, setRecentSearches] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem('recentTrackingIds');
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }
    }, []);

    const trackParcel = async (e) => {
        e.preventDefault();
        if (!trackingId.trim()) {
            setError('Please enter a tracking ID');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // সব প্যাকেল আনা এবং trackingId ম্যাচ করা
            const response = await axios.get('/parcels');
            const allParcels = response.data || [];

            console.log('All parcels:', allParcels);
            console.log('Searching for tracking ID:', trackingId);

            // trackingId দিয়ে খোঁজা
            const foundParcel = allParcels.find(p =>
                p.trackingId === trackingId ||
                p.trackingId?.toLowerCase() === trackingId.toLowerCase()
            );

            if (foundParcel) {
                console.log('Found parcel:', foundParcel);
                console.log('Delivery status:', foundParcel.deliverystatus);
                console.log('Booking date:', foundParcel.bookingDate);
                setParcel(foundParcel);
                saveToRecentSearches(trackingId);
                setError('');
            } else {
                setParcel(null);
                setError('No parcel found with this tracking ID');
            }
        } catch (error) {
            console.error('Error tracking parcel:', error);
            setError('Failed to track parcel. Please try again.');
            setParcel(null);
        } finally {
            setLoading(false);
        }
    };

    const saveToRecentSearches = (id) => {
        const recent = [id, ...recentSearches.filter(s => s !== id)].slice(0, 5);
        setRecentSearches(recent);
        localStorage.setItem('recentTrackingIds', JSON.stringify(recent));
    };

    const copyTrackingId = () => {
        if (parcel?.trackingId) {
            navigator.clipboard.writeText(parcel.trackingId);
            Swal.fire({
                title: "Tracking ID copied!",
                icon: "success",
                draggable: true
            });
        }
    };

    // তারিখ ফরম্যাট করার ফাংশন
    const formatDate = (dateValue) => {
        if (!dateValue) return 'N/A';

        try {
            let date;
            if (typeof dateValue === 'string') {
                date = new Date(dateValue);
            } else if (dateValue._seconds) {
                date = new Date(dateValue._seconds * 1000);
            } else if (dateValue instanceof Date) {
                date = dateValue;
            } else {
                date = new Date(dateValue);
            }

            if (isNaN(date.getTime())) return 'N/A';

            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
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
            'delivered': 'bg-green-100 text-green-700 border-green-200',
            'picked-up': 'bg-purple-100 text-purple-700 border-purple-200',
            'assigned': 'bg-blue-100 text-blue-700 border-blue-200',
            'pending-pickup': 'bg-yellow-100 text-yellow-700 border-yellow-200',
            'pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
            'cancelled': 'bg-red-100 text-red-700 border-red-200'
        };
        return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
    };

    const getStatusText = (status) => {
        const texts = {
            'delivered': '✅ Delivered',
            'picked-up': '📦 Picked Up',
            'assigned': '👤 Rider Assigned',
            'pending-pickup': '⏳ Pending Pickup',
            'pending': '⏳ Pending',
            'cancelled': '❌ Cancelled'
        };
        return texts[status] || status || '⏳ Pending';
    };

    const getStatusIcon = (status) => {
        const icons = {
            'delivered': <FaCheckCircle className="text-2xl text-green-600" />,
            'picked-up': <FaTruck className="text-2xl text-purple-600" />,
            'assigned': <FaUser className="text-2xl text-blue-600" />,
            'pending-pickup': <FaClock className="text-2xl text-yellow-600" />,
            'pending': <FaSpinner className="text-2xl text-yellow-600 animate-spin" />
        };
        return icons[status] || <FaBox className="text-2xl text-gray-600" />;
    };

    // স্ট্যাটাস অনুযায়ী প্রোগ্রেস স্টেপস
    const getProgressSteps = (status) => {
        const steps = [
            { key: 'pending', label: 'Order Placed', description: 'Your parcel has been booked successfully' },
            { key: 'assigned', label: 'Rider Assigned', description: 'A rider has been assigned to your parcel' },
            { key: 'picked-up', label: 'Picked Up', description: 'Rider has picked up your parcel' },
            { key: 'delivered', label: 'Delivered', description: 'Your parcel has been delivered' }
        ];

        let currentIndex = 0;
        if (status === 'assigned') currentIndex = 1;
        else if (status === 'picked-up') currentIndex = 2;
        else if (status === 'delivered') currentIndex = 3;
        else if (status === 'pending-pickup') currentIndex = 0;
        else if (status === 'pending') currentIndex = 0;

        return { steps, currentIndex };
    };

    const { steps, currentIndex } = parcel ? getProgressSteps(parcel.deliverystatus || parcel.status) : { steps: [], currentIndex: 0 };

    return (
        <div className=" py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-[#03373d] mb-2">
                        Track Your Parcel
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Enter your tracking ID to get real-time updates
                    </p>
                </motion.div>

                {/* Search Box */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl mx-auto mb-8"
                >
                    <form onSubmit={trackParcel} className="relative">
                        <div className="relative">
                            <input
                                type="text"
                                value={trackingId}
                                onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                                placeholder="Enter Tracking ID (e.g., PRCL-20260513-3504551F)"
                                className="w-full px-6 py-4 pr-32 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#caeb66] focus:ring-2 focus:ring-[#caeb66] transition-all bg-white shadow-lg"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#03373d] text-white px-6 py-2 rounded-xl hover:bg-[#caeb66] hover:text-[#03373d] transition flex items-center gap-2 font-semibold disabled:opacity-50"
                            >
                                {loading ? <Loading size="small" /> : <><FaSearch /> Track</>}
                            </button>
                        </div>
                    </form>

                    {recentSearches.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2 justify-center">
                            <span className="text-sm text-gray-500">Recent:</span>
                            {recentSearches.map((id, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setTrackingId(id);
                                        setTimeout(() => trackParcel({ preventDefault: () => { } }), 100);
                                    }}
                                    className="text-sm bg-white px-3 py-1 rounded-full border border-gray-200 hover:border-[#caeb66] hover:bg-[#caeb66]/20 transition"
                                >
                                    {id}
                                </button>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Error Message */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="max-w-2xl mx-auto mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl text-center"
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Parcel Details */}
                <AnimatePresence>
                    {parcel && !loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            {/* Status Header Card */}
                            <div className={`rounded-2xl shadow-xl p-6 ${getStatusColor(parcel.deliverystatus || parcel.status)}`}>
                                <div className="flex justify-between items-center flex-wrap gap-4">
                                    <div className="flex items-center gap-3">
                                        {getStatusIcon(parcel.deliverystatus || parcel.status)}
                                        <div>
                                            <h2 className="text-2xl font-bold">
                                                {getStatusText(parcel.deliverystatus || parcel.status)}
                                            </h2>
                                            <p className="text-sm opacity-75 font-mono">
                                                Tracking ID: {parcel.trackingId}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={copyTrackingId}
                                            className="bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg transition flex items-center gap-2"
                                        >
                                            <FaCopy /> Copy
                                        </button>
                                    
                                    </div>
                                </div>
                            </div>

                            {/* Progress Timeline */}
                            <div className="bg-white rounded-2xl shadow-xl p-6">
                                <h3 className="text-lg font-bold text-[#03373d] mb-6 flex items-center gap-2">
                                    <FaClock /> Delivery Progress
                                </h3>
                                <div className="relative">
                                    {steps.map((step, index) => {
                                        const isCompleted = index <= currentIndex;
                                        const isCurrent = index === currentIndex;

                                        return (
                                            <div key={step.key} className="relative flex items-start mb-8 last:mb-0">
                                                {index < steps.length - 1 && (
                                                    <div className={`absolute left-5 top-10 w-0.5 h-12 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`} />
                                                )}

                                                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all
                                                    ${isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}
                                                    ${isCurrent ? 'ring-4 ring-green-200 scale-110' : ''}`}>
                                                    {index === 0 && <FaBox />}
                                                    {index === 1 && <FaUser />}
                                                    {index === 2 && <FaTruck />}
                                                    {index === 3 && <FaCheckCircle />}
                                                </div>

                                                <div className="ml-4 flex-1">
                                                    <h4 className={`font-semibold ${isCompleted ? 'text-green-700' : 'text-gray-500'}`}>
                                                        {step.label}
                                                    </h4>
                                                    <p className="text-sm text-gray-500">{step.description}</p>
                                                    {isCurrent && (parcel.updatedAt || parcel.bookingDate) && (
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            {formatDate(parcel.updatedAt || parcel.bookingDate)}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Parcel & Customer Info */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Parcel Details */}
                                <div className="bg-white rounded-2xl shadow-xl p-6">
                                    <h3 className="text-lg font-bold text-[#03373d] mb-4 flex items-center gap-2">
                                        <FaBox /> Parcel Details
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between py-2 border-b">
                                            <span className="text-gray-500">Parcel Name:</span>
                                            <span className="font-semibold">{parcel.parcelName || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b">
                                            <span className="text-gray-500">Weight:</span>
                                            <span className="font-semibold">{parcel.parcelWeight || 'N/A'} kg</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b">
                                            <span className="text-gray-500">Total Price:</span>
                                            <span className="font-semibold text-green-600">৳{parcel.totalPrice || 0}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b">
                                            <span className="text-gray-500">Booking Date:</span>
                                            <span className="font-semibold">{formatDate(parcel.bookingDate)}</span>
                                        </div>
                                        {parcel.deliveredAt && (
                                            <div className="flex justify-between py-2 border-b">
                                                <span className="text-gray-500">Delivered Date:</span>
                                                <span className="font-semibold text-green-600">{formatDate(parcel.deliveredAt)}</span>
                                            </div>
                                        )}
                                        {parcel.pickedUpAt && (
                                            <div className="flex justify-between py-2 border-b">
                                                <span className="text-gray-500">Picked Up Date:</span>
                                                <span className="font-semibold text-purple-600">{formatDate(parcel.pickedUpAt)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Sender Details */}
                                <div className="bg-white rounded-2xl shadow-xl p-6">
                                    <h3 className="text-lg font-bold text-[#03373d] mb-4 flex items-center gap-2">
                                        <FaUser /> Sender Details
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between py-2 border-b">
                                            <span className="text-gray-500">Name:</span>
                                            <span className="font-semibold">{parcel.senderName || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b">
                                            <span className="text-gray-500">Phone:</span>
                                            <span className="font-semibold">{parcel.senderPhone || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b">
                                            <span className="text-gray-500">Email:</span>
                                            <span className="font-semibold">{parcel.senderEmail || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b">
                                            <span className="text-gray-500">Address:</span>
                                            <span className="font-semibold">{parcel.senderAddress || 'N/A'}, {parcel.senderDistrict || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Address */}
                            <div className="bg-white rounded-2xl shadow-xl p-6">
                                <h3 className="text-lg font-bold text-[#03373d] mb-4 flex items-center gap-2">
                                    <FaMapMarkerAlt /> Delivery Address
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <p className="text-sm text-gray-500 mb-1">Receiver Name</p>
                                        <p className="font-semibold">{parcel.receiverName || 'N/A'}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <p className="text-sm text-gray-500 mb-1">Receiver Phone</p>
                                        <p className="font-semibold">{parcel.receiverPhone || 'N/A'}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-xl md:col-span-2">
                                        <p className="text-sm text-gray-500 mb-1">Full Address</p>
                                        <p className="font-semibold">{parcel.receiverAddress || 'N/A'}, {parcel.receiverDistrict || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Rider Info */}
                            {parcel.riderName && (
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-xl p-6">
                                    <h3 className="text-lg font-bold text-[#03373d] mb-4 flex items-center gap-2">
                                        <FaTruck /> Rider Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Rider Name</p>
                                            <p className="font-semibold">{parcel.riderName}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Rider Phone</p>
                                            <p className="font-semibold">{parcel.riderPhone || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Rider Email</p>
                                            <p className="font-semibold text-sm">{parcel.riderEmail}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-4 justify-center">
                            
                                <Link href="/parcel">
                                    <button className="bg-[#03373d] text-white px-6 py-3 rounded-xl hover:bg-[#caeb66] hover:text-[#03373d] transition flex items-center gap-2">
                                        <FaBox /> Send New Parcel
                                    </button>
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Help Section */}
                {!parcel && !loading && !error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center mt-12"
                    >
                        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
                            <FaSearch className="text-5xl text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-[#03373d] mb-2">Where to find Tracking ID?</h3>
                            <p className="text-gray-600 mb-4">
                                You can find your tracking ID in the confirmation email or SMS sent to you after booking.
                            </p>
                            <div className="text-sm text-gray-500">
                                Format example: <span className="font-mono bg-gray-100 px-2 py-1 rounded">PRCL-20260513-3504551F</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Trackingparcel;