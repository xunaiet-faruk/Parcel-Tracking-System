"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiSearch,
    FiTruck,
    FiShield,
    FiNavigation,
    FiClock,
    FiMapPin,
    FiPackage,
    FiGlobe,
    FiTrendingUp,
    FiAward,
    FiCreditCard
} from "react-icons/fi";
import Swal from "sweetalert2";

const slides = [
    {
        id: 1,
        title: "Safe & Secure Parcel Management",
        subtitle: "Bank-grade security protocols and blockchain-verified handovers for your valuable goods.",
        image: "https:
        tag: "High Security",
        stats: "99.97% Safe Rate",
        icon: FiShield
    },
    {
        id: 2,
        title: "Worldwide Parcel Tracking System",
        subtitle: "End-to-end visibility with real-time updates across every stage of delivery.",
        image: "https:
        tag: "Global Network",
        stats: "24/7 Tracking",
        icon: FiGlobe
    },
    {
        id: 3,
        title: "Safe & Secure Parcel Handling",
        subtitle: "Your package is protected with advanced security and real-time monitoring.",
        image: "https:
        tag: "Trusted",
        stats: "100% Secure",
        icon: FiShield
    },
    {
        id: 4,
        title: "Secure Online Payment System",
        subtitle: "Pay via bKash, Nagad, Rocket, Credit Card. 100% encrypted and fraud-protected transactions.",
        image: "https:
        tag: "Secure Payment",
        stats: "SSL Secured",
        icon: FiCreditCard
    }
];

const Hero = () => {
    const [current, setCurrent] = useState(0);
    const [trackingId, setTrackingId] = useState("");

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const handleTrack = () => {
        if (trackingId.trim()) {
                     Swal.fire({
                    title: `Tracking ID: ${trackingId} - Demo tracking initiated.`,
                            icon: "success",
                            draggable: true
                        });
        } else {
            alert("Please enter a tracking ID.");
        }
    };

    return (
        <section className="relative py-20 flex items-center overflow-hidden">


            <div className="absolute top-20 right-10 w-72 h-72 bg-[#caeb66]/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none" />

            <div className="container mx-auto px-6 lg:px-3 grid lg:grid-cols-2 gap-12 items-center relative z-10">


                <div className="relative h-[500px] flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current}
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 30 }}
                            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                            className="space-y-6"
                        >

                            <div className="flex items-center gap-3">
                                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#03373d]/5 text-[#03373d] text-sm font-bold uppercase tracking-wider border border-[#03373d]/10">
                                    {React.createElement(slides[current].icon, { className: "w-4 h-4" })}
                                    {slides[current].tag}
                                </span>
                                <span className="text-xs font-mono bg-[#caeb66]/20 text-[#03373d] px-3 py-1 rounded-full font-bold">
                                    {slides[current].stats}
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-6xl lg:text-5xl xl:text-6xl font-black text-[#03373d] leading-tight">
                                {slides[current].title.split(" ").map((word, i) =>
                                    word === "Tracking" || word === "Management" || word === "Delivery" || word === "Payment" ?
                                        <span key={i} className="text-[#caeb66]" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>{word} </span> :
                                        word + " "
                                )}
                            </h1>

                            <p className="text-lg text-gray-600 max-w-md leading-relaxed">
                                {slides[current].subtitle}
                            </p>


                            {current === 0 ? (
                                <div className="pt-4">
                                    <div className="group bg-white shadow-2xl shadow-[#03373d]/15 rounded-2xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-[#03373d]/25 hover:scale-[1.01] max-w-xl">
                                        <div className="flex flex-col sm:flex-row items-center p-1 gap-2">
                                            <div className="flex items-center flex-1 px-5 w-full">
                                                <FiSearch className="text-[#03373d] mr-3 transition-colors group-hover:text-[#caeb66]" size={22} />
                                                <input
                                                    type="text"
                                                    value={trackingId}
                                                    onChange={(e) => setTrackingId(e.target.value)}
                                                    placeholder="Enter Tracking ID (e.g., PKG-12345)"
                                                    className="w-full py-4 bg-transparent outline-none text-gray-700 font-medium placeholder:text-gray-400"
                                                    onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
                                                />
                                            </div>
                                            <button
                                                onClick={handleTrack}
                                                className="w-full sm:w-auto bg-gradient-to-r from-[#03373d] to-[#03555e] hover:from-[#022c31] hover:to-[#03454d] text-white px-10 py-3.5 rounded-xl font-bold transition-all transform active:scale-95 shadow-lg shadow-[#03373d]/20"
                                            >
                                                Track Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="pt-4">
                                    <button className="bg-gradient-to-r from-[#03373d] to-[#03555e] hover:from-[#022c31] hover:to-[#03454d] text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-xl shadow-[#03373d]/20 inline-flex items-center gap-2">
                                        {current === 1 && <FiShield className="text-[#caeb66]" size={20} />}
                                        {current === 2 && <FiTruck className="text-[#caeb66]" size={20} />}
                                        {current === 3 && <FiCreditCard className="text-[#caeb66]" size={20} />}
                                        {current === 1 && "Learn About Security"}
                                        {current === 2 && "Express Delivery"}
                                        {current === 3 && "Make Payment"}
                                    </button>
                                </div>
                            )}


                            <div className="flex flex-wrap gap-6 pt-6">
                                <div className="flex items-center gap-2.5 text-sm font-bold text-gray-600 group cursor-default">
                                    <div className="p-1.5 bg-[#03373d]/10 rounded-full group-hover:bg-[#03373d]/20 transition-colors">
                                        <FiShield className="text-[#03373d]" size={16} />
                                    </div>
                                    Bank-grade Secure
                                </div>
                                <div className="flex items-center gap-2.5 text-sm font-bold text-gray-600 group cursor-default">
                                    <div className="p-1.5 bg-[#03373d]/10 rounded-full group-hover:bg-[#03373d]/20 transition-colors">
                                        <FiClock className="text-[#03373d]" size={16} />
                                    </div>
                                    24/7 Live Support
                                </div>
                                <div className="flex items-center gap-2.5 text-sm font-bold text-gray-600 group cursor-default">
                                    <div className="p-1.5 bg-[#03373d]/10 rounded-full group-hover:bg-[#03373d]/20 transition-colors">
                                        <FiNavigation className="text-[#03373d]" size={16} />
                                    </div>
                                    Live Satellite Map
                                </div>
                                <div className="flex items-center gap-2.5 text-sm font-bold text-gray-600 group cursor-default">
                                    <div className="p-1.5 bg-[#03373d]/10 rounded-full group-hover:bg-[#03373d]/20 transition-colors">
                                        <FiCreditCard className="text-[#03373d]" size={16} />
                                    </div>
                                    Secure Payment
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>


                    <div className="flex gap-3 mt-12">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                className="group relative"
                            >
                                <div className={`h-2 transition-all duration-500 rounded-full ${current === i ? "w-10 bg-[#caeb66]" : "w-2 bg-gray-300 group-hover:bg-gray-400"}`} />
                                {current === i && (
                                    <motion.div
                                        className="absolute -top-6 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-6 border-transparent border-b-[#caeb66]"
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>


                <div className="relative flex justify-center items-center perspective-1000">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current}
                            initial={{ opacity: 0, rotateY: 15, x: 50 }}
                            animate={{ opacity: 1, rotateY: 0, x: 0 }}
                            exit={{ opacity: 0, rotateY: -15, x: -50 }}
                            transition={{ duration: 0.6, type: "spring", damping: 20 }}
                            className="relative preserve-3d"
                        >

                            <div className="absolute -inset-6 bg-gradient-to-r from-[#caeb66]/30 via-[#03373d]/20 to-[#caeb66]/30 rounded-[2rem] blur-xl opacity-60" />


                            <div className="relative w-full max-w-[550px] aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-[1.02]">
                                <img
                                    src={slides[current].image}
                                    alt="Parcel Management Logistics"
                                    className="w-full h-full object-cover"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-[#03373d]/60 via-[#03373d]/10 to-transparent"></div>


                                <div className="absolute top-4 left-4 w-20 h-20 border-t-3 border-l-3 border-white/30 rounded-tl-2xl"
                                    style={{ borderTopWidth: '3px', borderLeftWidth: '3px' }} />
                                <div className="absolute bottom-4 right-4 w-20 h-20 border-b-3 border-r-3 border-white/30 rounded-br-2xl"
                                    style={{ borderBottomWidth: '3px', borderRightWidth: '3px' }} />
                            </div>


                            <motion.div
                                animate={{ y: [0, -12, 0], rotate: [0, 2, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -bottom-5 -left-5 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 flex items-center gap-4 z-20"
                            >
                                <div className="bg-gradient-to-br from-[#caeb66] to-[#a8d543] p-2.5 rounded-full shadow-lg">
                                    {current === 0 && <FiGlobe className="text-[#03373d]" size={20} />}
                                    {current === 1 && <FiShield className="text-[#03373d]" size={20} />}
                                    {current === 2 && <FiTruck className="text-[#03373d]" size={20} />}
                                    {current === 3 && <FiCreditCard className="text-[#03373d]" size={20} />}
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">
                                        {current === 0 && "Global Coverage"}
                                        {current === 1 && "Security Status"}
                                        {current === 2 && "Delivery Status"}
                                        {current === 3 && "Payment Status"}
                                    </p>
                                    <p className="text-sm font-black text-[#03373d] flex items-center gap-1">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                        </span>
                                        {current === 0 && "190+ Countries Active"}
                                        {current === 1 && "256-bit Encryption"}
                                        {current === 2 && "In Transit: Dhaka Hub"}
                                        {current === 3 && "SSL Secured"}
                                    </p>
                                </div>
                            </motion.div>


                            <motion.div
                                animate={{ x: [0, 8, 0], y: [0, -5, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute -top-5 -right-5 bg-[#03373d] text-white p-3 rounded-2xl shadow-xl flex items-center gap-2 z-20"
                            >
                                {current === 3 ? <FiCreditCard className="text-[#caeb66]" size={18} /> : <FiAward className="text-[#caeb66]" size={18} />}
                                <div>
                                    <p className="text-[10px] font-bold uppercase opacity-80">
                                        {current === 3 ? "Payment Methods" : "Est. Delivery"}
                                    </p>
                                    <p className="text-xs font-black">
                                        {current === 3 ? "bKash • Nagad • Rocket" : "Tomorrow, Before 2PM"}
                                    </p>
                                </div>
                            </motion.div>


                            {current === 3 && (
                                <motion.div
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                    className="absolute top-1/2 -right-4 -translate-y-1/2 bg-white rounded-xl shadow-lg p-3 z-20 hidden lg:block"
                                >
                                    <div className="flex flex-col items-center gap-1">
                                        <FiShield className="text-[#caeb66]" size={24} />
                                        <span className="text-[10px] font-bold text-[#03373d]">100% Safe</span>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

            </div>


            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
                <svg className="relative block w-full h-[50px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C64.89,107.52,158.9,116.77,321.39,56.44Z"
                        className="fill-white/80"></path>
                </svg>
            </div>
        </section>
    );
};

export default Hero;