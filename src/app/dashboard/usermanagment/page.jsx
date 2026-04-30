"use client";
import { div } from "framer-motion/client";
import React, { useState } from "react";
import {
    HiOutlineEye,
    HiOutlinePencilAlt,
    HiOutlineTrash,
    HiOutlineSearch,
    HiOutlineUserAdd,
    HiOutlineChevronLeft,
    HiOutlineChevronRight,
    HiOutlineShieldCheck,
    HiOutlineUser,
    HiOutlineStar,
    HiOutlineChevronDown
} from "react-icons/hi";

const users = [
    { id: 1, name: "John Doe", email: "john.doe@example.com", role: "Admin", joinDate: "2024-01-15", status: "Active", permissions: "Full Access" },
    { id: 2, name: "Jane Smith", email: "jane.smith@example.com", role: "User", joinDate: "2024-02-20", status: "Active", permissions: "Limited" },
    { id: 3, name: "Mike Johnson", email: "mike.j@example.com", role: "Moderator", joinDate: "2024-03-10", status: "Active", permissions: "Medium" },
    { id: 4, name: "Sarah Williams", email: "sarah.w@example.com", role: "User", joinDate: "2024-01-05", status: "Inactive", permissions: "Limited" },
    { id: 5, name: "David Brown", email: "david.b@example.com", role: "Admin", joinDate: "2024-02-28", status: "Active", permissions: "Full Access" },
    { id: 6, name: "Emma Wilson", email: "emma.w@example.com", role: "User", joinDate: "2024-03-15", status: "Active", permissions: "Limited" },
];

const UsermanagMent = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [roleFilter, setRoleFilter] = useState("All");
    const [usersList, setUsersList] = useState(users);
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const itemsPerPage = 4;

    // Filter by search and role
    const filteredUsers = usersList.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === "All" || user.role === roleFilter;
        return matchesSearch && matchesRole;
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
            case "Moderator":
                return <HiOutlineStar className="w-4 h-4" />;
            default:
                return <HiOutlineUser className="w-4 h-4" />;
        }
    };

    const getRoleStyle = (role) => {
        switch (role) {
            case "Admin":
                return { background: "#03373d", color: "white" };
            case "Moderator":
                return { background: "#e6f3f4", color: "#03373d" };
            default:
                return { background: "#f0f3f4", color: "#03373d" };
        }
    };

    const handleRoleChange = (userId, newRole) => {
        setUsersList(prevUsers =>
            prevUsers.map(user =>
                user.id === userId ? { ...user, role: newRole } : user
            )
        );
        setOpenDropdownId(null);
        // Optional: Show a success message
        alert(`User role updated to ${newRole}`);
    };

    const handleDeleteUser = (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            setUsersList(prevUsers => prevUsers.filter(user => user.id !== userId));
        }
    };

    return (
        <div>

            <div className="mb-6 p-6 rounded-2xl  text-[#03373d]">
                <div className="flex flex-col items-center justify-center text-center gap-4">

                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold  flex items-center justify-center gap-2">
                            👥 User Management Dashboard
                        </h1>
                        <p className="text-sm mt-2 opacity-90 text-center text-gray-400">
                            Manage users, roles, and access in one place. 🔐
                        </p>
                    </div>

                </div>
            </div> <div className="px-6 py-4 border-b flex justify-end  gap-4 flex-wrap" style={{ borderColor: "#e0e7e9" }}>


                <div className="flex gap-2 flex-wrap">
                    {["All", "Admin", "Moderator", "User"].map(role => (
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
            
            <div className=" bg-gray-50 flex items-center justify-center">
                <div className="w-full container mx-auto bg-white rounded-2xl shadow-xl overflow-hidden" style={{ color: "#03373d" }}>   

                    {/* Filters */}
                   

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-gradient-to-r from-[#03373d] to-[#1a5c64] text-white " >
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
                                        key={user.id}
                                        className="border-b transition-all hover:bg-gray-50"
                                        style={{ borderColor: "#f0f3f4" }}
                                    >
                                        <td className="py-3 px-6">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                                                    style={{ background: "#03373d" }}
                                                >
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <span className="font-medium">{user.name}</span>
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
                                            <div className="relative">
                                                <button
                                                    onClick={() => setOpenDropdownId(openDropdownId === user.id ? null : user.id)}
                                                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all hover:opacity-80"
                                                    style={getRoleStyle(user.role)}
                                                >
                                                    {getRoleIcon(user.role)}
                                                    <span>{user.role}</span>
                                                    <HiOutlineChevronDown className="w-3 h-3" />
                                                </button>

                                                {/* Dropdown Menu */}
                                                {openDropdownId === user.id && (
                                                    <div className="absolute top-full left-0 mt-1 w-32 bg-white rounded-lg shadow-lg border z-10 overflow-hidden" style={{ borderColor: "#e0e7e9" }}>
                                                        {["Admin", "Moderator", "User"].map(roleOption => (
                                                            <button
                                                                key={roleOption}
                                                                onClick={() => handleRoleChange(user.id, roleOption)}
                                                                className={`w-full text-left px-3 py-2 text-xs transition-all hover:bg-gray-50 flex items-center gap-2 ${user.role === roleOption ? "opacity-50 cursor-not-allowed" : ""
                                                                    }`}
                                                                style={{ color: "#03373d" }}
                                                                disabled={user.role === roleOption}
                                                            >
                                                                {getRoleIcon(roleOption)}
                                                                <span>{roleOption}</span>
                                                                {user.role === roleOption && (
                                                                    <span className="ml-auto text-xs">✓</span>
                                                                )}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-3 px-6 text-sm opacity-80">{user.joinDate}</td>
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
                                                    onClick={() => handleDeleteUser(user.id)}
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

                    {/* Empty State */}
                    {paginatedUsers.length === 0 && (
                        <div className="text-center py-12">
                            <p className="opacity-60">No users found matching your criteria</p>
                        </div>
                    )}

                    {/* Pagination */}
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
        </div>
    );
};

export default UsermanagMent;