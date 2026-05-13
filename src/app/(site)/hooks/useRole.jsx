import React from 'react';
import useAuth from './useAuth';
import useAxios from './useAxios';
import { useQuery } from '@tanstack/react-query';

const useRole = () => {
    const { user, loading: authLoading } = useAuth(); // authLoading যোগ করুন
    const axios = useAxios();

    const { data: role = null, isLoading: roleLoading } = useQuery({
        queryKey: ['userRole', user?.email],
        queryFn: async () => {
            if (!user?.email) return null;
            try {
                const res = await axios.get(`/users/${user.email}/role`);
                console.log(res.data.role);
                return res.data.role || 'user';
            
            } catch (error) {
                console.error('Error fetching role:', error);
                return 'user'; // ডিফল্ট রোল
            }
        },
        enabled: !!user?.email && !authLoading, // শুধু মাত্র ইউজার লোড হলে রান করবে
        staleTime: 5 * 60 * 1000, // 5 মিনিট ক্যাশে থাকবে
        retry: 1
    });

    return {
        role: role || 'user',
        isLoading: authLoading || roleLoading
    };
};

export default useRole;