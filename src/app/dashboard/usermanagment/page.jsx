"use client";
import useAuth from "@/app/(site)/hooks/useAuth";
import useAxios from "@/app/(site)/hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import {
    HiOutlineEye,
    HiOutlinePencilAlt,
    HiOutlineTrash,
    HiOutlineChevronLeft,
    HiOutlineChevronRight,
    HiOutlineShieldCheck,
    HiOutlineUser,
    HiOutlineChevronDown,
    HiOutlineX
} from "react-icons/hi";
import AdminRouters from "../AdminRoutes/AdminRouters";
import Loading from "@/app/components/Loading";

const UsermanagMent = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState("All");
    const [usersList, setUsersList] = useState([]);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedRole, setSelectedRole] = useState("");
    const { user } = useAuth();
    const axios = useAxios();
    const itemsPerPage = 5;

    const { data: Allusers = [], refetch, isLoading } = useQuery({
        queryKey: ['Allusers', user?.email],
        queryFn: async () => {
            const res = await axios.get('/users');
            console.log("All users data:", res.data);
            const normalizedData = res.data.map(u => ({
                ...u,
                role: u.role ? (u.role.charAt(0).toUpperCase() + u.role.slice(1).toLowerCase()) : 'User'
            }));
            return normalizedData;
        }
    });

    useEffect(() => {
        if (Allusers && Allusers.length > 0) {
            setUsersList(Allusers);
            console.log("Normalized users:", Allusers);
            const adminCount = Allusers.filter(u => u.role === "Admin").length;
            const riderCount = Allusers.filter(u => u.role === "Rider").length;
            console.log("Admin count:", adminCount, "Rider count:", riderCount);
        }
    }, [Allusers]);

    const filteredUsers = usersList.filter(user => {
        if (activeTab === "All") return true;
        if (activeTab === "Rider") return user.role === "Rider";
        if (activeTab === "Admin") return user.role === "Admin";
        return true;
    });

    console.log("Active Tab:", activeTab);
    console.log("Filtered users count:", filteredUsers.length);

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getRoleIcon = (role) => {
        switch (role) {
            case "Admin":
                return <HiOutlineShieldCheck className="w-4 h-4" />;
            case "Rider":
                return <HiOutlineUser className="w-4 h-4" />;
            default:
                return <HiOutlineUser className="w-4 h-4" />;
        }
    };

    const getRoleStyle = (role) => {
        switch (role) {
            case "Admin":
                return { background: "#03373d", color: "white" };
            case "Rider":
                return { background: "#caeb66", color: "#03373d" };
            default:
                return { background: "#f0f3f4", color: "#03373d" };
        }
    };

    const openRoleChangeModal = (user) => {
        setSelectedUser(user);
        setSelectedRole(user.role);
        setShowRoleModal(true);
    };

    const openDetailsModal = (user) => {
        setSelectedUser(user);
        setShowDetailsModal(true);
    };

    const handleRoleChange = async () => {
        if (!selectedUser || !selectedRole) return;

        Swal.fire({
            title: 'Updating Role...',
            text: 'Please wait',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            const response = await axios.patch(`/users/${selectedUser._id}`, {
                role: selectedRole.toLowerCase()
            });

            if (response.data.modifiedCount > 0 || response.data.matchedCount > 0) {
                setUsersList(prevUsers =>
                    prevUsers.map(user =>
                        user._id === selectedUser._id ? { ...user, role: selectedRole } : user
                    )
                );

                setShowRoleModal(false);
                setSelectedUser(null);
                setSelectedRole("");

                Swal.fire({
                    icon: 'success',
                    title: 'Role Updated!',
                    text: `${selectedUser.name || selectedUser.email}'s role has been changed to ${selectedRole}`,
                    confirmButtonColor: '#03373d',
                    timer: 2000,
                    showConfirmButton: true
                });

                refetch();
            } else {
                throw new Error('No changes were made');
            }
        } catch (error) {
            console.error("Error updating role:", error);
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: error.response?.data?.message || 'Failed to update user role. Please try again.',
                confirmButtonColor: '#03373d'
            });
        }
    };

    const handleDeleteUser = async (userId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#03373d',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            Swal.fire({
                title: 'Deleting...',
                text: 'Please wait',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            try {
                await axios.delete(`/users/${userId}`);

                setUsersList(prevUsers => prevUsers.filter(user => user._id !== userId));

                Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'User has been deleted successfully.',
                    confirmButtonColor: '#03373d',
                    timer: 2000,
                    showConfirmButton: true
                });

                refetch();
            } catch (error) {
                console.error("Error deleting user:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Delete Failed',
                    text: error.response?.data?.message || 'Failed to delete user. Please try again.',
                    confirmButtonColor: '#03373d'
                });
            }
        }
    };

    if (isLoading) {
        return <Loading />
    }

    const adminCount = usersList.filter(u => u.role === "Admin").length;
    const riderCount = usersList.filter(u => u.role === "Rider").length;

    return (
        <AdminRouters>
            <div className="min-h-screen bg-gray-50">
                <div className="mb-6 p-6 rounded-2xl text-[#03373d]">
                    <div className="flex flex-col items-center justify-center text-center gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-2">
                                👥 User Management Dashboard
                            </h1>
                            <p className="text-sm mt-2 opacity-90 text-center text-gray-400">
                                Manage users, roles, and access in one place. 🔐
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="px-6  flex justify-end items-center flex-wrap gap-4" style={{ borderColor: "#e0e7e9" }}>
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={() => {
                                setActiveTab("All");
                                setCurrentPage(1);
                            }}
                            className="px-4 py-2 rounded-lg cursor-pointer text-sm font-medium transition-all flex items-center gap-2"
                            style={{
                                background: activeTab === "All" ? "#03373d" : "#f0f3f4",
                                color: activeTab === "All" ? "white" : "#03373d"
                            }}
                        >
                            👥 All
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === "All" ? "bg-white/20" : "bg-gray-200"}`}>
                                ({usersList.length})
                            </span>
                        </button>

                        <button
                            onClick={() => {
                                setActiveTab("Rider");
                                setCurrentPage(1);
                            }}
                            className="px-4 py-2 rounded-lg text-sm cursor-pointer font-medium transition-all flex items-center gap-2"
                            style={{
                                background: activeTab === "Rider" ? "#03373d" : "#f0f3f4",
                                color: activeTab === "Rider" ? "white" : "#03373d"
                            }}
                        >
                            🏍️ Rider
                            <span className={`text-xs px-1.5 py-0.5 cursor-pointer rounded-full ${activeTab === "Rider" ? "bg-white/20" : "bg-gray-200"}`}>
                                ({riderCount})
                            </span>
                        </button>

                        <button
                            onClick={() => {
                                setActiveTab("Admin");
                                setCurrentPage(1);
                            }}
                            className="px-4 py-2 cursor-pointer rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                            style={{
                                background: activeTab === "Admin" ? "#03373d" : "#f0f3f4",
                                color: activeTab === "Admin" ? "white" : "#03373d"
                            }}
                        >
                            👑 Admin
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === "Admin" ? "bg-white/20" : "bg-gray-200"}`}>
                                ({adminCount})
                            </span>
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-gray-50 flex items-center justify-center p-2">
                    <div className="w-full container mx-auto bg-white rounded-2xl shadow-xl overflow-hidden" style={{ color: "#03373d" }}>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b bg-gradient-to-r from-[#03373d] to-[#1a5c64] text-white">
                                        <th className="text-left py-3 px-6 font-semibold text-sm">USER</th>
                                        <th className="text-left py-3 px-6 font-semibold text-sm">EMAIL</th>
                                        <th className="text-left py-3 px-6 font-semibold text-sm">ROLE</th>
                                        <th className="text-left py-3 px-6 font-semibold text-sm">JOIN DATE</th>
                                        <th className="text-left py-3 px-6 font-semibold text-sm">ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedUsers.map((userItem) => (
                                        <tr
                                            key={userItem._id}
                                            className="border-b transition-all hover:bg-gray-50"
                                            style={{ borderColor: "#f0f3f4" }}
                                        >
                                            <td className="py-3 px-6">
                                                <div className="flex items-center gap-3">
                                                    {userItem.photoURL ? (
                                                        <img
                                                            src={userItem.photoURL}
                                                            alt="Profile"
                                                            className="w-10 h-10 rounded-full object-cover border-2"
                                                            style={{ borderColor: "#caeb66" }}
                                                        />
                                                    ) : (
                                                        <div
                                                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                                                            style={{ background: "#03373d" }}
                                                        >
                                                            {userItem.name?.charAt(0) || userItem.email?.charAt(0) || "U"}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <span className="font-medium">{userItem.name || userItem.email}</span>
                                                        {userItem.role === "Admin" && (
                                                            <span className="ml-2 text-xs px-1.5 py-0.5 rounded" style={{ background: "#03373d", color: "white" }}>
                                                                Admin
                                                            </span>
                                                        )}
                                                        {userItem.role === "Rider" && (
                                                            <span className="ml-2 text-xs px-1.5 py-0.5 rounded" style={{ background: "#caeb66", color: "#03373d" }}>
                                                                Rider
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-6 text-sm opacity-80">{userItem.email}</td>
                                            <td className="py-3 px-6">
                                                <button
                                                    onClick={() => openRoleChangeModal(userItem)}
                                                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all hover:opacity-80 cursor-pointer"
                                                    style={getRoleStyle(userItem.role)}
                                                >
                                                    {getRoleIcon(userItem.role)}
                                                    <span>{userItem.role}</span>
                                                    <HiOutlineChevronDown className="w-3 h-3" />
                                                </button>
                                            </td>
                                            <td className="py-3 px-6 text-sm opacity-80">
                                                {userItem.joinDate || userItem.createdAt?.split('T')[0] || "N/A"}
                                            </td>
                                            <td className="py-3 px-6">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => openDetailsModal(userItem)}
                                                        className="p-2 rounded-lg transition-all hover:bg-gray-100"
                                                        style={{ color: "#03373d" }}
                                                        title="View Details"
                                                    >
                                                        <HiOutlineEye className="w-4 h-4 cursor-pointer" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(userItem._id)}
                                                        className="p-2 rounded-lg transition-all hover:bg-red-50"
                                                        style={{ color: "#dc2626" }}
                                                        title="Delete"
                                                    >
                                                        <HiOutlineTrash className="w-4 h-4 cursor-pointer" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {paginatedUsers.length === 0 && (
                            <div className="text-center py-12">
                                <p className="opacity-60">No {activeTab !== "All" ? activeTab : ""} users found</p>
                            </div>
                        )}

                        {totalPages > 1 && (
                            <div className="px-6 py-4 border-t flex justify-between items-center flex-wrap gap-4" style={{ borderColor: "#e0e7e9", background: "#f8fafb" }}>
                                <p className="text-sm opacity-60">
                                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-lg transition-all disabled:opacity-40 hover:bg-gray-200"
                                        style={{ color: "#03373d" }}
                                    >
                                        <HiOutlineChevronLeft className="w-5 h-5" />
                                    </button>
                                    <div className="flex gap-1">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className="w-8 h-8 rounded-lg text-sm font-medium transition-all"
                                                style={{
                                                    background: currentPage === page ? "#03373d" : "transparent",
                                                    color: currentPage === page ? "white" : "#03373d"
                                                }}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-lg transition-all disabled:opacity-40 hover:bg-gray-200"
                                        style={{ color: "#03373d" }}
                                    >
                                        <HiOutlineChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Details Modal */}
                {showDetailsModal && selectedUser && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-auto overflow-hidden" style={{ color: "#03373d" }}>
                            <div className="flex justify-between items-center p-6 border-b" style={{ borderColor: "#e0e7e9" }}>
                                <h2 className="text-xl font-bold">User Details</h2>
                                <button
                                    onClick={() => setShowDetailsModal(false)}
                                    className="p-1 rounded-lg hover:bg-gray-100 transition-all"
                                >
                                    <HiOutlineX className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6">
                                <div className="flex items-center gap-4 mb-6">
                                    {selectedUser.photoURL ? (
                                        <img
                                            src={selectedUser.photoURL}
                                            alt="Profile"
                                            className="w-16 h-16 rounded-full object-cover border-2"
                                            style={{ borderColor: "#caeb66" }}
                                        />
                                    ) : (
                                        <div
                                            className="w-16 h-16 rounded-full flex items-center justify-center text-white font-semibold text-2xl"
                                            style={{ background: "#03373d" }}
                                        >
                                            {selectedUser.name?.charAt(0) || selectedUser.email?.charAt(0) || "U"}
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="font-bold text-xl">{selectedUser.name || "No Name"}</h3>
                                        <p className="text-gray-500">{selectedUser.email}</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between py-2 border-b" style={{ borderColor: "#e0e7e9" }}>
                                        <span className="font-semibold">Role:</span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium`} style={getRoleStyle(selectedUser.role)}>
                                            {selectedUser.role}
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b" style={{ borderColor: "#e0e7e9" }}>
                                        <span className="font-semibold">User ID:</span>
                                        <span className="text-sm">{selectedUser._id}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b" style={{ borderColor: "#e0e7e9" }}>
                                        <span className="font-semibold">Join Date:</span>
                                        <span>{selectedUser.joinDate || selectedUser.createdAt?.split('T')[0] || "N/A"}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b" style={{ borderColor: "#e0e7e9" }}>
                                        <span className="font-semibold">Status:</span>
                                        <span className="text-green-600">Active</span>
                                    </div>
                                    {selectedUser.role === "Rider" && (
                                        <>
                                            <div className="flex justify-between py-2 border-b" style={{ borderColor: "#e0e7e9" }}>
                                                <span className="font-semibold">Vehicle Type:</span>
                                                <span>{selectedUser.vehicleType || "Not specified"}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b" style={{ borderColor: "#e0e7e9" }}>
                                                <span className="font-semibold">License Number:</span>
                                                <span>{selectedUser.licenseNumber || "Not specified"}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b" style={{ borderColor: "#e0e7e9" }}>
                                                <span className="font-semibold">Phone Number:</span>
                                                <span>{selectedUser.phone || "Not specified"}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 p-6 border-t" style={{ borderColor: "#e0e7e9", background: "#f8fafb" }}>
                                <button
                                    onClick={() => {
                                        setShowDetailsModal(false);
                                        openRoleChangeModal(selectedUser);
                                    }}
                                    className="px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
                                    style={{ background: "#caeb66", color: "#03373d" }}
                                >
                                    <HiOutlinePencilAlt className="w-4 h-4" />
                                    Change Role
                                </button>
                                <button
                                    onClick={() => setShowDetailsModal(false)}
                                    className="px-4 py-2 rounded-lg font-medium transition-all hover:bg-gray-200"
                                    style={{ color: "#03373d" }}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Role Change Modal */}
                {showRoleModal && selectedUser && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-auto overflow-hidden" style={{ color: "#03373d" }}>
                            <div className="flex justify-between items-center p-6 border-b" style={{ borderColor: "#e0e7e9" }}>
                                <h2 className="text-xl font-bold">Change User Role</h2>
                                <button
                                    onClick={() => setShowRoleModal(false)}
                                    className="p-1 rounded-lg hover:bg-gray-100 transition-all"
                                >
                                    <HiOutlineX className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6">
                                <div className="mb-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        {selectedUser.photoURL ? (
                                            <img
                                                src={selectedUser.photoURL}
                                                alt="Profile"
                                                className="w-12 h-12 rounded-full object-cover border-2"
                                                style={{ borderColor: "#caeb66" }}
                                            />
                                        ) : (
                                            <div
                                                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg"
                                                style={{ background: "#03373d" }}
                                            >
                                                {selectedUser.name?.charAt(0) || selectedUser.email?.charAt(0) || "U"}
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-semibold text-lg">{selectedUser.name || selectedUser.email}</p>
                                            <p className="text-sm opacity-70">{selectedUser.email}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm mb-4">Current Role:
                                        <span className="ml-2 font-semibold">{selectedUser.role}</span>
                                    </p>
                                    <label className="block text-sm font-medium mb-2">Select New Role</label>
                                    <div className="flex gap-3">
                                        {["Admin", "User", "Rider"].map(role => (
                                            <button
                                                key={role}
                                                onClick={() => setSelectedRole(role)}
                                                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${selectedRole === role
                                                    ? "bg-[#03373d] text-white"
                                                    : "bg-gray-100 text-[#03373d] hover:bg-gray-200"
                                                    }`}
                                            >
                                                {getRoleIcon(role)}
                                                <span className="ml-2">{role}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 p-6 border-t" style={{ borderColor: "#e0e7e9", background: "#f8fafb" }}>
                                <button
                                    onClick={() => setShowRoleModal(false)}
                                    className="px-4 py-2 rounded-lg font-medium transition-all hover:bg-gray-200"
                                    style={{ color: "#03373d" }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleRoleChange}
                                    disabled={selectedRole === selectedUser.role}
                                    className="px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{ background: "#03373d", color: "white" }}
                                >
                                    Update Role
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminRouters>
    );
};

export default UsermanagMent;