"use client";
import React, { useState, useEffect } from 'react';
import useAxios from '@/app/(site)/hooks/useAxios';
import Swal from 'sweetalert2';

const UpdateField = ({ editParcel, setEditParcel, refetch }) => {
    const axios = useAxios();
    const [loading, setLoading] = useState(false);
    const [priceDetails, setPriceDetails] = useState(null);
    const [calculatedPrice, setCalculatedPrice] = useState(null);

    const districts = [
        "Dhaka", "Chittagong", "Khulna", "Rajshahi", "Sylhet",
        "Barisal", "Rangpur", "Mymensingh", "Comilla", "Narayanganj"
    ];

    const [formData, setFormData] = useState({
        parcelName: '',
        parcelWeight: '',
        receiverName: '',
        receiverEmail: '',
        receiverAddress: '',
        receiverPhone: '',
        receiverDistrict: '',
        receiverDeliveryInfo: '',
        discount: 'no',
        totalPrice: '',
        senderDistrict: ''
    });

    useEffect(() => {
        if (editParcel) {
            setFormData({
                parcelName: editParcel.parcelName || '',
                parcelWeight: editParcel.parcelWeight || '',
                receiverName: editParcel.receiverName || '',
                receiverEmail: editParcel.receiverEmail || '',
                receiverAddress: editParcel.receiverAddress || '',
                receiverPhone: editParcel.receiverPhone || '',
                receiverDistrict: editParcel.receiverDistrict || '',
                receiverDeliveryInfo: editParcel.receiverDeliveryInfo || '',
                discount: editParcel.discount || 'no',
                totalPrice: editParcel.totalPrice || '',
                senderDistrict: editParcel.senderDistrict || ''
            });

            // Calculate price when editParcel loads
            if (editParcel.parcelWeight && editParcel.receiverDistrict && editParcel.senderDistrict) {
                calculatePrice(
                    editParcel.parcelWeight,
                    editParcel.receiverDistrict,
                    editParcel.senderDistrict,
                    editParcel.discount
                );
            }
        }
    }, [editParcel]);

    const calculatePrice = (weight, receiverDistrict, senderDistrict, discount) => {
        if (!weight || !receiverDistrict || !senderDistrict) {
            setCalculatedPrice(null);
            setPriceDetails(null);
            return;
        }

        const weightNum = parseFloat(weight);
        if (isNaN(weightNum)) {
            setCalculatedPrice(null);
            setPriceDetails(null);
            return;
        }

        const isWithinCity = senderDistrict === receiverDistrict;

        let basePrice = 0;
        let extraPrice = 0;
        let priceBreakdown = {};

        if (isWithinCity) {
            if (weightNum <= 3) {
                basePrice = 110;
                priceBreakdown = {
                    type: "Within Same City (Up to 3kg)",
                    basePrice: 110,
                    extraCharge: 0,
                    total: 110
                };
            } else {
                const extraKg = Math.ceil(weightNum - 3);
                basePrice = 110;
                extraPrice = extraKg * 40;
                priceBreakdown = {
                    type: `Within Same City (>3kg)`,
                    basePrice: 110,
                    extraKg: extraKg,
                    extraCharge: extraPrice,
                    total: basePrice + extraPrice
                };
            }
        } else {
            if (weightNum <= 3) {
                basePrice = 150;
                priceBreakdown = {
                    type: "Outside District (Up to 3kg)",
                    basePrice: 150,
                    extraCharge: 0,
                    total: 150
                };
            } else {
                const extraKg = Math.ceil(weightNum - 3);
                basePrice = 150;
                extraPrice = (extraKg * 40) + 40;
                priceBreakdown = {
                    type: `Outside District (>3kg)`,
                    basePrice: 150,
                    extraKg: extraKg,
                    extraCharge: extraPrice,
                    total: basePrice + extraPrice
                };
            }
        }

        let finalPrice = priceBreakdown.total;
        let discountAmount = 0;

        if (discount === "yes") {
            discountAmount = finalPrice * 0.10;
            finalPrice = finalPrice - discountAmount;
        }

        setPriceDetails({
            ...priceBreakdown,
            discount: discountAmount,
            finalPrice: finalPrice,
            isWithinCity: isWithinCity
        });

        setCalculatedPrice(finalPrice);

        // Auto update total price in form
        setFormData(prev => ({
            ...prev,
            totalPrice: Math.round(finalPrice)
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newFormData = { ...formData, [name]: value };
        setFormData(newFormData);

        // Recalculate price when relevant fields change
        if (name === "parcelWeight" || name === "receiverDistrict" || name === "discount") {
            calculatePrice(
                name === "parcelWeight" ? value : formData.parcelWeight,
                name === "receiverDistrict" ? value : formData.receiverDistrict,
                formData.senderDistrict,
                name === "discount" ? value : formData.discount
            );
        }
    };

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const updateData = {
                ...formData,
                totalPrice: Math.round(calculatedPrice || formData.totalPrice)
            };

            const response = await axios.put(`/parcels/${editParcel._id}`, updateData);

            if (response.data.modifiedCount > 0) {
                Swal.fire({
                    title: "Updated!",
                    text: "Your parcel has been updated successfully!",
                    icon: "success",
                    confirmButtonColor: "#03373d"
                });
                setEditParcel(null);
                refetch();
            } else {
                Swal.fire({
                    title: "No Changes",
                    text: "No changes were made to the parcel.",
                    icon: "info",
                    confirmButtonColor: "#03373d"
                });
            }
        } catch (error) {
            console.error("Update failed:", error);
            Swal.fire({
                title: "Error!",
                text: "Failed to update parcel.",
                icon: "error",
                confirmButtonColor: "#03373d"
            });
        } finally {
            setLoading(false);
        }
    };

    if (!editParcel) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white px-6 pt-6 pb-3 border-b">
                    <h2 className="text-xl font-bold text-[#03373d]">Update Parcel</h2>
                    <p className="text-sm text-gray-500 mt-1">Edit parcel information - price updates automatically</p>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Parcel Name</label>
                        <input
                            name="parcelName"
                            value={formData.parcelName}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#03373d]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                        <input
                            name="parcelWeight"
                            type="number"
                            step="0.1"
                            value={formData.parcelWeight}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#03373d]"
                        />
                        <p className="text-xs text-gray-500 mt-1">Changing weight will update price automatically</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sender District</label>
                        <input
                            type="text"
                            value={formData.senderDistrict}
                            className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100"
                            readOnly
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Receiver District</label>
                        <select
                            name="receiverDistrict"
                            value={formData.receiverDistrict}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#03373d]"
                        >
                            <option value="">Select District</option>
                            {districts.map(district => (
                                <option key={district} value={district}>{district}</option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Changing district will update price automatically</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Receiver Name</label>
                        <input
                            name="receiverName"
                            value={formData.receiverName}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#03373d]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Receiver Email</label>
                        <input
                            name="receiverEmail"
                            type="email"
                            value={formData.receiverEmail}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#03373d]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Receiver Address</label>
                        <input
                            name="receiverAddress"
                            value={formData.receiverAddress}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#03373d]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Receiver Phone</label>
                        <input
                            name="receiverPhone"
                            value={formData.receiverPhone}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#03373d]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Info</label>
                        <textarea
                            name="receiverDeliveryInfo"
                            value={formData.receiverDeliveryInfo}
                            onChange={handleChange}
                            rows="2"
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#03373d]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Discount Option</label>
                        <select
                            name="discount"
                            value={formData.discount}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#03373d]"
                        >
                            <option value="no">No Discount</option>
                            <option value="yes">With Discount (10%)</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Changing discount will update price automatically</p>
                    </div>

                    {/* Price Details Section */}
                    {priceDetails && (
                        <div className="bg-gradient-to-r from-[#03373d] to-[#1a5c64] rounded-lg p-4 text-white">
                            <h3 className="text-sm font-bold mb-2">💰 Price Breakdown</h3>
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span>Delivery Type:</span>
                                    <span className="font-semibold">
                                        {priceDetails.isWithinCity ? "📍 Within Same City" : "🚚 Outside District"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Base Price:</span>
                                    <span>৳{priceDetails.basePrice}</span>
                                </div>
                                {priceDetails.extraKg && (
                                    <div className="flex justify-between">
                                        <span>Extra Charge ({priceDetails.extraKg}kg extra):</span>
                                        <span>৳{priceDetails.extraCharge}</span>
                                    </div>
                                )}
                                {priceDetails.discount > 0 && (
                                    <div className="flex justify-between text-[#caeb66]">
                                        <span>Discount (10%):</span>
                                        <span>- ৳{Math.round(priceDetails.discount)}</span>
                                    </div>
                                )}
                                <div className="border-t border-white/20 pt-2 mt-2">
                                    <div className="flex justify-between font-bold">
                                        <span>Total Price:</span>
                                        <span className="text-[#caeb66]">৳{Math.round(priceDetails.finalPrice)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Total Price (Auto-calculated)</label>
                        <input
                            name="totalPrice"
                            type="number"
                            readOnly
                            value={Math.round(calculatedPrice || formData.totalPrice)}
                            className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100"
                        />
                    </div>
                </div>

                <div className="sticky bottom-0 bg-white px-6 py-4 border-t flex gap-3">
                    <button
                        onClick={handleUpdate}
                        disabled={loading}
                        className={`flex-1 bg-[#03373d] text-white px-4 py-2 rounded-lg hover:bg-[#1a5c64] transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Updating...' : 'Update Parcel'}
                    </button>
                    <button
                        onClick={() => setEditParcel(null)}
                        className="flex-1 border border-red-500 text-red-500 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateField;