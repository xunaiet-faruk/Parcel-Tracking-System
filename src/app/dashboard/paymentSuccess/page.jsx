"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import useAxios from '@/app/(site)/hooks/useAxios';

// Animation variants for better organization
const fadeInUp = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 }
};

const scaleIn = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 }
};

const PaymentSuccess = () => {
    const router = useRouter();
    const axios = useAxios();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');

    const [isLoading, setIsLoading] = useState(true);
    const [paymentInfo, setPaymentInfo] = useState({
        transactionId: '',
        trackingId: ''
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        const verifyPayment = async () => {
            if (!sessionId) {
                setError('No session ID found');
                setIsLoading(false);
                return;
            }

            try {
                const response = await axios.patch('/paymentSuccess', { sessionId });
                setPaymentInfo({
                    transactionId: response.data.transactionId || '',
                    trackingId: response.data.trackingId || ''
                });
            } catch (err) {
                console.error('Payment verification failed:', err);
                setError('Failed to verify payment. Please contact support.');
            } finally {
               
                setTimeout(() => setIsLoading(false), 500);
            }
        };

        verifyPayment();
    }, [sessionId, axios]);

    const handleViewParcels = () => {
        router.push('/dashboard/myparcels');
    };

    const handleRetry = () => {
        window.location.reload();
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <motion.div
                    variants={scaleIn}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="bg-white p-8 rounded-2xl shadow-xl text-center"
                >
                    <div className="w-16 h-16 border-4 border-[#03373d] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Verifying your payment...</p>
                </motion.div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <motion.div
                    variants={scaleIn}
                    initial="initial"
                    animate="animate"
                    className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md mx-4"
                >
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification Failed</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={handleRetry}
                        className="bg-gradient-to-r from-[#03373d] to-[#1a5c64] text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        Try Again
                    </button>
                </motion.div>
            </div>
        );
    }

    // Success state
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <AnimatePresence mode="wait">
                <motion.div
                    key="success"
                    variants={scaleIn}
                    initial="initial"
                    animate="animate"
                    transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                    className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md mx-4"
                >
                    {/* Animated Checkmark */}
                    <motion.div
                        variants={fadeInUp}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: 0.2 }}
                        className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                    >
                        <motion.svg
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 200,
                                damping: 20,
                                delay: 0.3
                            }}
                            className="w-10 h-10 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <motion.path
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                            />
                        </motion.svg>
                    </motion.div>

                    {/* Success Message */}
                    <motion.div
                        variants={fadeInUp}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: 0.4 }}
                    >
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            Payment Successful! 🎉
                        </h1>
                        <p className="text-gray-600 mb-6">
                            Your payment has been completed successfully.
                        </p>
                    </motion.div>

                    {/* Payment Details Card */}
                    <motion.div
                        variants={fadeInUp}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: 0.5 }}
                        className="bg-gray-50 rounded-xl p-4 mb-6 text-left"
                    >
                        {paymentInfo.transactionId && (
                            <div className="mb-3">
                                <label className="text-xs text-gray-500 uppercase font-semibold">Transaction ID</label>
                                <p className="text-gray-800 font-mono text-sm mt-1 break-all">
                                    {paymentInfo.transactionId}
                                </p>
                            </div>
                        )}
                        {paymentInfo.trackingId && (
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-semibold">Tracking ID</label>
                                <p className="text-gray-800 font-mono text-sm mt-1 break-all">
                                    {paymentInfo.trackingId}
                                </p>
                            </div>
                        )}
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        variants={fadeInUp}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: 0.6 }}
                        className="space-y-3"
                    >
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleViewParcels}
                            className="w-full bg-gradient-to-r from-[#03373d] to-[#1a5c64] text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            View My Parcels
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => router.push('/')}
                            className="w-full bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
                        >
                            Back to Home
                        </motion.button>
                    </motion.div>

                    {/* Confirmation Message */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mt-4 text-xs text-gray-400"
                    >
                        A confirmation email has been sent to your registered email
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default PaymentSuccess;