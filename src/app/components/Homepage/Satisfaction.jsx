"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const Satisfaction = () => {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: false, amount: 0.3 });

    const stats = [
        { number: "99.9%", label: "Delivery Success Rate", icon: "📦" },
        { number: "50K+", label: "Happy Customers", icon: "😊" },
        { number: "24/7", label: "Customer Support", icon: "🎧" },
        { number: "15min", label: "Average Response", icon: "⚡" }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1
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

    const badgeVariants = {
        hidden: { opacity: 0, scale: 0.8, y: -20 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.2
            }
        }
    };

    const headingVariants = {
        hidden: { opacity: 0, x: -50 },
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

    const descriptionVariants = {
        hidden: { opacity: 0, x: -30 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.6,
                delay: 0.4
            }
        }
    };

    const buttonContainerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.5
            }
        }
    };

    const buttonVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.9 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 150,
                damping: 12
            }
        }
    };

    const imageVariants = {
        hidden: { opacity: 0, x: 100, rotate: 10 },
        visible: {
            opacity: 1,
            x: 0,
            rotate: 0,
            transition: {
                type: "spring",
                stiffness: 80,
                damping: 10,
                delay: 0.6
            }
        }
    };

    const floatVariants = {
        animate: {
            y: [0, -15, 0],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    const pulseVariants = {
        animate: {
            scale: [1, 1.05, 1],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <div className="relative overflow-hidden rounded-xl my-20">
            <div
                className="absolute inset-0 bg-cover bg-center bg-fixed"
                style={{
                    backgroundImage: "url('/assets/be-a-merchant-bg.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat"
                }}
            />

            <div className="absolute inset-0 bg-gradient-to-t  from-[#03373d] via-[#03373d]/140 to-transparent" />

            <motion.div
                ref={sectionRef}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={containerVariants}
                className="relative z-10 py-24 md:py-12 px-4"
            >
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        variants={badgeVariants}
                        className="flex justify-center mb-6"
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
                        >
                            <motion.span
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 0.5, delay: 0.8, repeat: 1 }}
                                className="text-yellow-400 text-lg"
                            >
                                ⭐
                            </motion.span>
                            <span className="text-white text-sm font-medium">Trusted by 50,000+ Customers</span>
                        </motion.div>
                    </motion.div>

                    <div className="flex justify-between items-center gap-12 flex-col md:flex-row">
                        <motion.div
                            variants={itemVariants}
                            className="flex-1"
                        >
                            <motion.h2
                                variants={headingVariants}
                                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
                            >
                                Your Satisfaction is
                                <motion.span
                                    variants={pulseVariants}
                                    animate="animate"
                                    className="block bg-gradient-to-r from-[#caeb66] to-[#d4ff6e] bg-clip-text text-transparent"
                                >
                                    Our Top Priority
                                </motion.span>
                            </motion.h2>

                            <motion.p
                                variants={descriptionVariants}
                                className="text-gray-200 max-w-2xl mb-12 text-lg leading-relaxed"
                            >
                                We're committed to providing exceptional service and ensuring
                                every delivery exceeds your expectations. Experience peace of mind
                                with our reliable and trusted delivery solutions.
                            </motion.p>

                            <motion.div
                                variants={buttonContainerVariants}
                                className="flex flex-wrap gap-4"
                            >
                                <motion.button
                                    variants={buttonVariants}
                                    whileHover={{
                                        scale: 1.08,
                                        boxShadow: "0 10px 25px -5px rgba(202, 235, 102, 0.3)",
                                        transition: { type: "spring", stiffness: 400 }
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    className="cursor-pointer px-8 py-4 border-2 border-[#caeb66] text-[#caeb66] rounded-lg shadow-lg hover:bg-[#caeb66] hover:text-[#03373d] transition-all duration-300 font-semibold relative overflow-hidden group"
                                >
                                    <motion.span
                                        className="absolute inset-0 bg-[#caeb66]"
                                        initial={{ x: "-100%" }}
                                        whileHover={{ x: 0 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                    <span className="relative z-10">Become a Merchant</span>
                                </motion.button>

                                <motion.button
                                    variants={buttonVariants}
                                    whileHover={{
                                        scale: 1.08,
                                        boxShadow: "0 10px 25px -5px rgba(202, 235, 102, 0.5)",
                                        transition: { type: "spring", stiffness: 400 }
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    className="cursor-pointer px-8 py-4 bg-[#caeb66] text-[#03373d] rounded-lg shadow-lg hover:bg-[#d4ff6e] transition-all duration-300 font-semibold relative overflow-hidden group"
                                >
                                    <motion.span
                                        className="absolute inset-0 bg-white"
                                        initial={{ y: "100%" }}
                                        whileHover={{ y: 0 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                    <span className="relative z-10">Earn With Profast Courier</span>
                                </motion.button>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            variants={imageVariants}
                            className="flex-1 flex justify-center"
                        >
                            <motion.img
                                variants={floatVariants}
                                animate="animate"
                                whileHover={{
                                    scale: 1.05,
                                    rotate: 5,
                                    transition: { type: "spring", stiffness: 300 }
                                }}
                                className="w-full max-w-md h-auto object-contain drop-shadow-2xl"
                                src="/assets/location-merchant.png"
                                alt="Location of Merchant"
                            />
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                animate={{
                    x: [0, 100, 0],
                    opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute bottom-0 left-0 w-64 h-64 bg-[#caeb66]/10 rounded-full blur-3xl pointer-events-none"
            />

            <motion.div
                animate={{
                    y: [0, -50, 0],
                    x: [0, 50, 0],
                    opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-20 right-0 w-96 h-96 bg-[#caeb66]/10 rounded-full blur-3xl pointer-events-none"
            />

            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#caeb66]/5 rounded-full blur-3xl pointer-events-none"
            />
        </div>
    );
};

export default Satisfaction;