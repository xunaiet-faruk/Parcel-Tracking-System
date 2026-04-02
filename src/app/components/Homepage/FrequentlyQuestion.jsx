"use client";
import React, { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const FrequentlyQuestion = () => {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: false, amount: 0.2 });
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            id: 1,
            question: "How can I track my parcel in real-time?",
            answer: "You can track your parcel in real-time by entering your tracking number on our website or mobile app. We provide live updates on your parcel's location, estimated delivery time, and delivery status. You'll also receive SMS and email notifications at every step of the delivery process.",
            category: "Tracking"
        },
        {
            id: 2,
            question: "What is the delivery time for domestic shipments?",
            answer: "Domestic deliveries typically take 1-3 business days depending on the destination. Dhaka city deliveries are completed within 24 hours, while other major cities like Chittagong, Sylhet, and Rajshahi take 2-3 business days. Express delivery options are also available for urgent shipments.",
            category: "Delivery"
        },
        {
            id: 3,
            question: "How do I become a merchant with Profast Courier?",
            answer: "To become a merchant, simply click on the 'Become a Merchant' button on our homepage, fill out the registration form with your business details, and submit required documents. Our team will verify your information within 24-48 hours and activate your merchant account. You'll then get access to exclusive merchant features and discounted rates.",
            category: "Merchant"
        },
        {
            id: 4,
            question: "Is my parcel insured during delivery?",
            answer: "Yes, all parcels shipped through Profast Courier are automatically insured up to a certain value. We offer comprehensive insurance coverage for lost or damaged items. For high-value items, you can purchase additional insurance coverage at nominal rates. Our safe delivery guarantee ensures your packages are handled with utmost care.",
            category: "Safety"
        },
        {
            id: 5,
            question: "What payment methods do you accept?",
            answer: "We accept multiple payment methods including credit/debit cards (Visa, Mastercard, Amex), mobile banking (bKash, Nagad, Rocket), bank transfers, and cash on delivery. For merchant accounts, we offer flexible billing options including weekly and monthly payment settlements.",
            category: "Payment"
        },
        {
            id: 6,
            question: "How can I contact customer support?",
            answer: "Our customer support team is available 24/7 through multiple channels: Call our helpline at 09612-345678, send an email to support@profastcourier.com, or use our live chat feature on the website and mobile app. We typically respond within 15 minutes and resolve most issues instantly.",
            category: "Support"
        }
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

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
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12
            }
        }
    };

    const faqVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 120,
                damping: 15
            }
        }
    };

    const answerVariants = {
        hidden: { opacity: 0, height: 0, marginBottom: 0 },
        visible: {
            opacity: 1,
            height: "auto",
            marginBottom: 16,
            transition: {
                type: "spring",
                stiffness: 200,
                damping: 25,
                duration: 0.4
            }
        },
        exit: {
            opacity: 0,
            height: 0,
            marginBottom: 0,
            transition: {
                duration: 0.3
            }
        }
    };

    return (
        <div className="relative overflow-hidden py-20 px-4 ">
            <div className="max-w-4xl mx-auto">
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
                        Frequently Asked Questions
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
                        Find answers to your most common questions about our services
                    </motion.p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="space-y-4"
                >
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={faq.id}
                            variants={faqVariants}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
                        >
                            <motion.button
                                onClick={() => toggleFAQ(index)}
                                className="w-full px-6 py-5 flex justify-between items-center text-left cursor-pointer"
                                whileHover={{ backgroundColor: "rgba(3, 55, 61, 0.02)" }}
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="text-sm font-semibold text-white bg-[#caeb66]/60 px-2 py-1 rounded-full">
                                            {faq.category}
                                        </span>
                                    </div>
                                    <h3 className="text-lg md:text-xl font-semibold text-[#03373d] pr-8">
                                        {faq.question}
                                    </h3>
                                </div>
                                <motion.div
                                    animate={{
                                        rotate: openIndex === index ? 180 : 0,
                                        scale: openIndex === index ? 1.1 : 1
                                    }}
                                    transition={{ duration: 0.3, type: "spring" }}
                                    className="flex-shrink-0 w-8 h-8 bg-[#03373d]/10 rounded-full flex items-center justify-center"
                                >
                                    <svg
                                        className="w-5 h-5 text-[#03373d]"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </motion.div>
                            </motion.button>

                            <AnimatePresence mode="wait">
                                {openIndex === index && (
                                    <motion.div
                                        variants={answerVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        className="px-6"
                                    >
                                        <div className="pb-5">
                                            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4" />
                                            <motion.p
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.1 }}
                                                className="text-gray-600 leading-relaxed"
                                            >
                                                {faq.answer}
                                            </motion.p>
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.2, type: "spring" }}
                                                className="mt-4 flex gap-3"
                                            >
                                                <button className="text-sm text-[#03373d] font-semibold hover:text-[#caeb66] transition-colors">
                                                    👍 Helpful
                                                </button>
                                                <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                                                    👎 Not Helpful
                                                </button>
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </motion.div>

             
            </div>

          
        </div>
    );
};

export default FrequentlyQuestion;