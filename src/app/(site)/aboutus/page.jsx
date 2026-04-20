"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaRocket,
    FaEye,
    FaBullseye,
    FaHistory,
    FaUsers,
    FaTrophy,
    FaHandshake,
    FaChartLine,
    FaShieldAlt,
    FaClock,
    FaTruck,
    FaGlobe,
    FaCheckCircle,
    FaAward,
    FaHeart,
    FaStar,
    FaQuoteLeft,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
} from "react-icons/fa";

const Page = () => {
    const [activeTab, setActiveTab] = useState("mission");

    const tabs = [
        { id: "mission", label: "Our Mission", icon: <FaBullseye /> },
        { id: "vision", label: "Our Vision", icon: <FaEye /> },
        { id: "story", label: "Our Story", icon: <FaHistory /> },
        { id: "values", label: "Core Values", icon: <FaHeart /> },
        { id: "achievements", label: "Achievements", icon: <FaTrophy /> },
        { id: "team", label: "Leadership", icon: <FaUsers /> },
    ];

    const tabContent = {
        mission: {
            title: "Our Mission",
            description: "To revolutionize the delivery ecosystem in Bangladesh by providing fast, reliable, and affordable logistics solutions that empower businesses and delight customers.",
            points: [
                "Connect every corner of Bangladesh with efficient delivery networks",
                "Empower local businesses with technology-driven logistics",
                "Create sustainable employment opportunities for delivery professionals",
                "Ensure 100% customer satisfaction through transparent operations"
            ],
            image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop"
        },
        vision: {
            title: "Our Vision",
            description: "To become the most trusted and innovative logistics platform in South Asia, setting new standards for delivery excellence and customer experience.",
            points: [
                "Expand to 100+ cities across Bangladesh by 2026",
                "Achieve carbon-neutral delivery operations by 2028",
                "Process 1 million+ deliveries monthly with 99.9% accuracy",
                "Build the largest network of delivery professionals in the region"
            ],
            image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop"
        },
        story: {
            title: "Our Story",
            description: "Founded in 2020, Zapwork started with a simple idea: make delivery simple, fast, and accessible for everyone in Bangladesh.",
            points: [
                "Started with just 5 delivery partners in Dhaka",
                "Grew to 500+ active delivery professionals within first year",
                "Expanded to 8 major cities across the country",
                "Served 50,000+ happy customers and counting",
                "Partnered with 1000+ local and international businesses"
            ],
            image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop"
        },
        values: {
            title: "Core Values",
            description: "Our values guide everything we do - from how we treat our customers to how we build our technology.",
            points: [
                "Customer First: Every decision starts with our customers",
                "Innovation: Constantly improving and adapting",
                "Integrity: Transparent and honest in all dealings",
                "Teamwork: Growing together as one family",
                "Excellence: Never settling for good when great is possible"
            ],
            image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=400&fit=crop"
        },
        achievements: {
            title: "Our Achievements",
            description: "Recognized for our commitment to excellence and innovation in logistics.",
            points: [
                "Best Startup Award 2023 - Bangladesh Innovation Forum",
                "Fastest Growing Logistics Platform - 2024",
                "50,000+ Successful Deliveries",
                "98.5% Customer Satisfaction Rating",
                "Featured in Top 10 Tech Startups of Bangladesh"
            ],
            image: "https://images.unsplash.com/photo-1513151233558-860c5392816a?w=600&h=400&fit=crop"
        },
        team: {
            title: "Leadership Team",
            description: "Meet the passionate leaders driving Zapwork's mission forward.",
            points: [
                "Led by experienced entrepreneurs with 20+ years in logistics",
                "Team of 50+ technology and operations experts",
                "500+ trained delivery professionals nationwide",
                "24/7 customer support team",
                "Dedicated R&D department for continuous innovation"
            ],
            image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop"
        }
    };

    const stats = [
        { number: "50K+", label: "Happy Customers", icon: <FaUsers /> },
        { number: "500+", label: "Delivery Partners", icon: <FaTruck /> },
        { number: "64", label: "Districts Covered", icon: <FaGlobe /> },
        { number: "99.9%", label: "Success Rate", icon: <FaCheckCircle /> },
    ];

    const features = [
        { icon: <FaClock />, title: "Fast Delivery", description: "Same-day and next-day delivery options" },
        { icon: <FaShieldAlt />, title: "Secure Payment", description: "Cash on delivery & online payments" },
        { icon: <FaTruck />, title: "Real-time Tracking", description: "Track your parcel in real-time" },
        { icon: <FaHandshake />, title: "24/7 Support", description: "Dedicated customer support team" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-[#03373d] to-[#1a5c64] text-white rounded-b-4xl overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full" style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-6 py-52 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        
                        <h1 className="text-5xl md:text-7xl font-bold mb-6">
                            Redefining Delivery
                            <span className="text-[#caeb66]"> Across Bangladesh</span>
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
                            We're on a mission to connect every corner of Bangladesh with fast, reliable, and affordable delivery services.
                        </p>
                       
                    </motion.div>
                </div>

                {/* Wave Bottom */}
                <div className="absolute bottom-0 w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
                        <path fill="#f3f4f6" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                </div>
            </div>

            {/* Stats Section */}
            <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="bg-white rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition"
                        >
                            <div className="text-4xl text-[#03373d] flex justify-center mb-3">
                                {stat.icon}
                            </div>
                            <div className="text-3xl font-bold text-[#03373d] mb-1">{stat.number}</div>
                            <div className="text-sm text-gray-600">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Tab Section */}
            <div className="max-w-7xl mx-auto px-6 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-[#03373d] mb-4">
                        Who We Are
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Discover our journey, values, and the team behind Zapwork
                    </p>
                </motion.div>

                {/* Tab Bar */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${activeTab === tab.id
                                    ? "bg-[#03373d] text-white shadow-lg"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-3xl shadow-xl overflow-hidden"
                    >
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="p-8 md:p-12">
                                <h3 className="text-3xl font-bold text-[#03373d] mb-4">
                                    {tabContent[activeTab].title}
                                </h3>
                                <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                                    {tabContent[activeTab].description}
                                </p>
                                <div className="space-y-3">
                                    {tabContent[activeTab].points.map((point, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <FaCheckCircle className="text-[#caeb66] mt-1 flex-shrink-0" />
                                            <span className="text-gray-700">{point}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="relative h-64 md:h-auto">
                                <img
                                    src={tabContent[activeTab].image}
                                    alt={tabContent[activeTab].title}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-l from-[#03373d]/20 to-transparent"></div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Features Section */}
            <div className="py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-[#03373d] mb-4">
                            Why Choose Us?
                        </h2>
                        <p className="text-xl text-gray-600">
                            We're committed to providing the best delivery experience
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition"
                            >
                                <div className="text-5xl text-[#03373d] flex justify-center mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            

        </div>
    );
};

export default Page;