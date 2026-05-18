"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
    FiStar,
    FiChevronLeft,
    FiChevronRight,
    FiMapPin,
    FiCheckCircle,
    FiMessageCircle
} from "react-icons/fi";

const CustomerFeedback = () => {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: false, amount: 0.2 });
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const feedbacks = [
        {
            id: 1,
            name: "Md. Rahim Uddin",
            location: "Dhaka, Bangladesh",
            rating: 5,
            feedback: "Excellent delivery service! My parcel arrived before the estimated time. The live tracking feature is very accurate. Highly recommended for anyone looking for reliable courier service in Bangladesh.",
            image: "https:
            date: "2 days ago",
            orders: "45+",
            verified: true
        },
        {
            id: 2,
            name: "Fatema Begum",
            location: "Chittagong, Bangladesh",
            rating: 5,
            feedback: "Very professional and careful handling of my packages. The customer support team is very helpful and responsive. I've been using their service for 6 months and never had any issue.",
            image: "https:
            date: "5 days ago",
            orders: "28+",
            verified: true
        },
        {
            id: 3,
            name: "Kamal Hossain",
            location: "Sylhet, Bangladesh",
            rating: 4,
            feedback: "Good service overall. Delivery was on time and package was in perfect condition. The merchant location feature helped me find the nearest pickup point easily.",
            image: "https:
            date: "1 week ago",
            orders: "12+",
            verified: true
        },
        {
            id: 4,
            name: "Nasrin Akter",
            location: "Rajshahi, Bangladesh",
            rating: 5,
            feedback: "Best courier service in town! Very affordable prices and fast delivery. The 24/7 call center support is amazing. They solved my query within minutes.",
            image: "https:
            date: "2 weeks ago",
            orders: "52+",
            verified: true
        },
        {
            id: 5,
            name: "Shahidul Islam",
            location: "Khulna, Bangladesh",
            rating: 5,
            feedback: "I'm very impressed with their safe delivery guarantee. All my important documents reached safely. The real-time notification system keeps me updated about my parcel.",
            image: "https:
            date: "3 weeks ago",
            orders: "19+",
            verified: true
        }
    ];

    const nextSlide = () => {
        setDirection(1);
        setActiveIndex((prev) => (prev + 1) % feedbacks.length);
    };

    const prevSlide = () => {
        setDirection(-1);
        setActiveIndex((prev) => (prev - 1 + feedbacks.length) % feedbacks.length);
    };


    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    const carouselVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
            scale: 0.9
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 25
            }
        },
        exit: (direction) => ({
            x: direction > 0 ? -300 : 300,
            opacity: 0,
            scale: 0.9,
            transition: { duration: 0.4 }
        })
    };

    return (
        <div className="relative overflow-hidden py-20 px-4">


            <div className="absolute top-20 left-10 w-64 h-64 bg-[#caeb66]/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#03373d]/5 rounded-full blur-3xl animate-pulse delay-1000" />


            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#caeb66]/5 text-[200px] font-bold select-none pointer-events-none">
                ❝ ❞
            </div>

            <div className="max-w-7xl mx-auto relative z-10">


                <motion.div
                    ref={sectionRef}
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="text-center mb-12"
                >
                    <motion.div variants={itemVariants} className="inline-block">
                        <span className="px-4 py-1 rounded-full bg-[#caeb66]/20 text-[#03373d] text-sm font-bold uppercase tracking-wider">
                            Testimonials
                        </span>
                    </motion.div>

                    <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-[#03373d] mt-4 mb-4">
                        What Our Customers Say
                        <motion.span
                            initial={{ width: 0 }}
                            animate={isInView ? { width: "80px" } : { width: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="block h-1 bg-gradient-to-r from-[#caeb66] to-[#03373d] mx-auto mt-4 rounded-full"
                        />
                    </motion.h2>

                    <motion.p variants={itemVariants} className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Trusted by thousands of customers across Bangladesh
                    </motion.p>
                </motion.div>


                <div className="relative">
                    <div className="overflow-hidden px-4 md:px-12">
                        <AnimatePresence mode="wait" custom={direction}>
                            <motion.div
                                key={activeIndex}
                                custom={direction}
                                variants={carouselVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                className="flex justify-center"
                            >
                                <div className="w-full max-w-4xl">
                                    <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100 relative">


                                        <div className="absolute top-6 right-6 text-[#caeb66]/20">
                                            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                            </svg>
                                        </div>

                                        <div className="flex flex-col lg:flex-row gap-8 items-center">

                                            <div className="text-center lg:w-1/3">
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ type: "spring", delay: 0.2 }}
                                                    className="relative inline-block"
                                                >
                                                    <img
                                                        src={feedbacks[activeIndex].image}
                                                        alt={feedbacks[activeIndex].name}
                                                        className="w-28 h-28 rounded-full object-cover border-4 border-[#caeb66] shadow-lg"
                                                    />
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ delay: 0.3 }}
                                                        className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1.5"
                                                    >
                                                        <FiCheckCircle className="text-white text-xs" />
                                                    </motion.div>
                                                </motion.div>

                                                <motion.h3
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.3 }}
                                                    className="font-bold text-[#03373d] text-xl mt-4"
                                                >
                                                    {feedbacks[activeIndex].name}
                                                </motion.h3>

                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.35 }}
                                                    className="flex items-center justify-center gap-1 mt-1"
                                                >
                                                    <FiMapPin className="text-gray-400 text-sm" />
                                                    <span className="text-gray-500 text-sm">{feedbacks[activeIndex].location}</span>
                                                </motion.div>

                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: 0.4, type: "spring" }}
                                                    className="flex justify-center gap-1 mt-3"
                                                >
                                                    {[...Array(5)].map((_, i) => (
                                                        <FiStar
                                                            key={i}
                                                            className={`${i < feedbacks[activeIndex].rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} text-lg`}
                                                        />
                                                    ))}
                                                </motion.div>

                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.45 }}
                                                    className="mt-4 flex justify-center gap-3 flex-wrap"
                                                >
                                                    <div className="bg-[#caeb66]/10 px-3 py-1 rounded-full">
                                                        <span className="text-xs text-[#03373d] font-semibold">
                                                            📦 {feedbacks[activeIndex].orders} Orders
                                                        </span>
                                                    </div>
                                                    {feedbacks[activeIndex].verified && (
                                                        <div className="bg-green-100 px-3 py-1 rounded-full">
                                                            <span className="text-xs text-green-600 font-semibold">
                                                                ✓ Verified
                                                            </span>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            </div>


                                            <div className="lg:w-2/3 text-center lg:text-left">
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.5 }}
                                                    className="relative"
                                                >
                                                    <FiMessageCircle className="absolute -top-2 -left-2 text-[#caeb66]/30 w-6 h-6" />
                                                    <p className="text-gray-600 leading-relaxed text-lg italic px-4 lg:px-0">
                                                        "{feedbacks[activeIndex].feedback}"
                                                    </p>
                                                </motion.div>

                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.6 }}
                                                    className="flex flex-wrap justify-center lg:justify-start gap-4 mt-6 pt-4 border-t border-gray-100"
                                                >
                                                    <div className="flex items-center gap-2 text-[#03373d] text-sm">
                                                        <span>✓</span>
                                                        <span>Verified Purchase</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                                                        <span>🕒</span>
                                                        <span>{feedbacks[activeIndex].date}</span>
                                                    </div>
                                                </motion.div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>


                    <motion.button
                        onClick={prevSlide}
                        whileHover={{ scale: 1.1, x: -3 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white border-2 border-[#caeb66] rounded-full p-3 shadow-lg hover:shadow-xl transition-all z-10 hidden md:block"
                    >
                        <FiChevronLeft className="text-[#caeb66] text-xl" />
                    </motion.button>

                    <motion.button
                        onClick={nextSlide}
                        whileHover={{ scale: 1.1, x: 3 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#caeb66] to-[#b8d84a] rounded-full p-3 shadow-lg hover:shadow-xl transition-all z-10 hidden md:block"
                    >
                        <FiChevronRight className="text-white text-xl" />
                    </motion.button>
                </div>


                <div className="flex justify-center gap-3 mt-8">
                    {feedbacks.map((_, idx) => (
                        <motion.button
                            key={idx}
                            onClick={() => {
                                setDirection(idx > activeIndex ? 1 : -1);
                                setActiveIndex(idx);
                            }}
                            whileHover={{ scale: 1.3 }}
                            whileTap={{ scale: 0.9 }}
                            className={`h-2 rounded-full transition-all duration-300 ${activeIndex === idx
                                    ? "w-10 bg-gradient-to-r from-[#caeb66] to-[#03373d]"
                                    : "w-2 bg-gray-300 hover:bg-gray-400"
                                }`}
                        />
                    ))}
                </div>


                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="flex justify-center mt-10"
                >
                    <div className="bg-white rounded-full px-6 py-2 shadow-lg border border-gray-100 flex items-center gap-4 flex-wrap justify-center">
                        <span className="text-green-500 text-sm">✓ 100% Authentic Reviews</span>
                        <div className="w-px h-4 bg-gray-200 hidden sm:block" />
                        <span className="text-[#03373d] text-sm">⭐ 4.8/5 from 1,234+ reviews</span>
                        <div className="w-px h-4 bg-gray-200 hidden sm:block" />
                        <span className="text-[#caeb66] text-sm">🚚 Trusted Courier Partner</span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default CustomerFeedback;