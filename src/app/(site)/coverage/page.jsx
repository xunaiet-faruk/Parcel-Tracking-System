"use client";

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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

const Page = () => {
    const [mapCenter, setMapCenter] = useState([23.8103, 90.4125]); 
    const [zoom, setZoom] = useState(7);

    // Load warehouses data
    const warehouses = warehousesData;

    // Statistics
    const totalCenters = warehouses.length;
    const activeCenters = warehouses.filter(w => w.status === "active").length;
    const cities = [...new Set(warehouses.map(w => w.city))].length;
    const coveredAreas = [...new Set(warehouses.flatMap(w => w.covered_area))].length;

    return (
        <div className="min-h-screen ">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-[#03373d] to-[#1a5c64] text-white  overflow-hidden rounded-b-4xl">
               

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

           
            <div className="w-full px-6 py-12">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-center mb-8"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold text-[#03373d] mb-4">
                            Find Your Nearest Service  Center
                        </h2>
                        <p className="text-gray-600 text-lg">
                            Click on any marker to view service center details
                        </p>

                        
                    </motion.div>

                    {/* Map Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="border-4 border-white rounded-2xl overflow-hidden shadow-2xl"
                    >
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

                    {/* Legend */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex justify-center gap-6 mt-6"
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">Active Center</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">Inactive Center</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Page;