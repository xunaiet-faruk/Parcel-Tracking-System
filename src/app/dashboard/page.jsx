"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    FaTachometerAlt,
    FaBox,
    FaTruck,
    FaUsers,
    FaChartBar,
    FaCog,
    FaSignOutAlt,
    FaBars,
    FaTimes,
    FaUserFriends,
    FaClipboardList,
    FaHeadset,
    FaBell,
    FaUserCircle,
    FaHistory,
    FaUserCheck,
    FaTasks,
    FaUserPlus,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../(site)/hooks/useAuth";
import useRole from "../(site)/hooks/useRole";
import Loading from "../components/Loading";

const Sidebar = ({ children }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const { role, isLoading } = useRole(); // role can be 'user', 'rider', or 'admin'

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth < 768) {
                setIsOpen(false);
            } else {
                setIsOpen(true);
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Define all navigation links with role-based access
    const allNavLinks = [
        // Admin only links
        {
            name: "Dashboard",
            href: "/dashboard/overview",
            icon: <FaTachometerAlt />,
            roles: ["admin", "rider", "user"] // All roles can see dashboard
        },
        {
            name: "Approve Rider",
            href: "/dashboard/approverider",
            icon: <FaUserCheck />,
            roles: ["admin"] // Only admin
        },
        {
            name: "User Management",
            href: "/dashboard/usermanagment",
            icon: <FaUserFriends />,
            roles: ["admin"] // Only admin
        },
        {
            name: "Assign Rider",
            href: "/dashboard/assignrider",
            icon: <FaUserCheck />,
            roles: ["admin","user"] // Only admin
        },

        // Rider specific links
        {
            name: "My Deliveries",
            href: "/dashboard/my-deliveries",
            icon: <FaTruck />,
            roles: ["rider"] // Only riders
        },
        {
            name: "Delivery History",
            href: "/dashboard/delivery-history",
            icon: <FaHistory />,
            roles: ["rider"] // Only riders
        },

        // User (customer) specific links
        {
            name: "Send Parcel",
            href: "/dashboard/send-parcel",
            icon: <FaBox />,
            roles: ["user"] // Only customers
        },
        {
            name: "My Parcels",
            href: "/dashboard/myparcels",
            icon: <FaClipboardList />,
            roles: ["user"] // Only customers
        },
        {
            name: "Become a Rider",
            href: "/dashboard/become-rider",
            icon: <FaUsers />,
            roles: ["user"] // Only customers
        },

        // Common links for all authenticated users
        {
            name: "Payment History",
            href: "/dashboard/paymentHistroy",
            icon: <FaHistory />,
            roles: ["admin", "rider", "user"]
        },
        {
            name: "Support",
            href: "/dashboard/support",
            icon: <FaHeadset />,
            roles: ["admin", "rider", "user"]
        },
        {
            name: "Settings",
            href: "/dashboard/settings",
            icon: <FaCog />,
            roles: ["admin", "rider", "user"]
        },
    ];

    // Filter links based on user role
    const navLinks = allNavLinks.filter(link =>
        !isLoading && link.roles.includes(role)
    );

    // Get role display name
    const getRoleDisplayName = () => {
        if (role === "admin") return "Admin";
        if (role === "rider") return "Rider";
        return "Customer";
    };

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    if (isLoading) {
        return <Loading/>
    }

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isMobile && isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/50 z-20 md:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    width: isOpen ? (isMobile ? "280px" : "280px") : "80px",
                }}
                transition={{ duration: 0.3, type: "spring", damping: 20 }}
                className={`fixed md:relative h-full bg-gradient-to-b from-[#03373d] to-[#1a5c64] shadow-2xl z-30 flex flex-col ${isMobile && !isOpen ? "-translate-x-full" : "translate-x-0"
                    } md:translate-x-0 transition-transform duration-300`}
                style={{ width: isOpen ? (isMobile ? "280px" : "280px") : "80px" }}
            >
                {/* Logo Section */}
                <div className={`p-6 border-b border-white/10 flex items-center ${isOpen ? "justify-between" : "justify-center"
                    }`}>
                    {isOpen ? (
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#caeb66] rounded-xl flex items-center justify-center">
                                <FaTruck className="text-[#03373d] text-xl" />
                            </div>
                            <div>
                                <h1 className="text-white font-bold text-xl">Zapwork</h1>
                                <p className="text-[#caeb66] text-xs">Delivery Solutions</p>
                            </div>
                        </div>
                    ) : (
                        <div className="w-10 h-10 bg-[#caeb66] rounded-xl flex items-center justify-center">
                            <FaTruck className="text-[#03373d] text-xl" />
                        </div>
                    )}

                    {/* Toggle Button */}
                    <button
                        onClick={toggleSidebar}
                        className="hidden md:flex text-white hover:bg-white/10 p-2 rounded-lg transition"
                    >
                        {isOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>

                {/* Mobile Close Button */}
                {isMobile && isOpen && (
                    <button
                        onClick={toggleSidebar}
                        className="absolute top-4 right-4 text-white hover:bg-white/10 p-2 rounded-lg md:hidden"
                    >
                        <FaTimes />
                    </button>
                )}

                {/* User Profile Section */}
                <div className={`p-4 border-b border-white/10 ${isOpen ? "flex" : "flex-col"
                    } items-center gap-3`}>
                    <div className="w-12 h-12 bg-[#caeb66]/20 rounded-full flex items-center justify-center border-2 border-[#caeb66]">
                        {user?.photoURL ? (
                            <img
                                src={user.photoURL}
                                alt="Profile"
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            <FaUserCircle className="text-[#caeb66] text-2xl" />
                        )}
                    </div>
                    {isOpen && (
                        <div className="flex-1">
                            <p className="text-white font-semibold text-sm">
                                {user?.displayName || user?.email?.split('@')[0] || "Guest User"}
                            </p>
                            <p className="text-[#caeb66] text-xs truncate max-w-[180px]">
                                {user?.email || "Not logged in"}
                            </p>
                            <span className="inline-block mt-1 px-2 py-0.5 bg-white/10 rounded-full text-white text-xs">
                                {getRoleDisplayName()}
                            </span>
                        </div>
                    )}
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto py-6">
                    <div className="px-4">
                        {isOpen && (
                            <p className="text-white/50 text-xs uppercase tracking-wider mb-3 px-3">
                                Main Menu
                            </p>
                        )}
                        <ul className="space-y-2">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <li key={link.name}>
                                        <Link href={link.href}>
                                            <motion.div
                                                whileHover={{ x: 5 }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 cursor-pointer ${isActive
                                                        ? "bg-[#caeb66] text-[#03373d] shadow-lg"
                                                        : "text-white/80 hover:bg-white/10 hover:text-white"
                                                    }`}
                                            >
                                                <span className="text-xl">{link.icon}</span>
                                                {isOpen && (
                                                    <span className="font-medium text-sm">{link.name}</span>
                                                )}
                                                {isActive && isOpen && (
                                                    <motion.div
                                                        layoutId="active-indicator"
                                                        className="ml-auto w-1 h-6 bg-[#03373d] rounded-full"
                                                    />
                                                )}
                                            </motion.div>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* Notifications Section */}
                    <div className="mt-6 px-4">
                        {isOpen && (
                            <p className="text-white/50 text-xs uppercase tracking-wider mb-3 px-3">
                                Notifications
                            </p>
                        )}
                        <div className="bg-white/5 rounded-xl p-3">
                            {isOpen ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-[#caeb66]/20 rounded-full flex items-center justify-center">
                                        <FaBell className="text-[#caeb66] text-sm" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-white text-xs font-medium">New Update!</p>
                                        <p className="text-white/50 text-xs">Your parcel is on the way</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-center">
                                    <div className="w-8 h-8 bg-[#caeb66]/20 rounded-full flex items-center justify-center relative">
                                        <FaBell className="text-[#caeb66] text-sm" />
                                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Footer Section */}
                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={logout}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200 ${isOpen ? "" : "justify-center"
                            }`}
                    >
                        <FaSignOutAlt className="text-xl" />
                        {isOpen && <span className="font-medium text-sm">Logout</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {/* Mobile Header */}
                {isMobile && !isOpen && (
                    <div className="sticky top-0 z-10 bg-white shadow-md p-4 flex items-center gap-3">
                        <button
                            onClick={toggleSidebar}
                            className="p-2 hover:bg-gray-100 rounded-lg transition"
                        >
                            <FaBars className="text-[#03373d] text-xl" />
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-[#caeb66] rounded-lg flex items-center justify-center">
                                <FaTruck className="text-[#03373d] text-sm" />
                            </div>
                            <h1 className="text-[#03373d] font-bold text-lg">Zapwork</h1>
                        </div>
                    </div>
                )}

                {/* Page Content */}
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Sidebar;