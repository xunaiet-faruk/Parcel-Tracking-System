"use client";

import { motion } from "framer-motion";

export default function Loading() {
    return (
        <div className="fixed inset-0 bg-gradient-to-br from-[#03373d] to-[#1a5c64] z-50 flex items-center justify-center">
            <div className="text-center">
                {/* Running Truck */}
                <div className="w-72 overflow-hidden mb-8">
                    <motion.div
                        animate={{ x: [120, -120] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="text-7xl"
                        style={{ width: "fit-content" }}
                    >
                        🚚💨
                    </motion.div>
                </div>

                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-6">
                    <div className="w-10 h-10 bg-[#caeb66] rounded-xl flex items-center justify-center">
                        <span className="text-[#03373d] text-xl font-bold">Z</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white">Zapwork</h1>
                </div>

                {/* Waiting Text */}
                <div className="space-y-3">
                    <p className="text-white text-lg">
                        Just a moment please...
                    </p>
                    <p className="text-[#caeb66] text-sm">
                        Loading ............
                    </p>
                    <div className="flex justify-center gap-1">
                        <motion.div
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                            className="text-white/50 text-xs"
                        >
                            .
                        </motion.div>
                        <motion.div
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                            className="text-white/50 text-xs"
                        >
                            .
                        </motion.div>
                        <motion.div
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
                            className="text-white/50 text-xs"
                        >
                            .
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}