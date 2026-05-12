"use client";

import { useEffect, useRef, useState } from "react";
import {
    FaCarSide,
    FaMoneyBillWave,
    FaWarehouse,
    FaBuilding,
    FaArrowRight,
    FaCheckCircle,
    FaRocket,
    FaShieldAlt,
    FaClock,
} from "react-icons/fa";
import { motion, useAnimation, useInView } from "framer-motion";

const HowZapwork = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const controls = useAnimation();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    useEffect(() => {
        if (isInView) {
            controls.start("visible");
        }
    }, [controls, isInView]);

    const items = [
        {
            icon: <FaCarSide size={35} />,
            title: "Booking Pick & Drop",
            text: "Easily book your parcel for pickup and drop-off at your preferred location.",
            gradient: "from-blue-500 to-cyan-500",
            stat: "500+ Daily Pickups",
            statIcon: <FaCheckCircle />,
            delay: 0.1,
        },
        {
            icon: <FaMoneyBillWave size={35} />,
            title: "Cash on Delivery",
            text: "Secure cash on delivery service for smooth and trusted transactions.",
            gradient: "from-green-500 to-emerald-500",
            stat: "100% Secure Payments",
            statIcon: <FaShieldAlt />,
            delay: 0.2,
        },
        {
            icon: <FaWarehouse size={35} />,
            title: "Delivery Hub",
            text: "Fast and reliable delivery through our nationwide hub network.",
            gradient: "from-purple-500 to-pink-500",
            stat: "24/7 Operations",
            statIcon: <FaClock />,
            delay: 0.3,
        },
        {
            icon: <FaBuilding size={35} />,
            title: "Booking SME & Corporate",
            text: "Special booking solutions for SME and corporate clients.",
            gradient: "from-orange-500 to-red-500",
            stat: "1000+ Corporate Clients",
            statIcon: <FaRocket />,
            delay: 0.4,
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12,
            },
        },
    };

    return (
        <section className="relative py-24 px-6 overflow-hidden ">
          
         

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-[#03373d]/20 rounded-full"
                        initial={{
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                        }}
                        animate={{
                            y: [null, -100, -200],
                            x: [null, Math.random() * 100 - 50],
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: Math.random() * 5 + 3,
                            repeat: Infinity,
                            delay: Math.random() * 5,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 max-w-7xl mx-auto" ref={ref}>
                {/* Heading Section with Animation */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={controls}
                    variants={{
                        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
                    }}
                    className="text-center mb-16"
                >
               

                    <h2 className="text-5xl md:text-6xl font-bold  text-[#03373d] mb-4">
                        How It Works
                    </h2>

                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100px" }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="h-1 bg-gradient-to-r from-[#03373d] to-cyan-400 mx-auto rounded-full"
                    ></motion.div>

                    <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                        Get your parcels delivered in 4 simple steps with our streamlined process
                    </p>
                </motion.div>

                {/* Cards Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={controls}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {items.map((item, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            whileHover={{
                                y: -10,
                                transition: { type: "spring", stiffness: 300 }
                            }}
                            onHoverStart={() => setHoveredIndex(index)}
                            onHoverEnd={() => setHoveredIndex(null)}
                            className="relative group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-[#caeb66] to-[#03373d] rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>

                            <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
                                {/* Gradient Top Bar */}
                                <div className={`h-1 bg-gradient-to-r ${item.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>

                                <div className="p-8">
                                    {/* Step Number */}
                                    <div className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-500">
                                        {index + 1}
                                    </div>

                                    {/* Icon Container with Animation */}
                                    <motion.div
                                        whileHover={{ rotate: 360, scale: 1.1 }}
                                        transition={{ duration: 0.5 }}
                                        className={`w-20 h-20 bg-gradient-to-r ${item.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                                    >
                                        <div className="text-white">
                                            {item.icon}
                                        </div>
                                    </motion.div>

                                    {/* Title */}
                                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-[#03373d] transition-colors">
                                        {item.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                        {item.text}
                                    </p>

                                    {/* Stat Badge */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={hoveredIndex === index ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                        transition={{ duration: 0.3 }}
                                        className="mt-4 pt-4 border-t border-gray-100"
                                    >
                                        <div className="flex items-center gap-2 text-xs font-semibold">
                                            <span className="text-green-500">{item.statIcon}</span>
                                            <span className="text-gray-600">{item.stat}</span>
                                        </div>
                                    </motion.div>

                                    {/* Learn More Link */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={hoveredIndex === index ? { opacity: 1 } : { opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="mt-4"
                                    >
                                        <button className="text-[#03373d] text-sm font-semibold flex items-center gap-1 group/link">
                                            Learn More
                                            <FaArrowRight className="text-xs group-hover/link:translate-x-1 transition-transform" />
                                        </button>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Additional Information Section */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={controls}
                    variants={{
                        visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.8 } },
                    }}
                    className="mt-20 bg-gradient-to-r from-[#03373d] to-[#1a5c64] rounded-3xl p-8 md:p-12 shadow-2xl"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="space-y-2">
                            <div className="text-4xl font-bold text-[#caeb66]">99.9%</div>
                            <div className="text-white font-semibold">Delivery Success Rate</div>
                            <p className="text-gray-300 text-sm">Across all deliveries nationwide</p>
                        </div>
                        <div className="space-y-2">
                            <div className="text-4xl font-bold text-[#caeb66]">24/7</div>
                            <div className="text-white font-semibold">Customer Support</div>
                            <p className="text-gray-300 text-sm">Real-time tracking & assistance</p>
                        </div>
                        <div className="space-y-2">
                            <div className="text-4xl font-bold text-[#caeb66]">50K+</div>
                            <div className="text-white font-semibold">Happy Customers</div>
                            <p className="text-gray-300 text-sm">Trusted by businesses & individuals</p>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div className="text-center mt-8">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-[#caeb66] text-[#03373d] px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center gap-2"
                        >
                            Start Your First Delivery <FaArrowRight />
                        </motion.button>
                    </div>
                </motion.div>

            </div>
        </section>
    );
};

export default HowZapwork;