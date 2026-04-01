"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const Satisfaction = () => {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: false, amount: 0.3 });

    // Statistics data
    const stats = [
        { number: "99.9%", label: "Delivery Success Rate", icon: "📦" },
        { number: "50K+", label: "Happy Customers", icon: "😊" },
        { number: "24/7", label: "Customer Support", icon: "🎧" },
        { number: "15min", label: "Average Response", icon: "⚡" }
    ];

    return (
        <div className="relative overflow-hidden rounded-xl">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-fixed"
                style={{
                    backgroundImage: "url('/assets/be-a-merchant-bg.png')",
                    backgroundBlendMode: "overlay"
                }}
            />

            {/* Dark Overlay with Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#03373d] via-[#03373d]/95 to-[#022a2f]" />

            {/* Content */}
            <motion.div
                ref={sectionRef}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 py-24 md:py-12 px-4"
            >
                <div className="max-w-7xl mx-auto">
                    {/* Top Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="flex justify-center mb-6"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                            <span className="text-yellow-400 text-lg">⭐</span>
                            <span className="text-white text-sm font-medium">Trusted by 50,000+ Customers</span>
                        </div>
                    </motion.div>

                  <div className="flex justify-between">
                    <div>
                            {/* Main Heading */}
                            <motion.h2
                                initial={{ opacity: 0, y: 30 }}
                                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white  mb-6"
                            >
                                Your Satisfaction is
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                                    Our Top Priority
                                </span>
                            </motion.h2>

                            {/* Description */}
                            <motion.p
                                initial={{ opacity: 0, y: 30 }}
                                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                                className="text-gray-200  max-w-2xl mx-auto mb-12 text-lg leading-relaxed"
                            >
                                We're committed to providing exceptional service and ensuring
                                every delivery exceeds your expectations. Experience peace of mind
                                with our reliable and trusted delivery solutions.
                            </motion.p>



                            {/* CTA Button */}
                            <button className="cursor-pointer px-8 py-4 border border-[#caeb66] text-[#caeb66] rounded-lg mr-5 text-lg shadow-lg">Became a Merchant</button>
                            <button className="cursor-pointer px-8 py-4 border bg-[#caeb66] text-black  rounded-lg text-lg shadow-lg">Earn With Profast Courier</button>
                    </div>
                    <div>
                        <img className="w-full " src="/assets/location-merchant.png" alt="Location of Merchant" />
                    </div>
                  </div>

                  
                </div>
            </motion.div>

           
        </div>
    );
};

export default Satisfaction;