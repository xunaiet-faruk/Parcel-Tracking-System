"use client";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import useAuth from "@/app/(site)/hooks/useAuth";
import Loading from "../Loading";


const Navbar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout, loading } = useAuth();

    const publicLinks = [
        { name: 'Home', href: '/' },
        { name: 'Services', href: '/services' },
        { name: 'Coverage', href: '/coverage' },
        { name: 'About Us', href: '/aboutus' },
        { name: 'Send Parcel', href: '/parcel' },
        { name: 'Be a Rider', href: '/rider' },
    ];



    const links = [...publicLinks];

    const isActive = (href) => {
        if (href === '/') {
            return pathname === href;
        }
        return pathname === href || pathname.startsWith(href + '/');
    };

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

  
    if (loading) {
        return <Loading/>
    }

    return (
        <div>
            <div className="navbar bg-white shadow-md">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                            </svg>
                        </div>
                        <ul
                            tabIndex="-1"
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow-lg"
                        >
                            {links.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className={isActive(link.href) ? "text-[#caeb66] font-semibold" : "text-gray-700"}
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <Link href="/" className="flex items-end">
                        <img className="mb-2 w-7" src="/assets/logo.png" alt="Logo" />
                        <h1 className="text-2xl font-semibold text-[#03373d]">Profast</h1>
                    </Link>
                </div>

                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1 gap-2">
                        {links.map((link) => (
                            <li key={link.name} className="relative">
                                <Link
                                    href={link.href}
                                    className={`relative px-3 py-2 transition-all duration-300 ${isActive(link.href)
                                        ? "text-[#caeb66] font-semibold"
                                        : "text-[#03373d] hover:text-[#caeb66]"
                                        }`}
                                >
                                    {link.name}
                                    {isActive(link.href) && (
                                        <motion.div
                                            layoutId="activeUnderline"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#caeb66] rounded-full"
                                            initial={{ opacity: 0, scaleX: 0 }}
                                            animate={{ opacity: 1, scaleX: 1 }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 300,
                                                damping: 30
                                            }}
                                        />
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="navbar-end gap-4">
                    {user ? (
                        <>
                            <motion.button
                                onClick={handleLogout}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="btn border-2 border-red-500 bg-transparent text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 rounded-lg px-6 font-semibold"
                            >
                                Logout
                            </motion.button>
                        </>
                    ) : (
                        <motion.a
                            href="/login"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn border-2 border-[#caeb66] bg-transparent text-[#03373d] hover:bg-[#caeb66] hover:text-[#03373d] transition-all duration-300 rounded-lg px-6 font-semibold"
                        >
                            Sign In
                        </motion.a>
                    )}

                    {
                        user ? (
                            <motion.a
                                href="/dashboard/overview"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="btn bg-[#caeb66] text-[#03373d] cursor-pointer hover:bg-[#d4ff6e] transition-all duration-300 rounded-lg px-6 font-semibold shadow-md"
                            >
                                Dashboard
                            </motion.a>
                        ) : <motion.a
                            href="/login"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn bg-[#caeb66] text-[#03373d] hover:bg-[#d4ff6e] transition-all duration-300 rounded-lg px-6 font-semibold shadow-md"
                        >
                            Be a Rider
                        </motion.a>

                    }
                </div>
            </div>
        </div>
    );
};

export default Navbar;