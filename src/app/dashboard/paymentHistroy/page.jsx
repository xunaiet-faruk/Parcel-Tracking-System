"use client";
import useAuth from "@/app/(site)/hooks/useAuth";
import useAxios from "@/app/(site)/hooks/useAxios";
import Loading from "@/app/components/Loading";
import React, { useEffect, useState } from "react";

const PaymentHistory = () => {
    const axios = useAxios();
    const {user} =useAuth()
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const res = await axios.get(`/payment?email=${user?.email}`);
                setPayments(res.data);
                console.log(res.data);
            } catch (error) {
                console.error("Failed to fetch payments", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPayments();
    }, [axios]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    
    const getStatusBadge = (status) => {
        if (status === "paid") {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#caeb66]/20 text-[#03373d]">
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

    if (loading) {
        return <Loading/>
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">

            <div className="mb-8">
                <div className="flex items-center justify-center gap-3 mb-2">
                    <div className="text-3xl">📊</div>
                    <h1 className="text-3xl  font-bold bg-gradient-to-r from-[#03373d] to-[#1a5c64] bg-clip-text text-transparent">
                        Payment History
                    </h1>
                </div>
                <p className="text-gray-500 text-center ml-12">
                    Track and manage all your payment transactions
                </p>
            </div>

            {/* Stats Cards with Brand Colors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-green-50 rounded-xl shadow-lg  p-4 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm  text-[#03373d]">Total Payments</p>
                            <p className="text-2xl font-bold text-gray-900">{payments.length}</p>
                        </div>
                        <div className="w-10 h-10 bg-[#caeb66]/20 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-[#03373d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="bg-blue-50 rounded-xl shadow-lg border border-gray-100 p-4 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Amount</p>
                            <p className="text-2xl font-bold text-gray-900">
                                ${payments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
                            </p>
                        </div>
                        <div className="w-10 h-10 bg-[#caeb66]/20 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-[#03373d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="bg-purple-50 rounded-xl shadow-lg border border-gray-100 p-4 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Successful Payments</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {payments.filter(p => p.paymentStatus === "paid").length}
                            </p>
                        </div>
                        <div className="w-10 h-10 bg-[#caeb66]/20 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-[#03373d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="bg-orange-50 rounded-xl shadow-lg border border-gray-100 p-4 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Payment Methods</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {new Set(payments.map(p => p.paymentMethod)).size}
                            </p>
                        </div>
                        <div className="w-10 h-10 bg-[#caeb66]/20 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-[#03373d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table Section - White Background with Shadow */}
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                {/* Table Header */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gradient-to-r from-[#03373d] to-[#1a5c64]">
                                <th className="px-6 py-4 text-left">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                        Parcel
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Amount
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                        Payment Method
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Paid At
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        Customer Email
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                        </svg>
                                        Transaction ID
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                        Status
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {payments.map((payment) => (
                                <tr
                                    key={payment._id}
                                    className="group hover:bg-[#caeb66]/5 transition-colors duration-200"
                                >
                                    {/* Parcel Info */}
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900">
                                                {payment.parcelName}
                                            </span>
                                            <span className="text-xs text-gray-400 font-mono">
                                                ID: {payment.parcelId?.slice(-8)}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Amount */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1">
                                            <span className="text-gray-500 text-sm">
                                                {payment.currency?.toUpperCase()}
                                            </span>
                                            <span className="font-bold text-gray-900">
                                                {payment.amount?.toFixed(2)}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Payment Method */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 bg-[#caeb66]/10 rounded-lg flex items-center justify-center">
                                                <svg className="w-3.5 h-3.5 text-[#03373d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                </svg>
                                            </div>
                                            <span className="text-gray-700 capitalize">
                                                {payment.paymentMethod}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Paid At */}
                                    <td className="px-6 py-4">
                                        <span className="text-gray-600 text-sm">
                                            {formatDate(payment.paidAt)}
                                        </span>
                                    </td>

                                    {/* Customer Email */}
                                    <td className="px-6 py-4">
                                        {payment.customer_email ? (
                                            <div className="flex items-center gap-1.5">
                                                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                <span className="text-gray-600 text-sm">
                                                    {payment.customer_email}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 text-sm italic">
                                                Not provided
                                            </span>
                                        )}
                                    </td>

                                    {/* Transaction ID */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5">
                                            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                            </svg>
                                            <span className="font-mono text-xs text-gray-500">
                                                {payment.transactionId?.slice(-12)}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Status */}
                                    <td className="px-6 py-4">
                                        {getStatusBadge(payment.paymentStatus)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {payments.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 px-4 bg-white">
                        <div className="text-6xl mb-4 opacity-50">📭</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                            No payment history
                        </h3>
                        <p className="text-gray-500 text-sm">
                            Your payment transactions will appear here
                        </p>
                    </div>
                )}

                {/* Table Footer */}
                {payments.length > 0 && (
                    <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                                Showing <span className="font-medium text-[#03373d]">{payments.length}</span> payments
                            </p>
                            <div className="flex gap-2">
                                <button className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-[#caeb66]/20 hover:border-[#caeb66]/50 transition-colors">
                                    Previous
                                </button>
                                <button className="px-3 py-1.5 text-sm rounded-lg bg-gradient-to-r from-[#03373d] to-[#1a5c64] text-white hover:opacity-90 transition-all hover:shadow-md">
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentHistory;