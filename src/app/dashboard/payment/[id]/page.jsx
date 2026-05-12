"use client";
import useAxios from '@/app/(site)/hooks/useAxios';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import Swal from 'sweetalert2';
import { FiUser, FiMail, FiDollarSign, FiCreditCard, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import Loading from '@/app/components/Loading';

const Payment = () => {
    const { id } = useParams();
    const router = useRouter();
    const axios = useAxios();

    const { data: parcel, isLoading } = useQuery({
        queryKey: ['parcel', id],
        queryFn: async () => {
            const res = await axios.get(`/parcels/${id}`);
            return res.data;
        }
    });

    const handlePayment = async () => {
        const paymentData = {
            totalPrice :parcel.totalPrice,
            parcelId: parcel._id,
            senderEmail: parcel.senderEmail,
            parcelName: parcel.parcelName,
        };
        const res = await axios.post('/create-payment-intent', paymentData);
        console.log(res.data);
        window.location.href = res.data.url;
    }

    if (isLoading) {
        return <Loading/>
    }

    if (!parcel) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
                    <div className="text-6xl mb-4">❌</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Parcel Not Found</h2>
                    <p className="text-gray-600">The parcel you're looking for doesn't exist.</p>
                </div>
            </div>
        );
    }

    const finalAmount = parcel.discount === 'yes' ? Math.round(parcel.totalPrice * 0.9) : parcel.totalPrice;

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="mb-4 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                >
                    <FiArrowLeft className="w-5 h-5" />
                    <span>Back</span>
                </button>

                {/* Payment Card */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-[#03373d] to-[#1a5c64] px-6 py-5 text-center">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                            <FiCreditCard className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Payment Card</h2>
                        <p className="text-[#caeb66] text-sm mt-1">Complete your payment securely</p>
                    </div>

                    {/* Card Body */}
                    <div className="p-6">
                        {/* Sender Info */}
                        <div className="mb-6">
                            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                                <div className="w-10 h-10 bg-[#03373d]/10 rounded-full flex items-center justify-center">
                                    <FiUser className="w-5 h-5 text-[#03373d]" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Sender Name</p>
                                    <p className="font-semibold text-gray-800">{parcel.senderName}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                                <div className="w-10 h-10 bg-[#03373d]/10 rounded-full flex items-center justify-center">
                                    <FiMail className="w-5 h-5 text-[#03373d]" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Sender Email</p>
                                    <p className="font-semibold text-gray-800">{parcel.senderEmail}</p>
                                </div>
                            </div>
                        </div>

                        {/* Amount Section */}
                        <div className="mb-6 bg-gradient-to-r from-[#03373d] to-[#1a5c64] rounded-2xl p-5 text-center">
                            <p className="text-white/80 text-sm mb-1">Total Amount</p>
                            <div className="flex items-center justify-center gap-2">
                                <FiDollarSign className="text-[#caeb66] w-6 h-6" />
                                <span className="text-4xl font-bold text-white">৳{finalAmount}</span>
                            </div>
                            {parcel.discount === 'yes' && (
                                <p className="text-[#caeb66] text-xs mt-2">
                                    ✨ 10% discount applied
                                </p>
                            )}
                        </div>

                        {/* Parcel Info */}
                        <div className="mb-6 text-center">
                            <p className="text-xs text-gray-400">Parcel: {parcel.parcelName}</p>
                            <p className="text-xs text-gray-400">Weight: {parcel.parcelWeight} kg</p>
                        </div>

                        {/* Payment Button */}
                        {parcel.status === 'paid' ? (
                            <button
                                disabled
                                className="w-full bg-green-100 text-green-600 px-6 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 cursor-default"
                            >
                                <FiCheckCircle className="w-5 h-5" />
                                Already Paid
                            </button>
                        ) : (
                            <button
                                onClick={handlePayment}
                                className="w-full bg-gradient-to-r cursor-pointer from-[#03373d] to-[#1a5c64] text-white px-6 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3"
                            >
                                <FiCreditCard className="w-5 h-5" />
                                Pay Now ৳{finalAmount}
                            </button>
                        )}

                        {/* Secure Note */}
                        <div className="text-center mt-4">
                            <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                                <span className="inline-block w-1 h-1 bg-green-500 rounded-full"></span>
                                Secure payment powered by SSL Commerz
                            </p>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="text-center mt-6">
                    <p className="text-white/60 text-sm">
                        Need help? Contact support
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Payment;