"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const Benefits = () => {
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: false, amount: 0.2 });

    const data = [
        {
            img: "/assets/live-tracking.png",
            title: "Live Parcel Tracking",
            desc: "Track your parcel in real time with accurate updates anytime, anywhere Get instant notifications so you always know where your delivery is.",
            gradient: "from-blue-50 to-cyan-50",
            iconBg: "bg-blue-100"
        },
        {
            img: "/assets/safe-delivery.png",
            title: "100% Safe Delivery",
            desc: "We ensure secure handling and safe delivery of all your parcels.Your packages are protected with careful handling at every step all your parcels.",
            gradient: "from-green-50 to-emerald-50",
            iconBg: "bg-green-100"
        },
        {
            img: "/assets/location-merchant.png",
            title: "Location of Merchants",
            desc: "Find the nearest merchants and their locations with our easy-to-use map.Quickly discover delivery points and nearby service partners.",
            gradient: "from-purple-50 to-pink-50",
            iconBg: "bg-purple-100"
        },
        {
            img: "/assets/safe-delivery.png",
            title: "Call Center Support",
            desc: "24/7 customer support ready to assist you with any delivery issues.Our team is always available to solve your problems instantly any delivery issues.",
            gradient: "from-orange-50 to-red-50",
            iconBg: "bg-orange-100"
        },
    ];

    
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
                delayChildren: 0.2,
            }
        }
    };

    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 80,
            scale: 0.95
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
                duration: 0.6
            }
        }
    };

    const imageVariants = {
        hidden: {
            opacity: 0,
            x: -50,
            rotate: -10
        },
        visible: {
            opacity: 1,
            x: 0,
            rotate: 0,
            transition: {
                type: "spring",
                stiffness: 120,
                damping: 12,
                delay: 0.2
            }
        }
    };

    const contentVariants = {
        hidden: {
            opacity: 0,
            x: 50
        },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12,
                delay: 0.3
            }
        }
    };

    const lineVariants = {
        hidden: {
            scaleY: 0,
            opacity: 0
        },
        visible: {
            scaleY: 1,
            opacity: 1,
            transition: {
                duration: 0.5,
                delay: 0.25,
                ease: "easeOut"
            }
        }
    };

    return (
        <div className="py-20 px-4 md:px-8 lg:px-16  overflow-hidden">
           
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
            >
               
                <h2 className="text-4xl md:text-5xl font-bold text-[#03373d] mb-4">
                    Amazing Benefits
                    <motion.span
                        initial={{ width: 0 }}
                        animate={{ width: "80px" }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="block h-1 bg-gradient-to-r from-[#03373d] to-cyan-400 mx-auto mt-4 rounded-full"
                    />
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    Experience the future of delivery with our cutting-edge features
                </p>
            </motion.div>

           
            <motion.div
                ref={containerRef}
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="space-y-8 w-full mx-auto"
            >
                {data.map((item, index) => (
                    <motion.div
                        key={index}
                        variants={cardVariants}
                        whileHover={{
                            scale: 1.02,
                            transition: { duration: 0.2 }
                        }}
                        className={`
                            bg-white rounded-2xl shadow-xl overflow-hidden
                            hover:shadow-2xl transition-all duration-500
                            bg-gradient-to-r ${item.gradient}
                            border border-gray-100
                        `}
                        style={{
                            boxShadow: "0 20px 40px -12px rgba(0,0,0,0.1)"
                        }}
                    >
                        <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-12">
                            {/* Left Image with Animation */}
                            <motion.div
                                variants={imageVariants}
                                className="relative group"
                                whileHover={{ scale: 1.05, rotate: 5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className={`
                                    absolute inset-0 rounded-full blur-2xl opacity-30 
                                    ${item.iconBg} group-hover:opacity-50 transition-opacity
                                `} />
                                <img
                                    src={item.img}
                                    alt={item.title}
                                    className="h-44 w-44 md:h-52 md:w-52 object-contain relative z-10
                                    drop-shadow-lg group-hover:drop-shadow-2xl transition-all duration-300"
                                />
                               
                            </motion.div>

                            {/* Animated Dotted Line */}
                            <motion.div
                                variants={lineVariants}
                                className="hidden md:block h-44 md:h-52 border-l-4 border-dotted border-[#03373d] border-opacity-30"
                            />

                            {/* Right Content with Animation */}
                            <motion.div
                                variants={contentVariants}
                                className="flex-1 text-center md:text-left"
                            >
                                <motion.h2
                                    className="text-2xl md:text-3xl font-bold text-[#03373d] mb-3"
                                    whileHover={{ x: 10 }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                >
                                    {item.title}
                                    <motion.span
                                        initial={{ width: 0 }}
                                        whileInView={{ width: "50px" }}
                                        transition={{ delay: 0.6, duration: 0.5 }}
                                        className="block h-0.5 bg-gradient-to-r from-[#03373d] to-cyan-400 mt-2 rounded-full"
                                    />
                                </motion.h2>

                                <motion.p
                                    className="text-gray-600 text-base md:text-lg leading-relaxed"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    {item.desc}
                                </motion.p>

                                {/* Interactive Read More Button */}
                                <motion.button
                                    whileHover={{ x: 10, scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="mt-4 text-[#03373d] font-semibold text-sm flex items-center gap-2 
                                    group-hover:gap-3 transition-all"
                                >
                                    Learn More
                                    <motion.span
                                        animate={{ x: [0, 5, 0] }}
                                        transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 2 }}
                                    >
                                        →
                                    </motion.span>
                                </motion.button>
                            </motion.div>
                        </div>

                        {/* Animated Progress Bar on Hover */}
                        <motion.div
                            initial={{ scaleX: 0 }}
                            whileHover={{ scaleX: 1 }}
                            transition={{ duration: 0.3 }}
                            className="h-1 bg-gradient-to-r from-[#03373d] to-cyan-400 origin-left"
                        />
                    </motion.div>
                ))}
            </motion.div>

            {/* Floating Animation Decoration */}

           
        </div>
    );
};

export default Benefits;