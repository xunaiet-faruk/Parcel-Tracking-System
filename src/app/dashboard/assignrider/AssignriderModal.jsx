"use client";
import React, { useState } from 'react';
import { FaMotorcycle, FaTimes, FaUser, FaEnvelope, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';

const AssignRiderModal = ({ isOpen, onClose, selectedParcel, riders, selectedRider, setSelectedRider, onConfirm }) => {
    const [selectedRow, setSelectedRow] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSelectRider = (riderId) => {
        setSelectedRow(riderId);
        setSelectedRider(riderId);
    };

    const handleConfirmClick = async () => {
        const selectedRiderObject = riders.find(rider => rider._id === selectedRider);

        if (selectedRiderObject) {
            const riderInfo = {
                riderId: selectedRiderObject._id,
                riderName: selectedRiderObject.fullName || selectedRiderObject.name,
                riderEmail: selectedRiderObject.email,
                riderPhone: selectedRiderObject.phone,
                parentId: selectedParcel?._id,
                deliverystatus: 'assigned',
                assignedAt: new Date()
            };

            setIsLoading(true);
            try {
          
                await onConfirm(riderInfo);
                onClose(); 
            } catch (error) {
                console.error('Assignment error:', error);
            } finally {
                setIsLoading(false);
            }
        } else {
            console.error('No rider selected');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden transform transition-all flex flex-col">
                {/* Modal Header */}
                <div className="bg-blue-600 p-4 flex justify-between items-center text-white sticky top-0 z-10">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <FaMotorcycle /> Assign Rider to Parcel
                    </h3>
                    <button onClick={onClose} className="hover:rotate-90 transition-transform">
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto flex-1">
                    {/* Parcel Information */}
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <h4 className="font-semibold text-blue-800 mb-2">Parcel Information</h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <p className="text-gray-600">Tracking ID:</p>
                                <p className="font-mono font-bold text-blue-700">{selectedParcel?.trackingId}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Parcel Name:</p>
                                <p className="font-medium text-gray-800">{selectedParcel?.parcelName}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Sender District:</p>
                                <p className="font-medium text-gray-800">{selectedParcel?.senderDistrict}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Delivery Fee:</p>
                                <p className="font-semibold text-green-600">${selectedParcel?.totalPrice}</p>
                            </div>
                        </div>
                    </div>

                    {/* Riders Table */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Select Available Rider ({riders?.length} available)
                        </label>

                        {riders?.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 rounded-lg">
                                <FaMotorcycle className="text-5xl text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">No available riders found in {selectedParcel?.senderDistrict} district</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto border border-gray-200 rounded-xl">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Select
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Rider Name
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                District
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Phone
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Vehicle
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {riders?.map((rider) => (
                                            <tr
                                                key={rider._id}
                                                className={`cursor-pointer transition-colors ${selectedRow === rider._id
                                                    ? 'bg-blue-50 border-l-4 border-l-blue-500'
                                                    : 'hover:bg-gray-50'
                                                    }`}
                                                onClick={() => handleSelectRider(rider._id)}
                                            >
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="radio"
                                                        name="rider"
                                                        value={rider._id}
                                                        checked={selectedRider === rider._id}
                                                        onChange={() => handleSelectRider(rider._id)}
                                                        className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="bg-blue-100 rounded-full p-1">
                                                            <FaUser className="text-blue-600 text-xs" />
                                                        </div>
                                                        <span className="font-medium text-gray-800">{rider.fullName || rider.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-1">
                                                        <FaMapMarkerAlt className="text-gray-400 text-xs" />
                                                        <span className="text-gray-600">{rider.district}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-1">
                                                        <FaEnvelope className="text-gray-400 text-xs" />
                                                        <span className="text-gray-600 text-sm">{rider.email}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="text-gray-600">{rider.phone}</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-1">
                                                        <FaMotorcycle className="text-gray-400 text-xs" />
                                                        <span className="text-gray-600 text-sm">{rider.vehicleType || 'Motorcycle'}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Modal Footer Buttons */}
                <div className="p-6 bg-gray-50 border-t border-gray-200 flex gap-3 sticky bottom-0">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirmClick}
                        disabled={!selectedRider || riders?.length === 0 || isLoading}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg transition-colors font-semibold ${(!selectedRider || riders?.length === 0 || isLoading)
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-blue-700'
                            }`}
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Assigning...
                            </>
                        ) : (
                            <>
                                <FaCheckCircle />
                                Confirm Assignment
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssignRiderModal;