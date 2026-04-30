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
    HiOutlineUserAdd,
    HiOutlineChevronLeft,
    HiOutlineChevronRight,
    HiOutlineShieldCheck,
    HiOutlineUser,
    HiOutlineChevronDown,
    HiOutlineX
} from "react-icons/hi";

const UsermanagMent = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [roleFilter, setRoleFilter] = useState("All");
    const [usersList, setUsersList] = useState([]);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedRole, setSelectedRole] = useState("");
    const { user } = useAuth();
    const axios = useAxios();
    const itemsPerPage = 4;

    const { data: Allusers = [], refetch, isLoading } = useQuery({
        queryKey: ['Allusers', user?.email],
        queryFn: async () => {
            const res = await axios.get('/users');
            return res.data;
        }
    });

    // Update usersList when API data loads
    useEffect(() => {
        if (Allusers && Allusers.length > 0) {
            setUsersList(Allusers);
        }
    }, [Allusers]);

    // Filter by role only (search is skipped)
    const filteredUsers = usersList.filter(user => {
        const matchesRole = roleFilter === "All" || user.role === roleFilter;
        return matchesRole;
    });

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getRoleIcon = (role) => {
        switch (role) {
            case "Admin":
                return <HiOutlineShieldCheck className="w-4 h-4" />;
            default:
                return <HiOutlineUser className="w-4 h-4" />;
        }
    };

    const getRoleStyle = (role) => {
        switch (role) {
            case "Admin":
                return { background: "#03373d", color: "white" };
            default:
                return { background: "#f0f3f4", color: "#03373d" };
        }
    };

    const openRoleChangeModal = (user) => {
        setSelectedUser(user);
        setSelectedRole(user.role);
        setShowRoleModal(true);
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
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#03373d] mx-auto"></div>
                    <p className="mt-4 text-[#03373d]">Loading users...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6 p-6 rounded-2xl text-[#03373d]">
                <div className="flex flex-col items-center justify-center text-center gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-2">
                            👥 User Management Dashboard {Allusers?.length}
                        </h1>
                        <p className="text-sm mt-2 opacity-90 text-center text-gray-400">
                            Manage users, roles, and access in one place. 🔐
                        </p>
                    </div>
                </div>
            </div>

            <div className="px-6 py-4 border-b flex justify-end gap-4 flex-wrap" style={{ borderColor: "#e0e7e9" }}>
                <div className="flex gap-2 flex-wrap">
                    {["All", "Admin", "User"].map(role => (
                        <button
                            key={role}
                            onClick={() => {
                                setRoleFilter(role);
                                setCurrentPage(1);
                            }}
                            className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                            style={{
                                background: roleFilter === role ? "#03373d" : "#f0f3f4",
                                color: roleFilter === role ? "white" : "#03373d"
                            }}
                        >
                            {role}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-gray-50 flex items-center justify-center">
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
                                {paginatedUsers.map((user, index) => (
                                    <tr
                                        key={user._id}
                                        className="border-b transition-all hover:bg-gray-50"
                                        style={{ borderColor: "#f0f3f4" }}
                                    >
                                        <td className="py-3 px-6">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                                                    style={{ background: "#03373d" }}
                                                >
                                                    {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                                                </div>
                                                <div>
                                                    <span className="font-medium">{user.name || user.email}</span>
                                                    {user.role === "Admin" && (
                                                        <span className="ml-2 text-xs px-1.5 py-0.5 rounded" style={{ background: "#03373d", color: "white" }}>
                                                            Admin
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-6 text-sm opacity-80">{user.email}</td>
                                        <td className="py-3 px-6">
                                            <button
                                                onClick={() => openRoleChangeModal(user)}
                                                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all hover:opacity-80 cursor-pointer"
                                                style={getRoleStyle(user.role)}
                                            >
                                                {getRoleIcon(user.role)}
                                                <span>{user.role}</span>
                                                <HiOutlineChevronDown className="w-3 h-3" />
                                            </button>
                                        </td>
                                        <td className="py-3 px-6 text-sm opacity-80">
                                            {user.joinDate || user.createdAt?.split('T')[0] || "N/A"}
                                        </td>
                                        <td className="py-3 px-6">
                                            <div className="flex gap-2">
                                                <button
                                                    className="p-2 rounded-lg transition-all hover:bg-gray-100"
                                                    style={{ color: "#03373d" }}
                                                    title="View"
                                                >
                                                    <HiOutlineEye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    className="p-2 rounded-lg transition-all hover:bg-gray-100"
                                                    style={{ color: "#03373d" }}
                                                    title="Edit"
                                                >
                                                    <HiOutlinePencilAlt className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user._id)}
                                                    className="p-2 rounded-lg transition-all hover:bg-red-50"
                                                    style={{ color: "#dc2626" }}
                                                    title="Delete"
                                                >
                                                    <HiOutlineTrash className="w-4 h-4" />
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
                            <p className="opacity-60">No users found matching your criteria</p>
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
                                    <div
                                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg"
                                        style={{ background: "#03373d" }}
                                    >
                                        {selectedUser.name?.charAt(0) || selectedUser.email?.charAt(0) || "U"}
                                    </div>
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
                                    {["Admin", "User"].map(role => (
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
    );
};

export default UsermanagMent;