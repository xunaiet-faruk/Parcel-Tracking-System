"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    FiPackage,
    FiTruck,
    FiDollarSign,
    FiBriefcase,
    FiMapPin,
    FiShield,
    FiTrendingUp,
    FiClock
} from 'react-icons/fi';

const Ourservices = () => {
    const services = [
        {
            icon: FiPackage,
            title: "Parcel Delivery",
            text: "Fast and secure parcel delivery across the country. We ensure your packages reach safely and on time.",
            subtext: "Reliable service for personal and business needs",
            color: "from-[#03373d] to-[#03555e]"
        },
        {
            icon: FiTruck,
            title: "Express Shipping",
            text: "Get your parcels delivered within the shortest possible time. Same-day and next-day delivery options available.",
            subtext: "Perfect for urgent shipments",
            color: "from-[#03373d] to-[#03555e]"
        },
        {
            icon: FiDollarSign,
            title: "Cash on Delivery",
            text: "Safe and trusted COD service for all deliveries. We collect payments securely from customers.",
            subtext: "Helps you grow your online business easily",
            color: "from-[#03373d] to-[#03555e]"
        },
        {
            icon: FiBriefcase,
            title: "Corporate Service",
            text: "Special logistics support for SME and corporate clients. Bulk parcel handling with priority delivery.",
            subtext: "Customized business solutions available",
            color: "from-[#03373d] to-[#03555e]"
        },
        {
            icon: FiMapPin,
            title: "Live Tracking",
            text: "Track your parcel in real-time with accurate updates. Stay informed from pickup to delivery.",
            subtext: "Easy and transparent tracking system",
            color: "from-[#03373d] to-[#03555e]"
        },
        {
            icon: FiShield,
            title: "Secure Handling",
            text: "We ensure maximum safety for every parcel. Proper packaging and careful handling guaranteed.",
            subtext: "Your items are always in safe hands",
            color: "from-[#03373d] to-[#03555e]"
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.5,
                type: "spring",
                stiffness: 100
            }
        }
    };

    return (
        <div className='relative py-20 my-10 mx-4 md:mx-8'>

            <div className='relative z-10 container mx-auto px-6'>
                {/* Header Section - Clean without background */}
                <div className='text-center mb-16'>
                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block px-4 py-1 rounded-full bg-[#caeb66]/20 text-[#03373d] text-sm font-bold uppercase tracking-wider mb-4">
                            What We Offer
                        </span>
                        <h1 className='text-4xl md:text-5xl font-bold text-[#03373d] mb-4'>
                            Our Premium Services
                        </h1>
                        <div className="w-24 h-1 bg-[#caeb66] mx-auto rounded-full mb-6" />
                        <p className='text-gray-600 max-w-2xl mx-auto text-lg'>
                            Enjoy fast, reliable parcel delivery with seamless tracking and on-time service.
                            <br /> We ensure safe handling and smooth logistics for all your delivery needs.
                        </p>
                    </motion.div>
                </div>

                {/* Services Grid with Animations */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {services.map((item, index) => (
                        <motion.div
                            key={index}
                            variants={cardVariants}
                            whileHover={{
                                y: -15,
                                scale: 1.02,
                                transition: { duration: 0.2 }
                            }}
                            className="group relative bg-white rounded-2xl p-8 border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                        >
                            {/* Icon Container with Animation */}
                            <motion.div
                                className="relative mb-6"
                                whileHover={{ rotate: 5 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-md`}>
                                    {React.createElement(item.icon, { className: "text-white text-2xl" })}
                                </div>
                                {/* Decorative dot */}
                                <div className="absolute -top-2 -right-2 w-3 h-3 bg-[#caeb66] rounded-full animate-pulse" />
                            </motion.div>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-[#03373d] mb-3 group-hover:text-[#caeb66] transition-colors duration-300">
                                {item.title}
                            </h3>

                            {/* Description */}
                            <p className="text-gray-500 text-sm leading-relaxed mb-3">
                                {item.text}
                            </p>

                            {/* Subtext */}
                            <p className="text-[#caeb66] text-xs font-medium">
                                {item.subtext}
                            </p>

                            {/* Hover Arrow Animation */}
                            <motion.div
                                className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100"
                                initial={{ x: -10, opacity: 0 }}
                                whileHover={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="w-8 h-8 rounded-full bg-[#caeb66]/20 flex items-center justify-center group-hover:bg-[#caeb66]/40 transition-all">
                                    <svg className="w-4 h-4 text-[#03373d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Bottom CTA with Animation */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mt-16"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-3 bg-gradient-to-r from-[#03373d] to-[#03555e] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                        View All Services
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
};

export default Ourservices;