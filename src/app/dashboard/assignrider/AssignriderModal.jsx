import React, { useState } from 'react';
import { FaMotorcycle, FaTimes } from 'react-icons/fa';

const AssignRiderModal = ({ ridersLoading, isOpen, onClose, selectedParcel, riders, selectedRider, setSelectedRider, onConfirm, showFallbackRiders }) => {
    const [isLoading, setIsLoading] = useState(false);

    const selectedRiderInfo = riders.find(rider => rider._id === selectedRider);

    const handleConfirmClick = async () => {
        if (!selectedRiderInfo || !selectedParcel) return;

        setIsLoading(true);
        try {
            await onConfirm({
                riderId: selectedRiderInfo._id,
                riderName: selectedRiderInfo.fullName,
                riderEmail: selectedRiderInfo.email || selectedRiderInfo.userEmail || '',
                riderPhone: selectedRiderInfo.phone,
                parentId: selectedParcel._id,
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
                    <h3 className="font-bold flex items-center gap-2"><FaMotorcycle /> Assign Rider</h3>
                    <button onClick={onClose}><FaTimes /></button>
                </div>

                <div className="p-6 overflow-y-auto">
                    {/* Parcel Info Section */}
                    {/* ... (Your Parcel Info UI) ... */}

                    <label className="block text-sm font-semibold mb-3">Available Riders</label>

                    {/* মডাল গায়েব না করে শুধু টেবিলের জায়গায় লোডিং দেখানো */}
                    {ridersLoading ? (
                        <div className="flex flex-col items-center py-10">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                            <p className="mt-2 text-gray-500">Finding riders...</p>
                        </div>
                    ) : riders.length === 0 ? (
                        <div className="text-center py-10 bg-gray-50 rounded-lg">
                            <p className="text-gray-500">No approved riders available in this district.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto border rounded-xl">
                            <table className="w-full text-sm">
                                {/* Table Head and Body */}
                                {riders.map(rider => (
                                    <tr
                                        key={rider._id}
                                        onClick={() => setSelectedRider(rider._id)}
                                        className={`cursor-pointer ${selectedRider === rider._id ? 'bg-blue-50' : ''}`}
                                    >
                                        <td className="p-3">
                                            <input
                                                type="radio"
                                                checked={selectedRider === rider._id}
                                                readOnly
                                            />
                                        </td>
                                        <td className="p-3 font-medium">{rider.fullName}</td>
                                        <td className="p-3">{rider.district}</td>
                                        <td className="p-3">{rider.phone}</td>
                                    </tr>
                                ))}
                            </table>
                        </div>
                    )}
                    {showFallbackRiders && (
                        <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
                            No riders were available in this parcel's district, so all approved available riders are shown instead.
                        </div>
                    )}
                </div>

                {/* Footer buttons */}
                <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600">Cancel</button>
                    <button
                        onClick={handleConfirmClick}
                        disabled={!selectedRider || isLoading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400"
                    >
                        {isLoading ? 'Assigning...' : 'Confirm Assignment'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssignRiderModal;