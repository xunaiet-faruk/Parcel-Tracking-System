
"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const PaymentCancel = () => {
    const router = useRouter();
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowContent(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center ">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
                className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md mx-4"
            >
                {/* Animated Cancel Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                        duration: 0.5,
                        type: "spring",
                        stiffness: 200,
                        delay: 0.2
                    }}
                    className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                    <motion.svg
                        initial={{ rotate: 0 }}
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="w-10 h-10 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <motion.path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.4, delay: 0.5 }}
                        />
                    </motion.svg>
                </motion.div>

                {/* Text Content with Fade In */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        Payment Cancelled
                    </h1>
                    <p className="text-gray-600 mb-2">
                        Your payment was cancelled.
                    </p>
                    <p className="text-sm text-gray-500 mb-6">
                        No charges have been made to your account.
                    </p>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="space-y-3"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.back()}
                        className="w-full bg-gradient-to-r from-[#03373d] to-[#1a5c64] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        Try Again
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.push('/dashboard/myparcels')}
                        className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
                    >
                        View My Parcels
                    </motion.button>
                </motion.div>

                {/* Help Text */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="mt-6 pt-4 border-t border-gray-100"
                >
                    <p className="text-xs text-gray-400">
                        Need help?{' '}
                        <button
                            onClick={() => router.push('/dashboard/myparcels')}
                            className="text-[#03373d] hover:underline"
                        >
                            Contact Support
                        </button>
                    </p>
                </motion.div>

                {/* Loading Spinner while animating */}
                {!showContent && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white rounded-2xl">
                        <div className="w-8 h-8 border-3 border-[#03373d] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default PaymentCancel;