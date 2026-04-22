"use client";

import React, { useEffect, useState } from "react";
import useAxios from "../hooks/useAxios";
import Swal from "sweetalert2";
import useAuth from "../hooks/useAuth";
import useRiderApplication from "../hooks/useRiderApplication";

const RiderPage = () => {
    const { user } = useAuth();
    const axios = useAxios();
    const { applicationStatus, isLoading, canApply, isApproved, isRejected, isPending, refetch } = useRiderApplication();

    const [formData, setFormData] = useState({
        fullName: "",
        email: user?.email || "",
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

    useEffect(() => {
        if (isApproved) {
            Swal.fire({
                title: "Already Approved! 🎉",
                text: "You are already an approved rider. You cannot submit another application.",
                icon: "info",
                confirmButtonText: "OK"
            });
        }
    }, [isApproved]);

    useEffect(() => {
        if (isRejected && applicationStatus?.application) {
            const existingData = applicationStatus.application;
            setFormData({
                fullName: existingData.fullName || "",
                email: user?.email || "",
                phone: existingData.phone || "",
                address: existingData.address || "",
                district: existingData.district || "",
                vehicleType: existingData.vehicleType || "",
                licenseNumber: existingData.licenseNumber || "",
                experience: existingData.experience || "",
                availableHours: existingData.availableHours || "",
                emergencyContact: existingData.emergencyContact || "",
                emergencyPhone: existingData.emergencyPhone || "",
                termsAccepted: false,
            });
        }
    }, [isRejected, applicationStatus, user?.email]);

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

        if (!canApply) {
            if (isApproved) {
                Swal.fire({
                    title: "Already Approved ✅",
                    text: "You are already an approved rider. You cannot submit another application.",
                    icon: "info",
                    confirmButtonText: "OK"
                });
            } else if (isPending) {
                Swal.fire({
                    title: "Application Pending ⏳",
                    text: "You already have a pending application. Please wait for review.",
                    icon: "info",
                    confirmButtonText: "OK"
                });
            }
            return;
        }

        const newErrors = validateForm();

        if (Object.keys(newErrors).length === 0) {
            try {
                const result = await axios.post('/Rider', formData);
                console.log(result.data);

                await refetch();

                Swal.fire({
                    title: "Application Submitted 🎉",
                    text: "Your rider application has been received successfully!",
                    icon: "success",
                    confirmButtonText: "OK"
                });

                if (!isRejected) {
                    setFormData({
                        fullName: "",
                        email: user?.email || "",
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
                }

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

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#03373d] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading application status...</p>
                </div>
            </div>
        );
    }

  
    if (isApproved) {
        return (
            <div className="min-h-screen py-12 ">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-gradient-to-br from-[#03373d] to-[#1a5c64] backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20">
                        <div className="p-8 text-center">
                            <div className="w-28 h-28 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce">
                                <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-4xl font-bold text-white mb-4">Welcome Aboard! 🎉</h2>
                            <p className="text-xl text-white/90 mb-8">
                                Congratulations! Your application has been approved.
                                You're now an official rider of Zapwork.
                            </p>
                            <div className="bg-white rounded-2xl p-6 text-left max-w-md mx-auto shadow-xl">
                                <h3 className="font-bold text-gray-800 mb-4 text-lg flex items-center gap-2">
                                    <span>📋</span> Your Information
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center border-b pb-2">
                                        <span className="text-gray-500">Full Name</span>
                                        <span className="font-medium text-gray-800">{applicationStatus?.application?.fullName}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b pb-2">
                                        <span className="text-gray-500">Email</span>
                                        <span className="font-medium text-gray-800">{applicationStatus?.application?.email}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b pb-2">
                                        <span className="text-gray-500">Phone</span>
                                        <span className="font-medium text-gray-800">{applicationStatus?.application?.phone}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500">Vehicle</span>
                                        <span className="font-medium text-gray-800">{applicationStatus?.application?.vehicleType}</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => window.location.href = '/dashboard/rider'}
                                className="mt-8 px-8 py-3 bg-white text-[#03373d] rounded-xl font-bold hover:shadow-xl transition-all hover:scale-105"
                            >
                                Go to Dashboard →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Status Banners */}
                {isRejected && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-lg p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="text-2xl">⚠️</div>
                            <div>
                                <p className="font-semibold text-red-800">Application Rejected</p>
                                <p className="text-sm text-red-600">Please update your information and submit again.</p>
                            </div>
                        </div>
                    </div>
                )}

                {isPending && (
                    <div className="mb-6 bg-amber-50 border-l-4 border-amber-500 rounded-lg p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="text-2xl">⏳</div>
                            <div>
                                <p className="font-semibold text-amber-800">Application Under Review</p>
                                <p className="text-sm text-amber-600">Your application is being reviewed. You'll be notified soon.</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Header */}
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
                                <p className="text-gray-600 mt-2">
                                    {isRejected ? "Please update your information and apply again" : "Fill out the form below to apply"}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        disabled={isPending}
                                        placeholder="Enter your full name"
                                        className={`w-full px-4 py-2 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#03373d] focus:ring-2 focus:ring-[#03373d]/20 ${isPending ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                    />
                                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                value={user?.email || ""}
                                                disabled
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                                            />
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Phone <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            disabled={isPending}
                                            placeholder="01XXXXXXXXX"
                                            className={`w-full px-4 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#03373d] ${isPending ? 'bg-gray-100' : ''}`}
                                        />
                                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Address <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        disabled={isPending}
                                        placeholder="Your full address"
                                        className={`w-full px-4 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#03373d] ${isPending ? 'bg-gray-100' : ''}`}
                                    />
                                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            District <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="district"
                                            value={formData.district}
                                            onChange={handleChange}
                                            disabled={isPending}
                                            className={`w-full px-4 py-2 border ${errors.district ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#03373d] ${isPending ? 'bg-gray-100' : ''}`}
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
                                            disabled={isPending}
                                            className={`w-full px-4 py-2 border ${errors.vehicleType ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#03373d] ${isPending ? 'bg-gray-100' : ''}`}
                                        >
                                            <option value="">Select Vehicle</option>
                                            {vehicleTypes.map(vehicle => (
                                                <option key={vehicle} value={vehicle}>{vehicle}</option>
                                            ))}
                                        </select>
                                        {errors.vehicleType && <p className="text-red-500 text-xs mt-1">{errors.vehicleType}</p>}
                                    </div>
                                </div>

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
                                            disabled={isPending}
                                            placeholder="License number"
                                            className={`w-full px-4 py-2 border ${errors.licenseNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#03373d] ${isPending ? 'bg-gray-100' : ''}`}
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
                                            disabled={isPending}
                                            className={`w-full px-4 py-2 border ${errors.experience ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#03373d] ${isPending ? 'bg-gray-100' : ''}`}
                                        >
                                            <option value="">Select Experience</option>
                                            {experienceOptions.map(exp => (
                                                <option key={exp} value={exp}>{exp}</option>
                                            ))}
                                        </select>
                                        {errors.experience && <p className="text-red-500 text-xs mt-1">{errors.experience}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Available Hours
                                    </label>
                                    <input
                                        type="text"
                                        name="availableHours"
                                        value={formData.availableHours}
                                        onChange={handleChange}
                                        disabled={isPending}
                                        placeholder="e.g., 9 AM - 6 PM, Full Time"
                                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#03373d] ${isPending ? 'bg-gray-100' : ''}`}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Emergency Contact <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="emergencyContact"
                                            value={formData.emergencyContact}
                                            onChange={handleChange}
                                            disabled={isPending}
                                            placeholder="Emergency contact name"
                                            className={`w-full px-4 py-2 border ${errors.emergencyContact ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#03373d] ${isPending ? 'bg-gray-100' : ''}`}
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
                                            disabled={isPending}
                                            placeholder="Emergency phone"
                                            className={`w-full px-4 py-2 border ${errors.emergencyPhone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#03373d] ${isPending ? 'bg-gray-100' : ''}`}
                                        />
                                        {errors.emergencyPhone && <p className="text-red-500 text-xs mt-1">{errors.emergencyPhone}</p>}
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        name="termsAccepted"
                                        checked={formData.termsAccepted}
                                        onChange={handleChange}
                                        disabled={isPending}
                                        className="mt-1 w-4 h-4 text-[#03373d]"
                                    />
                                    <label className="text-sm text-gray-700">
                                        I agree to the Terms and Conditions
                                        {errors.termsAccepted && <p className="text-red-500 text-xs mt-1">{errors.termsAccepted}</p>}
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className={`w-full py-3 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 ${isPending
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-[#03373d] to-[#1a5c64] text-white hover:shadow-xl hover:scale-[1.02]'
                                        }`}
                                >
                                    {isPending ? 'Application Pending...' : isRejected ? 'Submit New Application' : 'Submit Application'}
                                </button>

                                <p className="text-xs text-gray-500 text-center">
                                    {isPending
                                        ? "Your application is being reviewed. You'll be notified soon."
                                        : "We'll review your application and get back to you within 2-3 business days"}
                                </p>
                            </form>
                        </div>
                    </div>

                    {/* Right Side - Image and Benefits */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-[#03373d] to-[#1a5c64] rounded-3xl overflow-hidden shadow-2xl">
                            <div className="relative h-96">
                                <img
                                    src="/assets/agent-pending.png"
                                    alt="Delivery Rider"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                    <h3 className="text-2xl font-bold mb-2">Join Our Team</h3>
                                    <p className="text-sm">Flexible hours • Competitive pay • Insurance coverage</p>
                                </div>
                            </div>
                        </div>

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
                                        <p className="text-sm text-gray-600">Competitive earnings with bonuses</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="text-green-500 text-xl">✓</div>
                                    <div>
                                        <p className="font-semibold text-gray-800">Flexible Hours</p>
                                        <p className="text-sm text-gray-600">Choose your own schedule</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="text-green-500 text-xl">✓</div>
                                    <div>
                                        <p className="font-semibold text-gray-800">Free Training</p>
                                        <p className="text-sm text-gray-600">Professional training & support</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="text-green-500 text-xl">✓</div>
                                    <div>
                                        <p className="font-semibold text-gray-800">Insurance</p>
                                        <p className="text-sm text-gray-600">Accident & health benefits</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-3xl p-6 border border-gray-200">
                            <h3 className="text-xl font-bold text-[#03373d] mb-3">📋 Requirements</h3>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li>• Valid driving license</li>
                                <li>• Own vehicle (bike/scooter/car)</li>
                                <li>• Smartphone with internet</li>
                                <li>• Good knowledge of local areas</li>
                                <li>• Minimum 18 years of age</li>
                            </ul>
                        </div>

                        <div className="bg-[#caeb66] rounded-3xl p-6 text-center">
                            <p className="text-[#03373d] font-semibold mb-2">Questions?</p>
                            <p className="text-sm text-gray-800">Call: <span className="font-bold">+880 1234 567890</span></p>
                            <p className="text-sm text-gray-800">Email: <span className="font-bold">careers@zapwork.com</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RiderPage;