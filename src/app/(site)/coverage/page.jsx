"use client";

import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import warehousesData from "@/app/data/warehouses.json";
import { motion } from "framer-motion";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom marker icons for different status
const getMarkerIcon = (status) => {
    const iconUrl = status === "active"
        ? "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png"
        : "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png";

    return L.icon({
        iconUrl: iconUrl,
        iconRetinaUrl: iconUrl,
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
};

// Component to handle map flyTo
const MapController = ({ center, zoom, shouldFly }) => {
    const map = useMap();

    useEffect(() => {
        if (shouldFly && center) {
            map.flyTo(center, zoom, {
                duration: 1.5,
                easeLinearity: 0.5
            });
        }
    }, [center, zoom, shouldFly, map]);

    return null;
};

const Page = () => {
    const [mapCenter, setMapCenter] = useState([23.8103, 90.4125]);
    const [zoom, setZoom] = useState(7);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [shouldFly, setShouldFly] = useState(false);
    const [targetLocation, setTargetLocation] = useState(null);
    const searchInputRef = useRef(null);

    // Load warehouses data
    const warehouses = warehousesData;

    // Statistics
    const totalCenters = warehouses.length;
    const activeCenters = warehouses.filter(w => w.status === "active").length;
    const cities = [...new Set(warehouses.map(w => w.city))].length;
    const coveredAreas = [...new Set(warehouses.flatMap(w => w.covered_area))].length;

    // Search function
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

    // Focus on selected location with smooth animation
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

    return (
        <div className="min-h-screen">
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
                                        placeholder="Search by city, district, region, or covered area... (e.g., Dhaka, Chittagong, Uttara)"
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
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
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
                                                            <span className={`text-xs px-2 py-1 rounded-full ${result.status === "active"
                                                                ? "bg-green-100 text-green-600"
                                                                : "bg-red-100 text-red-600"
                                                                }`}>
                                                                {result.status === "active" ? "Active" : "Inactive"}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mb-2">
                                                            {result.district}, {result.region}
                                                        </p>
                                                        <div className="flex flex-wrap gap-1">
                                                            {result.covered_area.slice(0, 3).map((area, i) => (
                                                                <span key={i} className="bg-gray-100 px-2 py-1 rounded-md text-xs">
                                                                    {area}
                                                                </span>
                                                            ))}
                                                            {result.covered_area.length > 3 && (
                                                                <span className="text-xs text-gray-500">
                                                                    +{result.covered_area.length - 3} more
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="ml-4 text-[#03373d] opacity-0 group-hover:opacity-100 transition">
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* No Results Message */}
                                {showResults && searchQuery && searchResults.length === 0 && (
                                    <div className="absolute w-full mt-2 bg-white rounded-xl shadow-2xl p-6 text-center z-20">
                                        <p className="text-gray-600">No service centers found matching "{searchQuery}"</p>
                                        <p className="text-sm text-gray-500 mt-2">Try searching by city, district, or covered area</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Map */}
                        <MapContainer
                            center={mapCenter}
                            zoom={zoom}
                            scrollWheelZoom={true}
                            style={{ height: "600px", width: "100%" }}
                            className="z-0"
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            <MapController
                                center={targetLocation ? [targetLocation.lat, targetLocation.lng] : mapCenter}
                                zoom={targetLocation ? targetLocation.zoom : zoom}
                                shouldFly={shouldFly}
                            />

                            {warehouses.map((center, index) => (
                                <Marker
                                    key={index}
                                    position={[center.latitude, center.longitude]}
                                    icon={getMarkerIcon(center.status)}
                                >
                                    <Popup>
                                        <div className="p-3 min-w-[290px]">
                                            <div className="mb-3">
                                                <h3 className="font-bold text-xl mb-1 text-gray-800">
                                                    {center.city}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {center.district}, {center.region}
                                                </p>
                                            </div>

                                            <div className="space-y-2 text-sm border-t border-gray-200 pt-3">
                                                <div className="flex justify-between">
                                                    <span className="font-semibold text-gray-700">Status:</span>
                                                    <span className={center.status === "active" ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                                                        {center.status === "active" ? "🟢 Active" : "🔴 Inactive"}
                                                    </span>
                                                </div>

                                                <div>
                                                    <span className="font-semibold text-gray-700 block mb-2">Covered Areas:</span>
                                                    <div className="flex flex-wrap gap-1">
                                                        {center.covered_area.map((area, i) => (
                                                            <span key={i} className="bg-gray-100 px-2 py-1 rounded-md text-xs">
                                                                {area}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                {center.flowchart && (
                                                    <a
                                                        href={center.flowchart}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-block mt-2 text-blue-600 hover:text-blue-700 text-sm font-semibold"
                                                    >
                                                        View Process Flow →
                                                    </a>
                                                )}
                                            </div>

                                            <button className="mt-4 w-full bg-gradient-to-r from-[#03373d] to-[#1a5c64] text-white py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition">
                                                Book Service Here
                                            </button>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </motion.div>

                    {/* Instruction Text */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-center mt-4"
                    >
                        <p className="text-sm text-gray-500">
                            💡 Tip: Type any city, district, or area name in the search box above the map
                        </p>
                    </motion.div>

                    {/* Legend */}
                    <div className="flex justify-center gap-6 mt-6">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">Active Center</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">Inactive Center</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;