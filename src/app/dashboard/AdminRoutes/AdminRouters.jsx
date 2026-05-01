"use client";

import useAuth from '@/app/(site)/hooks/useAuth';
import useRole from '@/app/(site)/hooks/useRole';
import React from 'react';

const AdminRouters = ({ children }) => {
    const { role, isLoading } = useRole();
    const { user, loading } = useAuth();

    if (loading || isLoading) {
        return (
            <div className='flex justify-center items-center h-screen'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#03373d] mx-auto'></div>
                    <p className='mt-4 text-gray-600'>Loading...</p>
                </div>
            </div>
        );
    }

    if (role !== 'admin') {
        return (
            <div className='flex justify-center items-center h-screen'>
                <div className='text-center'>
                    <div className='bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg'>
                        <h2 className='text-xl font-bold mb-2'>Access Denied</h2>
                        <p>You do not have admin privileges to access this page.</p>
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default AdminRouters;