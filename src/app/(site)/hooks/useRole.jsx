import React from 'react';
import useAuth from './useAuth';
import useAxios from './useAxios';
import { useQuery } from '@tanstack/react-query';

const useRole = () => {
    const {user} = useAuth();
    const axios =useAxios();

    const {data : role="user",isLoading} =useQuery({
        queryKey:['userRole',user?.email],
        queryFn: async()=>{
            if(!user?.email) return 'user';
            const res = await axios.get(`/users/${user.email}/role`);
            return res.data.role;
        }
    })
    return {role,isLoading};
};

export default useRole;