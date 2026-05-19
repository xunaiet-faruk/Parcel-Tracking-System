"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaSpinner, FaCheckCircle, FaClock, FaReply,
    FaUser, FaMotorcycle, FaTag, FaEnvelope, FaPhone,
    FaCheck, FaTimes
} from 'react-icons/fa';
import { MdMessage, MdSupportAgent } from 'react-icons/md';
import useAuth from '../../(site)/hooks/useAuth';
import useAxios from '../../(site)/hooks/useAxios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useRole from '@/app/(site)/hooks/useRole';

const AdminSupport = () => {
    const { user } = useAuth();
    const { role, isLoading: roleLoading } = useRole(); 
    const axios = useAxios();
    const queryClient = useQueryClient();
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [sendingReply, setSendingReply] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');
    const messagesEndRef = useRef(null);

    const isAdmin = role === 'admin'; 
    const adminEmail = user?.email;

    // লোডিং স্টেট দেখান
    if (roleLoading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
                <FaSpinner className="animate-spin text-3xl text-[#03373d]" />
            </div>
        );
    }

    const { data: messages = [], isLoading, error, refetch } = useQuery({
        queryKey: ['admin-support-messages', adminEmail],
        queryFn: async () => {
            try {
                console.log('========================================');
                console.log('🔍 FRONTEND DEBUG START');
                console.log('========================================');
                console.log('1️⃣ User object:', user);
                console.log('2️⃣ Role from useRole:', role);
                console.log('3️⃣ isAdmin:', isAdmin);
                console.log('4️⃣ adminEmail:', adminEmail);
                console.log('========================================');

                if (!isAdmin || !adminEmail) {
                    console.log('❌ Not admin or no email, returning empty');
                    return [];
                }

                const url = `/admin/support/messages?adminEmail=${encodeURIComponent(adminEmail)}`;
                console.log('5️⃣ Making API call to:', url);

                const response = await axios.get(url);

                console.log('6️⃣ Response status:', response.status);
                console.log('7️⃣ Response data:', response.data);
                console.log('========================================');

                if (Array.isArray(response.data)) {
                    console.log(`✅ Loaded ${response.data.length} messages`);
                    return response.data;
                }

          
                if (response.data && response.data.messages) {
                    console.log(`✅ Loaded ${response.data.messages.length} messages`);
                    return response.data.messages;
                }

                return [];
            } catch (err) {
                console.error('💥 ERROR in queryFn:', err);
                console.error('📡 Error response:', err.response?.data);

                if (err.response?.status === 403) {
                    Swal.fire({
                        title: "Access Denied",
                        text: err.response?.data?.message || "You don't have admin access",
                        icon: "error"
                    });
                }
                return [];
            }
        },
        enabled: !!isAdmin && !!adminEmail, 
        refetchInterval: 5000,
        refetchOnWindowFocus: true,
    });

    // Non-admin users will see this
    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
                        <FaTimes className="text-5xl text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-red-700 mb-2">Access Denied</h2>
                        <p className="text-gray-600">You don't have permission to access this page.</p>
                        <p className="text-gray-500 text-sm mt-2">Your role: {role || 'user'}</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error handling
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
                        <MdSupportAgent className="text-5xl text-yellow-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-yellow-700 mb-2">Unable to Load Messages</h2>
                        <p className="text-gray-600">Failed to fetch support messages.</p>
                        <button onClick={() => refetch()} className="mt-4 bg-[#03373d] text-white px-6 py-2 rounded-lg">Retry</button>
                    </div>
                </div>
            </div>
        );
    }

    const updateStatusMutation = useMutation({
        mutationFn: async ({ messageId, status }) => {
            const response = await axios.patch(`/support/messages/${messageId}/status`, { status });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-support-messages']);
            Swal.fire("Updated", "Status updated successfully", "success");
        },
        onError: (error) => {
            console.error('Status update error:', error);
            Swal.fire("Error", "Failed to update status", "error");
        }
    });

  
    const replyMutation = useMutation({
        mutationFn: async ({ messageId, replyMessage }) => {
            const response = await axios.post(`/support/messages/${messageId}/reply`, {
                message: replyMessage,
                repliedByName: user?.displayName || user?.name || 'Admin',
                repliedByRole: 'admin',
                repliedBy: adminEmail
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-support-messages']);
            setReplyText('');
            setSelectedMessage(null);
            Swal.fire("Success", "Reply sent successfully", "success");
        },
        onError: (error) => {
            console.error('Reply error:', error);
            Swal.fire("Error", "Failed to send reply", "error");
        }
    });

    const filteredMessages = messages.filter(msg => {
        if (statusFilter === 'all') return true;
        return msg.status === statusFilter;
    });

    const getStatusBadge = (status) => {
        const badges = {
            'pending': <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700"><FaClock className="inline mr-1" /> Pending</span>,
            'answered': <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700"><FaCheckCircle className="inline mr-1" /> Answered</span>,
            'resolved': <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700"><FaCheck className="inline mr-1" /> Resolved</span>
        };
        return badges[status] || badges['pending'];
    };

    const getRoleBadge = (role) => {
        if (role === 'rider') {
            return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700"><FaMotorcycle className="inline mr-1" /> Rider</span>;
        }
        return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700"><FaUser className="inline mr-1" /> User</span>;
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        const d = new Date(date);
        return d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleStatusChange = (messageId, newStatus) => {
        updateStatusMutation.mutate({ messageId, status: newStatus });
    };

    const handleSendReply = () => {
        if (!replyText.trim()) {
            Swal.fire("Error", "Please write a reply", "error");
            return;
        }
        replyMutation.mutate({
            messageId: selectedMessage._id,
            replyMessage: replyText.trim()
        });
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-3 bg-[#03373d] rounded-full mb-4">
                        <MdSupportAgent className="text-2xl text-[#caeb66]" />
                    </div>
                    <h1 className="text-2xl font-bold text-[#03373d]">Support Messages</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage all customer & rider support tickets</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                        <p className="text-2xl font-bold text-yellow-600">{messages.filter(m => m.status === 'pending').length}</p>
                        <p className="text-xs text-gray-500">Pending</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                        <p className="text-2xl font-bold text-green-600">{messages.filter(m => m.status === 'answered').length}</p>
                        <p className="text-xs text-gray-500">Answered</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                        <p className="text-2xl font-bold text-blue-600">{messages.filter(m => m.status === 'resolved').length}</p>
                        <p className="text-xs text-gray-500">Resolved</p>
                    </div>
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-2 mb-6 justify-center">
                    <button onClick={() => setStatusFilter('all')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${statusFilter === 'all' ? 'bg-[#03373d] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>All</button>
                    <button onClick={() => setStatusFilter('pending')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${statusFilter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>Pending</button>
                    <button onClick={() => setStatusFilter('answered')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${statusFilter === 'answered' ? 'bg-green-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>Answered</button>
                    <button onClick={() => setStatusFilter('resolved')} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${statusFilter === 'resolved' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>Resolved</button>
                </div>

                {/* Messages List */}
                {isLoading ? (
                    <div className="flex justify-center py-12"><FaSpinner className="animate-spin text-3xl text-[#03373d]" /></div>
                ) : filteredMessages.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center">
                        <MdMessage className="text-5xl text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No support messages found</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredMessages.map((msg) => (
                            <div key={msg._id} className="bg-white rounded-xl shadow-md overflow-hidden">
                                {/* Message Header */}
                                <div className="p-5 border-b bg-gray-50">
                                    <div className="flex justify-between items-start flex-wrap gap-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 flex-wrap mb-2">
                                                <h3 className="font-semibold text-gray-800">{msg.subject}</h3>
                                                {getStatusBadge(msg.status)}
                                                {getRoleBadge(msg.role)}
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <span className="flex items-center gap-1"><FaUser className="text-xs" /> {msg.name}</span>
                                                <span className="flex items-center gap-1"><FaEnvelope className="text-xs" /> {msg.email}</span>
                                                <span className="flex items-center gap-1"><FaClock className="text-xs" /> {formatDate(msg.createdAt)}</span>
                                            </div>
                                        </div>
                                        <select value={msg.status} onChange={(e) => handleStatusChange(msg._id, e.target.value)} className="px-3 py-1 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#caeb66]">
                                            <option value="pending">Pending</option>
                                            <option value="answered">Answered</option>
                                            <option value="resolved">Resolved</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Message Body */}
                                <div className="p-5">
                                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                        <p className="text-gray-700 whitespace-pre-wrap">{msg.message}</p>
                                    </div>

                                    {/* Replies */}
                                    {msg.replies && msg.replies.length > 0 && (
                                        <div className="mt-4 space-y-3">
                                            <h4 className="text-sm font-semibold text-gray-600 flex items-center gap-2"><FaReply /> Replies ({msg.replies.length})</h4>
                                            {msg.replies.map((reply, idx) => (
                                                <div key={idx} className="bg-green-50 rounded-lg p-3 ml-4">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <p className="text-sm font-medium text-green-800">{reply.repliedByName} ({reply.repliedByRole})</p>
                                                            <p className="text-xs text-gray-500">{formatDate(reply.createdAt)}</p>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-gray-700 mt-2">{reply.message}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Reply Button / Form */}
                                    {selectedMessage?._id === msg._id ? (
                                        <div className="mt-4">
                                            <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Write your reply..." rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#caeb66]" autoFocus />
                                            <div className="flex gap-2 mt-2">
                                                <button onClick={handleSendReply} disabled={replyMutation.isPending} className="bg-[#03373d] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#caeb66] hover:text-[#03373d] transition disabled:opacity-50">
                                                    {replyMutation.isPending ? <FaSpinner className="animate-spin inline" /> : <FaReply className="inline mr-1" />} Send Reply
                                                </button>
                                                <button onClick={() => { setSelectedMessage(null); setReplyText(''); }} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50 transition">Cancel</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button onClick={() => setSelectedMessage(msg)} className="mt-4 text-sm text-[#03373d] hover:text-[#caeb66] transition flex items-center gap-1"><FaReply /> Reply to this message</button>
                                    )}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminSupport;