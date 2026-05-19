"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet icon issue
if (typeof window !== "undefined") {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });
}

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

const MapComponent = ({ mapCenter, zoom, targetLocation, shouldFly, warehouses }) => {
    return (
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
    );
};

export default MapComponent;