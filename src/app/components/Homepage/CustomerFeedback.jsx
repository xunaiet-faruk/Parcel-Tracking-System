"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const CustomerFeedback = () => {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: false, amount: 0.2 });
    const [activeIndex, setActiveIndex] = useState(0);

    const feedbacks = [
        {
            id: 1,
            name: "Md. Rahim Uddin",
            location: "Dhaka, Bangladesh",
            rating: 5,
            feedback: "Excellent delivery service! My parcel arrived before the estimated time. The live tracking feature is very accurate. Highly recommended for anyone looking for reliable courier service in Bangladesh.",
            image: "https://randomuser.me/api/portraits/men/1.jpg",
            date: "2 days ago"
        },
        {
            id: 2,
            name: "Fatema Begum",
            location: "Chittagong, Bangladesh",
            rating: 5,
            feedback: "Very professional and careful handling of my packages. The customer support team is very helpful and responsive. I've been using their service for 6 months and never had any issue.",
            image: "https://randomuser.me/api/portraits/women/2.jpg",
            date: "5 days ago"
        },
        {
            id: 3,
            name: "Kamal Hossain",
            location: "Sylhet, Bangladesh",
            rating: 4,
            feedback: "Good service overall. Delivery was on time and package was in perfect condition. The merchant location feature helped me find the nearest pickup point easily.",
            image: "https://randomuser.me/api/portraits/men/3.jpg",
            date: "1 week ago"
        },
        {
            id: 4,
            name: "Nasrin Akter",
            location: "Rajshahi, Bangladesh",
            rating: 5,
            feedback: "Best courier service in town! Very affordable prices and fast delivery. The 24/7 call center support is amazing. They solved my query within minutes.",
            image: "https://randomuser.me/api/portraits/women/4.jpg",
            date: "2 weeks ago"
        },
        {
            id: 5,
            name: "Shahidul Islam",
            location: "Khulna, Bangladesh",
            rating: 5,
            feedback: "I'm very impressed with their safe delivery guarantee. All my important documents reached safely. The real-time notification system keeps me updated about my parcel.",
            image: "https://randomuser.me/api/portraits/men/5.jpg",
            date: "3 weeks ago"
        }
    ];

    const nextSlide = () => {
        setActiveIndex((prev) => (prev + 1) % feedbacks.length);
    };

    const prevSlide = () => {
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
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12
            }
        }
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`text-xl ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            >
                ★
            </motion.span>
        ));
    };

    const carouselVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
            scale: 0.8
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
            scale: 0.8,
            transition: {
                duration: 0.3
            }
        })
    };

    return (
        <div className="relative overflow-hidden py-20 px-4 ">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    ref={sectionRef}
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="text-center mb-12"
                >
                    <motion.h2
                        variants={itemVariants}
                        className="text-4xl md:text-5xl font-bold text-[#03373d] mb-4"
                    >
                        What Our Customers Say
                        <motion.span
                            initial={{ width: 0 }}
                            animate={isInView ? { width: "100px" } : { width: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="block h-1 bg-gradient-to-r from-[#03373d] to-cyan-400 mx-auto mt-4 rounded-full"
                        />
                    </motion.h2>

                    <motion.p
                        variants={itemVariants}
                        className="text-gray-600 text-lg max-w-2xl mx-auto"
                    >
                        Trusted by thousands of customers across Bangladesh
                    </motion.p>
                </motion.div>

                <div className="relative">
                    <div className="overflow-hidden px-4 md:px-12">
                        <AnimatePresence mode="wait" custom={activeIndex}>
                            <motion.div
                                key={activeIndex}
                                custom={activeIndex}
                                variants={carouselVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                className="flex justify-center"
                            >
                                <div className="w-full max-w-4xl">
                                    <div className="bg-white rounded-2xl shadow-2xl  p-8 md:p-10 border border-gray-100">
                                        <div className="flex flex-col items-center text-center">
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: "spring", delay: 0.2 }}
                                                className="relative"
                                            >
                                                <img
                                                    src={feedbacks[activeIndex].image}
                                                    alt={feedbacks[activeIndex].name}
                                                    className="w-24 h-24 rounded-full object-cover border-4 border-[#caeb66] shadow-lg"
                                                />
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ delay: 0.3 }}
                                                    className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1"
                                                >
                                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </motion.div>
                                            </motion.div>

                                            <motion.h3
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.3 }}
                                                className="font-bold text-[#03373d] text-2xl mt-4"
                                            >
                                                {feedbacks[activeIndex].name}
                                            </motion.h3>

                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.35 }}
                                                className="flex items-center gap-2 mt-1"
                                            >
                                                <span className="text-gray-500">📍</span>
                                                <span className="text-gray-500">{feedbacks[activeIndex].location}</span>
                                            </motion.div>

                                            <motion.div
                                                initial={{ opacity: 0, scale: 0 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.4, type: "spring" }}
                                                className="flex gap-1 mt-3"
                                            >
                                                {renderStars(feedbacks[activeIndex].rating)}
                                            </motion.div>

                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.45 }}
                                                className="relative mt-6"
                                            >
                                                <svg className="absolute -top-6 -left-6 w-12 h-12 text-gray-200 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                                </svg>
                                                <p className="text-gray-600 leading-relaxed text-lg max-w-2xl px-4">
                                                    "{feedbacks[activeIndex].feedback}"
                                                </p>
                                                <svg className="absolute -bottom-6 -right-6 w-12 h-12 text-gray-200 opacity-50 transform rotate-180" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                                </svg>
                                            </motion.div>

                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.5 }}
                                                className="flex justify-between items-center w-full mt-8 pt-4 border-t border-gray-100"
                                            >
                                                <div className="flex items-center gap-1 text-[#03373d] text-sm">
                                                    <span>✓</span>
                                                    <span>Verified Purchase</span>
                                                </div>
                                                <span className="text-gray-400 text-sm">{feedbacks[activeIndex].date}</span>
                                            </motion.div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <motion.button
                        onClick={prevSlide}
                        whileHover={{ scale: 1.1, x: -5 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 border-2 border-[#caeb66] rounded-full p-3 shadow-lg hover:shadow-xl transition-all z-10"
                    >
                        <svg className="w-6 h-6 text-[#caeb66]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </motion.button>

                    <motion.button
                        onClick={nextSlide}
                        whileHover={{ scale: 1.1, x: 5 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-[#caeb66]  rounded-full p-3 shadow-lg hover:shadow-xl transition-all z-10"
                    >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </motion.button>
                </div>

                <div className="flex justify-center gap-3 mt-8">
                    {feedbacks.map((_, idx) => (
                        <motion.button
                            key={idx}
                            onClick={() => setActiveIndex(idx)}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            className={`h-2 rounded-full transition-all duration-300 ${activeIndex === idx
                                ? "w-8 bg-[#caeb66]"
                                    : "w-2 bg-gray-300 hover:bg-gray-400"
                                }`}
                        />
                    ))}
                </div>

             
            </div>

          

           
        </div>
    );
};

export default CustomerFeedback;