"use client";

import React, { useState } from "react";
import useAxios from "../hooks/useAxios";
import Swal from "sweetalert2";

const RiderPage = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        district: "",
        vehicleType: "",
        licenseNumber: "",
        experience: "",
        availableHours: "",
        emergencyContact: "",
        emergencyPhone: "",
        termsAccepted: false,
    });

    const [errors, setErrors] = useState({});
    const axios =useAxios()

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
       
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName) newErrors.fullName = "Full name is required";
        if (!formData.email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
        if (!formData.phone) newErrors.phone = "Phone number is required";
        if (!formData.address) newErrors.address = "Address is required";
        if (!formData.district) newErrors.district = "District is required";
        if (!formData.vehicleType) newErrors.vehicleType = "Vehicle type is required";
        if (!formData.licenseNumber) newErrors.licenseNumber = "License number is required";
        if (!formData.experience) newErrors.experience = "Experience is required";
        if (!formData.emergencyContact) newErrors.emergencyContact = "Emergency contact name is required";
        if (!formData.emergencyPhone) newErrors.emergencyPhone = "Emergency phone is required";
        if (!formData.termsAccepted) newErrors.termsAccepted = "You must accept the terms and conditions";

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();

        if (Object.keys(newErrors).length === 0) {
            try {
                const result = await axios.post('/Rider', formData);
                console.log(result.data);
                Swal.fire({
                    title: "Application Submitted 🎉",
                    text: "Your rider application has been received successfully!",
                    icon: "success",
                    confirmButtonText: "OK"
                });

                // ✅ optional: form reset
                setFormData({
                    fullName: "",
                    email: "",
                    phone: "",
                    address: "",
                    district: "",
                    vehicleType: "",
                    licenseNumber: "",
                    experience: "",
                    availableHours: "",
                    emergencyContact: "",
                    emergencyPhone: "",
                    termsAccepted: false,
                });

            } catch (error) {
        
                Swal.fire({
                    title: "Submission Failed ❌",
                    text: error?.response?.data?.message || "Something went wrong. Please try again.",
                    icon: "error",
                    confirmButtonText: "Try Again"
                });
            }
        } else {
            setErrors(newErrors);

            Swal.fire({
                title: "Form Error ⚠️",
                text: "Please fill all required fields correctly.",
                icon: "warning",
            });
        }
    };

    const districts = [
        "Dhaka", "Chittagong", "Khulna", "Rajshahi", "Sylhet",
        "Barisal", "Rangpur", "Mymensingh", "Comilla", "Narayanganj"
    ];

    const vehicleTypes = [
        "Bicycle", "Motorcycle", "Scooter", "CNG", "Car", "Pickup Truck"
    ];

    const experienceOptions = [
        "Less than 6 months",
        "6 months - 1 year",
        "1 - 2 years",
        "2 - 3 years",
        "3 - 5 years",
        "5+ years"
    ];

    return (
        <div className="min-h-screen  py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-[#03373d] mb-4">
                        Join Our <span className="text-[#caeb66]">Rider Team</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Become a part of Bangladesh's fastest-growing delivery network.
                        Flexible hours, competitive earnings, and comprehensive support.
                    </p>
                </div>

                {/* Form and Image Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Side - Form */}
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                        <div className="p-6 md:p-8">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-[#03373d] flex items-center gap-2">
                                    <span className="w-1 h-8 bg-[#caeb66] rounded-full"></span>
                                    Rider Application Form
                                </h2>
                                <p className="text-gray-600 mt-2">Fill out the form below to apply</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Full Name */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                        className={`w-full px-4 py-2 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#03373d] focus:ring-2 focus:ring-[#03373d]/20`}
                                    />
                                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                                </div>

                                {/* Email and Phone - Two columns */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="your@email.com"
                                            className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#03373d]`}
                                        />
                                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Phone Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="01XXXXXXXXX"
                                            className={`w-full px-4 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#03373d]`}
                                        />
                                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                    </div>
                                </div>

                                {/* Address */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Address <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Your full address"
                                        className={`w-full px-4 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#03373d]`}
                                    />
                                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                                </div>

                                {/* District and Vehicle Type */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            District <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="district"
                                            value={formData.district}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-2 border ${errors.district ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#03373d]`}
                                        >
                                            <option value="">Select District</option>
                                            {districts.map(district => (
                                                <option key={district} value={district}>{district}</option>
                                            ))}
                                        </select>
                                        {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Vehicle Type <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="vehicleType"
                                            value={formData.vehicleType}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-2 border ${errors.vehicleType ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#03373d]`}
                                        >
                                            <option value="">Select Vehicle</option>
                                            {vehicleTypes.map(vehicle => (
                                                <option key={vehicle} value={vehicle}>{vehicle}</option>
                                            ))}
                                        </select>
                                        {errors.vehicleType && <p className="text-red-500 text-xs mt-1">{errors.vehicleType}</p>}
                                    </div>
                                </div>

                                {/* License Number and Experience */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            License Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="licenseNumber"
                                            value={formData.licenseNumber}
                                            onChange={handleChange}
                                            placeholder="Your driving license number"
                                            className={`w-full px-4 py-2 border ${errors.licenseNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#03373d]`}
                                        />
                                        {errors.licenseNumber && <p className="text-red-500 text-xs mt-1">{errors.licenseNumber}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Experience <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="experience"
                                            value={formData.experience}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-2 border ${errors.experience ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#03373d]`}
                                        >
                                            <option value="">Select Experience</option>
                                            {experienceOptions.map(exp => (
                                                <option key={exp} value={exp}>{exp}</option>
                                            ))}
                                        </select>
                                        {errors.experience && <p className="text-red-500 text-xs mt-1">{errors.experience}</p>}
                                    </div>
                                </div>

                                {/* Available Hours */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Available Hours
                                    </label>
                                    <input
                                        type="text"
                                        name="availableHours"
                                        value={formData.availableHours}
                                        onChange={handleChange}
                                        placeholder="e.g., 9 AM - 6 PM, Full Time, Part Time"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#03373d]"
                                    />
                                </div>

                                {/* Emergency Contact */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Emergency Contact Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="emergencyContact"
                                            value={formData.emergencyContact}
                                            onChange={handleChange}
                                            placeholder="Emergency contact person"
                                            className={`w-full px-4 py-2 border ${errors.emergencyContact ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#03373d]`}
                                        />
                                        {errors.emergencyContact && <p className="text-red-500 text-xs mt-1">{errors.emergencyContact}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Emergency Phone <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="emergencyPhone"
                                            value={formData.emergencyPhone}
                                            onChange={handleChange}
                                            placeholder="Emergency contact number"
                                            className={`w-full px-4 py-2 border ${errors.emergencyPhone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#03373d]`}
                                        />
                                        {errors.emergencyPhone && <p className="text-red-500 text-xs mt-1">{errors.emergencyPhone}</p>}
                                    </div>
                                </div>

                                {/* Terms and Conditions */}
                                <div className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        name="termsAccepted"
                                        checked={formData.termsAccepted}
                                        onChange={handleChange}
                                        className="mt-1 w-4 h-4 text-[#03373d] focus:ring-[#03373d]"
                                    />
                                    <label className="text-sm text-gray-700">
                                        I agree to the <a href="#" className="text-[#03373d] font-semibold hover:underline">Terms and Conditions</a> and confirm that all information provided is accurate.
                                        {errors.termsAccepted && <p className="text-red-500 text-xs mt-1">{errors.termsAccepted}</p>}
                                    </label>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-[#03373d] to-[#1a5c64] text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                                >
                                    Submit Application
                                </button>

                                <p className="text-xs text-gray-500 text-center">
                                    We'll review your application and get back to you within 2-3 business days
                                </p>
                            </form>
                        </div>
                    </div>

                    {/* Right Side - Rider Image and Benefits */}
                    <div className="space-y-6">
                        {/* Main Image */}
                        <div className="bg-gradient-to-br from-[#03373d] to-[#1a5c64] rounded-3xl overflow-hidden shadow-2xl">
                            <div className="relative h-96">
                                <img
                                    src="/assets/agent-pending.png"
                                    alt="Delivery Rider"
                                    className="w-full h-full object-cover "
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                    <h3 className="text-2xl font-bold mb-2">Join Our Team</h3>
                                    <p className="text-sm">Flexible hours • Competitive pay • Insurance coverage</p>
                                </div>
                            </div>
                        </div>

                        {/* Benefits Cards */}
                        <div className="bg-white rounded-3xl shadow-xl p-6">
                            <h3 className="text-xl font-bold text-[#03373d] mb-4 flex items-center gap-2">
                                <span className="text-2xl">🎯</span>
                                Why Join Zapwork?
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="text-green-500 text-xl">✓</div>
                                    <div>
                                        <p className="font-semibold text-gray-800">Earn Up to ৳30,000/month</p>
                                        <p className="text-sm text-gray-600">Competitive earnings with performance bonuses</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="text-green-500 text-xl">✓</div>
                                    <div>
                                        <p className="font-semibold text-gray-800">Flexible Working Hours</p>
                                        <p className="text-sm text-gray-600">Choose your own schedule - full time or part time</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="text-green-500 text-xl">✓</div>
                                    <div>
                                        <p className="font-semibold text-gray-800">Free Training & Support</p>
                                        <p className="text-sm text-gray-600">Professional training and 24/7 rider support</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="text-green-500 text-xl">✓</div>
                                    <div>
                                        <p className="font-semibold text-gray-800">Insurance & Benefits</p>
                                        <p className="text-sm text-gray-600">Accident insurance and health benefits included</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Requirements */}
                        <div className="bg-gray-50 rounded-3xl p-6 border border-gray-200">
                            <h3 className="text-xl font-bold text-[#03373d] mb-3 flex items-center gap-2">
                                <span className="text-2xl">📋</span>
                                Requirements
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li className="flex items-center gap-2">• Valid driving license</li>
                                <li className="flex items-center gap-2">• Own vehicle (bike/scooter/car)</li>
                                <li className="flex items-center gap-2">• Smartphone with internet connection</li>
                                <li className="flex items-center gap-2">• Good knowledge of local areas</li>
                                <li className="flex items-center gap-2">• Minimum 18 years of age</li>
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div className="bg-[#caeb66] rounded-3xl p-6 text-center">
                            <p className="text-[#03373d] font-semibold mb-2">Questions?</p>
                            <p className="text-sm text-gray-800">Call us at <span className="font-bold">+880 1234 567890</span></p>
                            <p className="text-sm text-gray-800">Email: <span className="font-bold">careers@zapwork.com</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RiderPage;