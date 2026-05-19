"use client";

import React, { useState, useEffect, useRef } from "react";
import warehousesData from "@/app/data/warehouses.json";
import { motion } from "framer-motion";
import dynamicImport from "next/dynamic";

// ম্যাপ কম্পোনেন্টটি dynamic ইম্পোর্ট করা হলো এবং SSR অফ করে দেওয়া হলো
const MapComponent = dynamicImport(() => import("./MapComponent"), {
    ssr: false,
    loading: () => (
        <div className="h-[600px] w-full bg-gray-100 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#03373d] mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading Map...</p>
            </div>
        </div>
    )
});

const Page = () => {
    const [mapCenter, setMapCenter] = useState([23.8103, 90.4125]);
    const [zoom, setZoom] = useState(7);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [shouldFly, setShouldFly] = useState(false);
    const [targetLocation, setTargetLocation] = useState(null);
    const [mounted, setMounted] = useState(false);
    const searchInputRef = useRef(null);

    const warehouses = warehousesData;

    useEffect(() => {
        setMounted(true);
    }, []);

    const totalCenters = warehouses.length;
    const activeCenters = warehouses.filter(w => w.status === "active").length;
    const cities = [...new Set(warehouses.map(w => w.city))].length;
    const coveredAreas = [...new Set(warehouses.flatMap(w => w.covered_area))].length;

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query.trim() === "") {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const results = warehouses.filter(center => {
            return (
                center.city.toLowerCase().includes(lowerQuery) ||
                center.district.toLowerCase().includes(lowerQuery) ||
                center.region.toLowerCase().includes(lowerQuery) ||
                center.covered_area.some(area => area.toLowerCase().includes(lowerQuery))
            );
        });

        setSearchResults(results);
        setShowResults(true);
    };

    const focusOnLocation = (center) => {
        setTargetLocation({
            lat: center.latitude,
            lng: center.longitude,
            zoom: 16,
            centerData: center
        });
        setShouldFly(true);
        setShowResults(false);
        setSearchQuery("");

        setTimeout(() => {
            setShouldFly(false);
        }, 2000);
    };

    if (!mounted) {
        return (
            <div className="h-[600px] w-full bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#03373d] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Preparing Page...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-[#03373d] to-[#1a5c64] text-white overflow-hidden rounded-b-4xl">
                <div className="relative max-w-7xl mx-auto px-6 py-52 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-bold mb-6">
                            Our Service <span className="text-[#caeb66]">Centers</span>
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
                            Nationwide delivery network across Bangladesh
                        </p>
                        <div className="flex flex-wrap justify-center gap-8 mt-12">
                            <div className="text-center">
                                <div className="text-4xl md:text-5xl font-bold text-[#caeb66]">{totalCenters}</div>
                                <div className="text-sm md:text-base mt-2">Service Centers</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl md:text-5xl font-bold text-[#caeb66]">{activeCenters}</div>
                                <div className="text-sm md:text-base mt-2">Active Locations</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl md:text-5xl font-bold text-[#caeb66]">{cities}</div>
                                <div className="text-sm md:text-base mt-2">Cities Covered</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl md:text-5xl font-bold text-[#caeb66]">{coveredAreas}</div>
                                <div className="text-sm md:text-base mt-2">Covered Areas</div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="absolute bottom-0 w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
                        <path fill="#f3f4f6" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                </div>
            </div>

            {/* Map Section with Search Bar */}
            <div className="w-full px-6 py-12">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-center mb-8"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold text-[#03373d] mb-4">
                            Find Your Nearest Service Center
                        </h2>
                        <p className="text-gray-600 text-lg">
                            Search and click on any result to fly to the location
                        </p>
                    </motion.div>

                    {/* Map Container with Search Bar Overlay */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="relative border-4 border-white rounded-2xl overflow-hidden shadow-2xl"
                    >
                        {/* Search Bar Overlay on Map */}
                        <div className="absolute top-4 left-0 right-0 z-10 px-4">
                            <div className="max-w-2xl mx-auto relative">
                                <div className="relative">
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        placeholder="Search by city, district, region, or covered area..."
                                        value={searchQuery}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        className="w-full px-6 py-4 text-gray-800 rounded-full shadow-2xl focus:outline-none focus:ring-2 focus:ring-[#caeb66] text-lg border-2 border-white"
                                    />
                                    <svg
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>

                                {/* Search Results Dropdown */}
                                {showResults && searchResults.length > 0 && (
                                    <div className="absolute w-full mt-2 bg-white rounded-xl shadow-2xl max-h-96 overflow-y-auto z-20">
                                        {searchResults.map((result, index) => (
                                            <div
                                                key={index}
                                                onClick={() => focusOnLocation(result)}
                                                className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition group"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3 className="font-semibold text-gray-800 group-hover:text-[#03373d]">
                                                                {result.city}
                                                            </h3>
                                                            <span className={`text-xs px-2 py-1 rounded-full ${result.status === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                                                                {result.status === "active" ? "Active" : "Inactive"}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mb-2">
                                                            {result.district}, {result.region}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ম্যাপ ডাইনামিক উপাদানটি এখানে কল করা হয়েছে */}
                        <MapComponent
                            mapCenter={mapCenter}
                            zoom={zoom}
                            targetLocation={targetLocation}
                            shouldFly={shouldFly}
                            warehouses={warehouses}
                        />

                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Page;