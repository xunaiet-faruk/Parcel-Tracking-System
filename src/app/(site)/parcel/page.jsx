"use client";

import React, { useEffect, useState } from "react";
import useAxios from "../hooks/useAxios";
import Swal from 'sweetalert2';
import useAuth from "../hooks/useAuth";

const Page = () => {
    const [formData, setFormData] = useState({
        // Parcel Details
        discount: "no",
        parcelName: "",
        parcelWeight: "",

        // Sender Details
        senderName: "",
        senderEmail: "", // Auto-filled from user
        senderAddress: "",
        senderPhone: "",
        senderDistrict: "",
        senderPickupInfo: "",

        // Receiver Details
        receiverName: "",
        receiverEmail: "", // Manual input
        receiverAddress: "",
        receiverPhone: "",
        receiverDistrict: "",
        receiverDeliveryInfo: "",
    });

    const [errors, setErrors] = useState({});
    const [calculatedPrice, setCalculatedPrice] = useState(null);
    const [priceDetails, setPriceDetails] = useState(null);
    const { user } = useAuth();
    const axios = useAxios();

    const districts = [
        "Dhaka", "Chittagong", "Khulna", "Rajshahi", "Sylhet",
        "Barisal", "Rangpur", "Mymensingh", "Comilla", "Narayanganj"
    ];

   
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                senderName: (user.displayName && user.displayName !== "null") ? user.displayName : (user.email ? user.email.split('@')[0] : ""),
                senderEmail: user.email || ""
            }));
        }
    }, [user]);

    const calculatePrice = (weight, receiverDistrict, senderDistrict) => {
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
                    type: "Non-Document (Up to 3kg)",
                    basePrice: 110,
                    extraCharge: 0,
                    total: 110
                };
            } else {
                const extraKg = Math.ceil(weightNum - 3);
                basePrice = 110;
                extraPrice = extraKg * 40;
                priceBreakdown = {
                    type: `Non-Document (>3kg)`,
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
                    type: "Non-Document (Up to 3kg) - Outside District",
                    basePrice: 150,
                    extraCharge: 0,
                    total: 150
                };
            } else {
                const extraKg = Math.ceil(weightNum - 3);
                basePrice = 150;
                extraPrice = (extraKg * 40) + 40;
                priceBreakdown = {
                    type: `Non-Document (>3kg) - Outside District`,
                    basePrice: 150,
                    extraKg: extraKg,
                    extraCharge: extraPrice,
                    total: basePrice + extraPrice
                };
            }
        }

        let finalPrice = priceBreakdown.total;
        let discountAmount = 0;

        if (formData.discount === "yes") {
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
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newFormData = { ...formData, [name]: value };
        setFormData(newFormData);

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }

        if (name === "parcelWeight" || name === "receiverDistrict" || name === "senderDistrict" || name === "discount") {
            calculatePrice(
                name === "parcelWeight" ? value : formData.parcelWeight,
                name === "receiverDistrict" ? value : formData.receiverDistrict,
                name === "senderDistrict" ? value : formData.senderDistrict
            );
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.parcelName) newErrors.parcelName = "Parcel name is required";
        if (!formData.parcelWeight) newErrors.parcelWeight = "Parcel weight is required";
        if (!formData.senderName) newErrors.senderName = "Sender name is required";
        if (!formData.senderEmail) newErrors.senderEmail = "Sender email is required";
        if (!formData.senderAddress) newErrors.senderAddress = "Sender address is required";
        if (!formData.senderPhone) newErrors.senderPhone = "Sender phone is required";
        if (!formData.senderDistrict) newErrors.senderDistrict = "Sender district is required";
        if (!formData.receiverName) newErrors.receiverName = "Receiver name is required";
        if (!formData.receiverEmail) newErrors.receiverEmail = "Receiver email is required";
        if (!formData.receiverAddress) newErrors.receiverAddress = "Receiver address is required";
        if (!formData.receiverPhone) newErrors.receiverPhone = "Receiver phone is required";
        if (!formData.receiverDistrict) newErrors.receiverDistrict = "Receiver district is required";

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.senderEmail && !emailRegex.test(formData.senderEmail)) {
            newErrors.senderEmail = "Invalid email format";
        }
        if (formData.receiverEmail && !emailRegex.test(formData.receiverEmail)) {
            newErrors.receiverEmail = "Invalid email format";
        }

        return newErrors;
    };

    const showConfirmationDialog = () => {
        return Swal.fire({
            title: 'Confirm Booking',
            html: `
                <div style="text-align: left;">
                    <p><strong>Parcel:</strong> ${formData.parcelName}</p>
                    <p><strong>Weight:</strong> ${formData.parcelWeight} kg</p>
                    <p><strong>From:</strong> ${formData.senderDistrict}</p>
                    <p><strong>To:</strong> ${formData.receiverDistrict}</p>
                    <p><strong>Sender Email:</strong> ${formData.senderEmail}</p>
                    <p><strong>Receiver Email:</strong> ${formData.receiverEmail}</p>
                    <p><strong>Total Price:</strong> ৳${Math.round(calculatedPrice)}</p>
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#caeb66',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Book it!',
            cancelButtonText: 'Cancel',
            background: '#fff',
            customClass: {
                popup: 'rounded-2xl',
                confirmButton: 'px-6 py-2 rounded-lg font-semibold text-[#03373d]',
                cancelButton: 'px-6 py-2 rounded-lg font-semibold'
            }
        });
    };

    const showSuccessAlert = () => {
        Swal.fire({
            title: 'Success!',
            text: 'Your parcel has been booked successfully!',
            icon: 'success',
            confirmButtonColor: '#03373d',
            confirmButtonText: 'OK',
            timer: 3000,
            timerProgressBar: true
        });
    };

    const showErrorAlert = (message) => {
        Swal.fire({
            title: 'Error!',
            text: message || 'Failed to book parcel. Please try again.',
            icon: 'error',
            confirmButtonColor: '#d33',
            confirmButtonText: 'OK'
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            showErrorAlert('Please fill all required fields correctly');
            return;
        }

        if (!calculatedPrice) {
            showErrorAlert('Please select sender and receiver districts');
            return;
        }

        const result = await showConfirmationDialog();

        if (result.isConfirmed) {
            try {
                const response = await axios.post('/parcels', {
                    ...formData,
                    totalPrice: Math.round(calculatedPrice),
                    bookingDate: new Date(),
                    status: 'pending'
                });

                console.log("Form submitted:", response.data);
                showSuccessAlert();

                // Reset form (keep sender email and name from user)
                setFormData({
                    discount: "no",
                    parcelName: "",
                    parcelWeight: "",
                    senderName: (user?.displayName && user?.displayName !== "null") ? user.displayName : (user?.email ? user.email.split('@')[0] : ""),
                    senderEmail: user?.email || "",
                    senderAddress: "",
                    senderPhone: "",
                    senderDistrict: "",
                    senderPickupInfo: "",
                    receiverName: "",
                    receiverEmail: "",
                    receiverAddress: "",
                    receiverPhone: "",
                    receiverDistrict: "",
                    receiverDeliveryInfo: "",
                });
                setPriceDetails(null);
                setCalculatedPrice(null);

            } catch (error) {
                console.error("Error submitting form:", error);
                showErrorAlert(error.response?.data?.message || "Error submitting form. Please try again.");
            }
        }
    };

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-[#03373d] mb-4">
                        Send a <span className="text-[#caeb66]">Parcel</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Fast, reliable, and affordable parcel delivery service across Bangladesh.
                        Fill out the form below to schedule your pickup.
                    </p>
                </div>

                {/* Main Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    <div className="p-6 md:p-8">
                        {/* Parcel Details Section */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-[#03373d] mb-4 flex items-center gap-2">
                                <span className="w-1 h-8 bg-[#caeb66] rounded-full"></span>
                                Parcel Details
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Discount Option */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Discount Option
                                    </label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="discount"
                                                value="yes"
                                                checked={formData.discount === "yes"}
                                                onChange={handleChange}
                                                className="w-4 h-4 text-[#03373d]"
                                            />
                                            <span className="text-gray-700">With Discount (10%)</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="discount"
                                                value="no"
                                                checked={formData.discount === "no"}
                                                onChange={handleChange}
                                                className="w-4 h-4 text-[#03373d]"
                                            />
                                            <span className="text-gray-700">Without Discount</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                {/* Parcel Name */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Parcel Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="parcelName"
                                        value={formData.parcelName}
                                        onChange={handleChange}
                                        placeholder="e.g., Documents, Electronics, Clothes"
                                        className={`w-full px-4 py-2 border ${errors.parcelName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#03373d] focus:ring-2 focus:ring-[#03373d]/20`}
                                    />
                                    {errors.parcelName && <p className="text-red-500 text-xs mt-1">{errors.parcelName}</p>}
                                </div>

                                {/* Parcel Weight */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Parcel Weight (kg) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="parcelWeight"
                                        value={formData.parcelWeight}
                                        onChange={handleChange}
                                        placeholder="e.g., 2.5"
                                        step="0.1"
                                        className={`w-full px-4 py-2 border ${errors.parcelWeight ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#03373d] focus:ring-2 focus:ring-[#03373d]/20`}
                                    />
                                    {errors.parcelWeight && <p className="text-red-500 text-xs mt-1">{errors.parcelWeight}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Sender and Receiver Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                            {/* Sender Details */}
                            <div className="bg-gray-50 rounded-2xl p-6">
                                <h2 className="text-2xl font-bold text-[#03373d] mb-4 flex items-center gap-2">
                                    <span className="w-1 h-8 bg-blue-500 rounded-full"></span>
                                    Sender Details
                                </h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Full Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="senderName"
                                            value={formData.senderName}
                                            onChange={handleChange}
                                            placeholder="Enter sender's full name"
                                            className={`w-full px-4 py-2 border ${errors.senderName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#03373d] bg-gray-100`}
                                            readOnly
                                        />
                                        {errors.senderName && <p className="text-red-500 text-xs mt-1">{errors.senderName}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="senderEmail"
                                            value={formData.senderEmail}
                                            onChange={handleChange}
                                            placeholder="sender@example.com"
                                            className={`w-full px-4 py-2 border ${errors.senderEmail ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#03373d] bg-gray-100`}
                                            readOnly
                                        />
                                        {errors.senderEmail && <p className="text-red-500 text-xs mt-1">{errors.senderEmail}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Address <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="senderAddress"
                                            value={formData.senderAddress}
                                            onChange={handleChange}
                                            placeholder="Enter full address"
                                            className={`w-full px-4 py-2 border ${errors.senderAddress ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#03373d]`}
                                        />
                                        {errors.senderAddress && <p className="text-red-500 text-xs mt-1">{errors.senderAddress}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Phone Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="senderPhone"
                                            value={formData.senderPhone}
                                            onChange={handleChange}
                                            placeholder="e.g., 01XXXXXXXXX"
                                            className={`w-full px-4 py-2 border ${errors.senderPhone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#03373d]`}
                                        />
                                        {errors.senderPhone && <p className="text-red-500 text-xs mt-1">{errors.senderPhone}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            District <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="senderDistrict"
                                            value={formData.senderDistrict}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-2 border ${errors.senderDistrict ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#03373d]`}
                                        >
                                            <option value="">Select District</option>
                                            {districts.map(district => (
                                                <option key={district} value={district}>{district}</option>
                                            ))}
                                        </select>
                                        {errors.senderDistrict && <p className="text-red-500 text-xs mt-1">{errors.senderDistrict}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Pickup Information
                                        </label>
                                        <textarea
                                            name="senderPickupInfo"
                                            value={formData.senderPickupInfo}
                                            onChange={handleChange}
                                            rows="2"
                                            placeholder="Additional pickup instructions (e.g., gate code, floor number)"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#03373d]"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            {/* Receiver Details */}
                            <div className="bg-gray-50 rounded-2xl p-6">
                                <h2 className="text-2xl font-bold text-[#03373d] mb-4 flex items-center gap-2">
                                    <span className="w-1 h-8 bg-green-500 rounded-full"></span>
                                    Receiver Details
                                </h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Full Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="receiverName"
                                            value={formData.receiverName}
                                            onChange={handleChange}
                                            placeholder="Enter receiver's full name"
                                            className={`w-full px-4 py-2 border ${errors.receiverName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#03373d]`}
                                        />
                                        {errors.receiverName && <p className="text-red-500 text-xs mt-1">{errors.receiverName}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="receiverEmail"
                                            value={formData.receiverEmail}
                                            onChange={handleChange}
                                            placeholder="receiver@example.com"
                                            className={`w-full px-4 py-2 border ${errors.receiverEmail ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#03373d]`}
                                        />
                                        {errors.receiverEmail && <p className="text-red-500 text-xs mt-1">{errors.receiverEmail}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Address <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="receiverAddress"
                                            value={formData.receiverAddress}
                                            onChange={handleChange}
                                            placeholder="Enter full address"
                                            className={`w-full px-4 py-2 border ${errors.receiverAddress ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#03373d]`}
                                        />
                                        {errors.receiverAddress && <p className="text-red-500 text-xs mt-1">{errors.receiverAddress}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Phone Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="receiverPhone"
                                            value={formData.receiverPhone}
                                            onChange={handleChange}
                                            placeholder="e.g., 01XXXXXXXXX"
                                            className={`w-full px-4 py-2 border ${errors.receiverPhone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#03373d]`}
                                        />
                                        {errors.receiverPhone && <p className="text-red-500 text-xs mt-1">{errors.receiverPhone}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            District <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="receiverDistrict"
                                            value={formData.receiverDistrict}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-2 border ${errors.receiverDistrict ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#03373d]`}
                                        >
                                            <option value="">Select District</option>
                                            {districts.map(district => (
                                                <option key={district} value={district}>{district}</option>
                                            ))}
                                        </select>
                                        {errors.receiverDistrict && <p className="text-red-500 text-xs mt-1">{errors.receiverDistrict}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Delivery Information
                                        </label>
                                        <textarea
                                            name="receiverDeliveryInfo"
                                            value={formData.receiverDeliveryInfo}
                                            onChange={handleChange}
                                            rows="2"
                                            placeholder="Additional delivery instructions (e.g., landmark, preferred time)"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#03373d]"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Price Calculator Section */}
                        {priceDetails && (
                            <div className="mb-8 bg-gradient-to-r from-[#03373d] to-[#1a5c64] rounded-2xl p-6 text-white">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <span className="text-2xl">💰</span>
                                    Delivery Price
                                </h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span>Delivery Type:</span>
                                        <span className="font-semibold">
                                            {priceDetails.isWithinCity ? "Within Same City" : "Outside City/District"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Base Price:</span>
                                        <span>৳{priceDetails.basePrice}</span>
                                    </div>
                                    {priceDetails.extraKg && (
                                        <div className="flex justify-between items-center">
                                            <span>Extra Charge ({priceDetails.extraKg}kg extra):</span>
                                            <span>৳{priceDetails.extraCharge}</span>
                                        </div>
                                    )}
                                    {priceDetails.discount > 0 && (
                                        <div className="flex justify-between items-center text-[#caeb66]">
                                            <span>Discount (10%):</span>
                                            <span>- ৳{Math.round(priceDetails.discount)}</span>
                                        </div>
                                    )}
                                    <div className="border-t border-white/20 pt-2 mt-2">
                                        <div className="flex justify-between items-center text-xl font-bold">
                                            <span>Total Price:</span>
                                            <span className="text-[#caeb66]">৳{Math.round(priceDetails.finalPrice)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="text-center">
                            <button
                                type="submit"
                                className="bg-gradient-to-r from-[#03373d] to-[#1a5c64] text-white px-12 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                            >
                                Submit Parcel Booking
                            </button>
                            <p className="text-sm text-gray-500 mt-4">
                                By submitting, you agree to our terms and conditions
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Page;