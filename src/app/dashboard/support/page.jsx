"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaHeadset, FaPhone, FaWhatsapp, FaFacebook,
    FaPaperPlane, FaUser, FaMotorcycle, FaClock,
    FaCheckCircle, FaSpinner, FaRegClock, FaTrash, FaReply,
    FaCheck
} from 'react-icons/fa';
import { MdSupportAgent, MdMessage } from 'react-icons/md';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAuth from '../../(site)/hooks/useAuth';
import useAxios from '../../(site)/hooks/useAxios';
import Swal from 'sweetalert2';

const Support = () => {
    const { user } = useAuth();
    const axios = useAxios();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('messages');
    const [message, setMessage] = useState('');
    const [subject, setSubject] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyMessage, setReplyMessage] = useState('');
    const messagesEndRef = useRef(null);


    const { data: messages = [], isLoading, refetch } = useQuery({
        queryKey: ['user-support-messages', user?.email],
        queryFn: async () => {
            const response = await axios.get(`/support/messages?email=${user?.email}`);
            return response.data || [];
        },
        enabled: !!user?.email,
        refetchInterval: 5000,
        refetchOnWindowFocus: true,
    });


    const sendMessageMutation = useMutation({
        mutationFn: async (data) => {
            const response = await axios.post('/support/messages', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['user-support-messages']);
            setSubject('');
            setMessage('');
            Swal.fire("Success", "Your message has been sent. We'll get back to you soon!", "success");
        },
        onError: () => {
            Swal.fire("Error", "Failed to send message", "error");
        }
    });


    const replyMutation = useMutation({
        mutationFn: async ({ messageId, replyMsg }) => {
            const response = await axios.post(`/support/messages/${messageId}/reply`, {
                message: replyMsg,
                repliedByName: user?.displayName,
                repliedByRole: user?.role || 'user'
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['user-support-messages']);
            setReplyingTo(null);
            setReplyMessage('');
            Swal.fire("Success", "Reply sent successfully", "success");
        },
        onError: () => {
            Swal.fire("Error", "Failed to send reply", "error");
        }
    });



    const deleteMutation = useMutation({
        mutationFn: async (messageId) => {

            const response = await axios.delete(`/support/messages/${messageId}?email=${user?.email}`);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['user-support-messages']);
            Swal.fire("Deleted", data.message || "Message has been deleted", "success");
        },
        onError: (error) => {
            console.error('Delete error:', error);
            const errorMessage = error.response?.data?.message || error.response?.data?.error || "Failed to delete message";


            if (error.response?.status === 403 || error.response?.status === 401) {
                Swal.fire("Permission Denied", errorMessage, "error");
            } else {
                Swal.fire("Error", errorMessage, "error");
            }
        }
    });

    const handleDelete = (messageId) => {
        Swal.fire({
            title: "Delete Message?",
            text: "This action cannot be undone",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#03373d",
            confirmButtonText: "Yes, delete"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMutation.mutate(messageId);
            }
        });
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!subject.trim() || !message.trim()) {
            Swal.fire("Error", "Please fill all fields", "error");
            return;
        }

        sendMessageMutation.mutate({
            subject: subject.trim(),
            message: message.trim(),
            email: user?.email,
            name: user?.displayName,
            role: user?.role || 'user'
        });
    };

    const handleReply = (messageId) => {
        if (!replyMessage.trim()) return;
        replyMutation.mutate({ messageId, replyMsg: replyMessage.trim() });
    };

    const getStatusBadge = (status) => {
        const badges = {
            'pending': <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700"><FaSpinner className="inline mr-1 animate-spin" /> Pending</span>,
            'answered': <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700"><FaCheckCircle className="inline mr-1" /> Answered</span>,
            'resolved': <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700"><FaCheck className="inline mr-1" /> Resolved</span>
        };
        return badges[status] || badges['pending'];
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

    const getRoleIcon = () => {
        if (user?.role === 'rider') return <FaMotorcycle className="text-xl text-[#caeb66]" />;
        return <FaUser className="text-xl text-[#caeb66]" />;
    };

    const getRoleName = () => {
        if (user?.role === 'rider') return 'Rider Support';
        return 'Customer Support';
    };


    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const supportChannels = [
        { icon: <FaPhone />, title: "Phone Support", info: "+880 1234 567890", hours: "24/7 Available", link: "tel:+8801234567890" },
        { icon: <FaWhatsapp />, title: "WhatsApp", info: "+880 1234 567890", hours: "9 AM - 9 PM", link: "https://wa.me/8801234567890" },
        { icon: <FaFacebook />, title: "Facebook", info: "@SpeedyX", hours: "9 AM - 6 PM", link: "https://facebook.com/SpeedyX" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">

                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-3 bg-[#03373d] rounded-full mb-4">
                        {getRoleIcon()}
                    </div>
                    <h1 className="text-2xl font-bold text-[#03373d]">Help & Support</h1>
                    <p className="text-gray-500 text-sm mt-1">How can we help you? | {getRoleName()}</p>
                </div>


                <div className="flex flex-wrap justify-center gap-2 mb-8">
                    <button
                        onClick={() => setActiveTab('messages')}
                        className={`px-5 py-2 rounded-lg font-medium transition flex items-center gap-2
                            ${activeTab === 'messages' ? 'bg-[#03373d] text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                    >
                        <MdMessage /> My Messages
                    </button>
                    <button
                        onClick={() => setActiveTab('new')}
                        className={`px-5 py-2 rounded-lg font-medium transition flex items-center gap-2
                            ${activeTab === 'new' ? 'bg-[#03373d] text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                    >
                        <FaPaperPlane /> New Message
                    </button>
                    <button
                        onClick={() => setActiveTab('contact')}
                        className={`px-5 py-2 rounded-lg font-medium transition flex items-center gap-2
                            ${activeTab === 'contact' ? 'bg-[#03373d] text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                    >
                        <FaHeadset /> Contact
                    </button>
                </div>


                {activeTab === 'messages' && (
                    <div className="space-y-4">
                        {isLoading ? (
                            <div className="flex justify-center py-12"><FaSpinner className="animate-spin text-3xl text-[#03373d]" /></div>
                        ) : messages.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-md p-12 text-center">
                                <MdMessage className="text-5xl text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">No messages yet</p>
                                <button onClick={() => setActiveTab('new')} className="mt-3 text-[#03373d] hover:text-[#caeb66] transition">Send your first message →</button>
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <div key={msg._id} className="bg-white rounded-xl shadow-md overflow-hidden">
                                    <div className="p-5 border-b bg-gray-50">
                                        <div className="flex justify-between items-start flex-wrap gap-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 flex-wrap">
                                                    <h3 className="font-semibold text-gray-800">{msg.subject}</h3>
                                                    {getStatusBadge(msg.status)}
                                                </div>
                                                <p className="text-xs text-gray-400 mt-1">Sent on {formatDate(msg.createdAt)}</p>
                                            </div>
                                            <button onClick={() => handleDelete(msg._id)} className="text-red-500 hover:text-red-700 transition"><FaTrash /></button>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                            <p className="text-gray-700 whitespace-pre-wrap">{msg.message}</p>
                                        </div>


                                        {msg.replies?.length > 0 && (
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


                                        {replyingTo === msg._id ? (
                                            <div className="mt-4">
                                                <textarea value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} placeholder="Write your reply..." rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#caeb66]" autoFocus />
                                                <div className="flex gap-2 mt-2">
                                                    <button onClick={() => handleReply(msg._id)} disabled={replyMutation.isPending} className="bg-[#03373d] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#caeb66] hover:text-[#03373d] transition disabled:opacity-50">
                                                        {replyMutation.isPending ? <FaSpinner className="animate-spin inline" /> : <FaReply className="inline mr-1" />} Send Reply
                                                    </button>
                                                    <button onClick={() => { setReplyingTo(null); setReplyMessage(''); }} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50 transition">Cancel</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button onClick={() => setReplyingTo(msg._id)} className="mt-4 text-sm text-[#03373d] hover:text-[#caeb66] transition flex items-center gap-1"><FaReply /> Reply to this message</button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}


                {activeTab === 'new' && (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="p-5 border-b bg-gradient-to-r from-[#03373d] to-[#1a5c64]">
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2"><FaPaperPlane /> Send New Message</h2>
                            <p className="text-white/70 text-sm mt-1">Describe your issue and we'll help you</p>
                        </div>
                        <form onSubmit={handleSendMessage} className="p-5 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g., Payment Issue, Delivery Problem" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#caeb66]" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows="6" placeholder="Describe your issue in detail..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#caeb66] resize-none" required />
                            </div>
                            <button type="submit" disabled={sendMessageMutation.isPending} className="w-full bg-[#03373d] text-white px-5 py-2 rounded-lg hover:bg-[#caeb66] hover:text-[#03373d] transition flex items-center justify-center gap-2 disabled:opacity-50">
                                {sendMessageMutation.isPending ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
                                {sendMessageMutation.isPending ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                )}


                {activeTab === 'contact' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {supportChannels.map((channel, index) => (
                            <a key={index} href={channel.link} target="_blank" rel="noopener noreferrer" className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition group">
                                <div className="w-12 h-12 bg-[#03373d]/10 rounded-full flex items-center justify-center text-[#03373d] text-xl mb-3 group-hover:bg-[#03373d] group-hover:text-white transition">{channel.icon}</div>
                                <h3 className="font-semibold text-gray-800">{channel.title}</h3>
                                <p className="text-sm text-gray-500 mt-1">{channel.info}</p>
                                <p className="text-xs text-gray-400 flex items-center gap-1 mt-2"><FaRegClock /> {channel.hours}</p>
                                <div className="mt-3 text-[#03373d] text-sm group-hover:text-[#caeb66]">Contact →</div>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Support;