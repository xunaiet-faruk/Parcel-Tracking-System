import React from 'react';
import useAuth from './useAuth';
import useAxios from './useAxios';
import { useQuery } from '@tanstack/react-query';

const useRole = () => {
    const { user, loading: authLoading } = useAuth();
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
                return 'user';
            }
        },
        enabled: !!user?.email && !authLoading,
        staleTime: 5 * 60 * 1000,
        retry: 1
    });

    return {
        role: role || 'user',
        isLoading: authLoading || roleLoading
    };
};

export default useRole;