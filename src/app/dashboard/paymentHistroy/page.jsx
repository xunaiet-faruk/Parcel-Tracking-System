"use client";
import useAuth from "@/app/(site)/hooks/useAuth";
import useAxios from "@/app/(site)/hooks/useAxios";
import Loading from "@/app/components/Loading";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaFilter, FaDownload, FaEye, FaCopy } from "react-icons/fa";
import Swal from "sweetalert2";

const PaymentHistory = () => {
    const axios = useAxios();
    const { user } = useAuth();
    const [payments, setPayments] = useState([]);
    const [filteredPayments, setFilteredPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedPayment, setSelectedPayment] = useState(null);

    useEffect(() => {
        if (user?.email) {
            fetchPayments();
        }
    }, [user?.email]);

    useEffect(() => {
        filterPayments();
    }, [searchTerm, statusFilter, payments]);

    const fetchPayments = async () => {
        try {
            setLoading(true);
            const email = user?.email;

            // ২টি এন্ডপয়েন্ট চেষ্টা করা
            let paymentData = [];

            try {
                // প্রথম এন্ডপয়েন্ট
                const res = await axios.get(`/payment?email=${email}`);
                if (res.data && Array.isArray(res.data)) {
                    paymentData = res.data;
                }
            } catch (err) {
                console.log("First endpoint failed, trying alternative...");
            }

            // যদি প্রথমে না পাওয়া যায়, তাহলে parcels থেকে ডাটা আনা
            if (paymentData.length === 0) {
                try {
                    const parcelsRes = await axios.get(`/parcels?email=${email}`);
                    const parcels = parcelsRes.data || [];

                    // যেসব প্যাকেলের পেমেন্ট কমপ্লিট হয়েছে সেগুলো থেকে পেমেন্ট ডাটা তৈরি
                    paymentData = parcels
                        .filter(p => p.paymentStatus === 'completed' || p.status === 'paid')
                        .map(p => ({
                            _id: p._id,
                            parcelName: p.parcelName,
                            amount: p.totalPrice,
                            currency: 'BDT',
                            paymentMethod: 'card',
                            paidAt: p.paidAt || p.createdAt,
                            customer_email: p.senderEmail,
                            transactionId: p.transactionId,
                            paymentStatus: 'paid',
                            trackingId: p.trackingId,
                            parcelId: p._id
                        }));
                } catch (err) {
                    console.log("Parcels endpoint failed:", err);
                }
            }

            console.log("Payment data found:", paymentData.length);
            setPayments(paymentData);
            setFilteredPayments(paymentData);

        } catch (error) {
            console.error("Failed to fetch payments", error);
        } finally {
            setLoading(false);
        }
    };

    const filterPayments = () => {
        let filtered = [...payments];

        if (searchTerm) {
            filtered = filtered.filter(p =>
                p.parcelName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.trackingId?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter !== "all") {
            filtered = filtered.filter(p => p.paymentStatus === statusFilter);
        }

        setFilteredPayments(filtered);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            let date;
            if (typeof dateString === 'string') {
                date = new Date(dateString);
            } else if (dateString._seconds) {
                date = new Date(dateString._seconds * 1000);
            } else {
                date = new Date(dateString);
            }

            if (isNaN(date.getTime())) return "N/A";

            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch (e) {
            return "N/A";
        }
    };

    const getStatusBadge = (status) => {
        if (status === "paid" || status === "completed") {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Paid
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                Pending
            </span>
        );
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        Swal.fire({
            title: "Copied to clipboard!",
            icon: "success",
            draggable: true
        });
    };

    if (loading) {
        return <Loading />;
    }

    // ক্যালকুলেশন
    const totalAmount = filteredPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const successfulPayments = filteredPayments.filter(p => p.paymentStatus === "paid" || p.paymentStatus === "completed").length;
    const uniqueMethods = new Set(filteredPayments.map(p => p.paymentMethod)).size;

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center justify-center gap-3 mb-2">
                    <div className="text-3xl">📊</div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-[#03373d] to-[#1a5c64] bg-clip-text text-transparent">
                        Payment History
                    </h1>
                </div>
                <p className="text-gray-500 text-center">
                    Track and manage all your payment transactions
                </p>
            </motion.div>
            {/* Table Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gradient-to-r from-[#03373d] to-[#1a5c64]">
                                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Parcel</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Payment Method</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Paid At</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Transaction ID</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredPayments.length > 0 ? (
                                filteredPayments.map((payment, index) => (
                                    <tr key={payment._id || index} className="group hover:bg-[#caeb66]/5 transition-colors duration-200">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900">
                                                    {payment.parcelName || "N/A"}
                                                </span>
                                                {payment.trackingId && (
                                                    <span className="text-xs text-gray-400 font-mono">
                                                        {payment.trackingId}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-gray-900">
                                                ৳{(payment.amount || 0).toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 bg-[#caeb66]/10 rounded-lg flex items-center justify-center">
                                                    <svg className="w-3.5 h-3.5 text-[#03373d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                    </svg>
                                                </div>
                                                <span className="text-gray-700 capitalize">
                                                    {payment.paymentMethod || "Card"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-600 text-sm">
                                                {formatDate(payment.paidAt)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5">
                                                <span className="font-mono text-xs text-gray-500">
                                                    {payment.transactionId?.slice(-12) || "N/A"}
                                                </span>
                                                {payment.transactionId && (
                                                    <button
                                                        onClick={() => copyToClipboard(payment.transactionId)}
                                                        className="text-gray-400 hover:text-[#03373d]"
                                                    >
                                                        <FaCopy className="w-3 h-3" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(payment.paymentStatus)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => setSelectedPayment(payment)}
                                                className="text-gray-500 hover:text-[#03373d] transition"
                                            >
                                                <FaEye className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="text-6xl mb-4 opacity-50">📭</div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-1">
                                                No payment history
                                            </h3>
                                            <p className="text-gray-500 text-sm">
                                                Your payment transactions will appear here
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            
            </motion.div>

            {/* Payment Details Modal */}
            {selectedPayment && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedPayment(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold text-[#03373d]">Payment Details</h2>
                                <button onClick={() => setSelectedPayment(null)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-gray-500">Parcel Name:</span>
                                <span className="font-semibold">{selectedPayment.parcelName}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-gray-500">Amount:</span>
                                <span className="font-semibold text-green-600">৳{selectedPayment.amount}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-gray-500">Transaction ID:</span>
                                <span className="font-mono text-sm">{selectedPayment.transactionId}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-gray-500">Payment Date:</span>
                                <span>{formatDate(selectedPayment.paidAt)}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-gray-500">Status:</span>
                                {getStatusBadge(selectedPayment.paymentStatus)}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentHistory;