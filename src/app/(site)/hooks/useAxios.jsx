"use client"
import axios from 'axios';
import React, { useEffect, useMemo } from 'react';
import useAuth from './useAuth';
import { useRouter } from 'next/navigation';


const useAxios = () => {
    const { user, logout } =useAuth()
    const router = useRouter()
    const axiosInstance = useMemo(() => {
        return axios.create({
      
            baseURL: 'http://localhost:5000'


        })

      

    }, [])

    useEffect(() => {
        const requestInterceptor= axiosInstance.interceptors.request.use(config => {
            config.headers.Authorization = `Bearer ${user?.accessToken}`
            return config
        },[user])

        const restInterceptor =axiosInstance.interceptors.response.use((response)=>{
            return response
        },(error)=>{
            console.log(error);
            const statuscode =error.status;
            if(statuscode == 401 || statuscode == 403){
                logout();
               router.push('/login')
                
            }
            return Promise.reject(error)

        })

        return () => {
            axiosInstance.interceptors.request.eject(requestInterceptor)
            axiosInstance.interceptors.response.eject(restInterceptor)
        }
    }, [axiosInstance, user, logout, router])

   

    return axiosInstance;
};

export default useAxios;