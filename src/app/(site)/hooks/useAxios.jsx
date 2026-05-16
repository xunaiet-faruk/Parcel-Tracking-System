"use client"
import axios from 'axios';
import React, { useEffect, useMemo } from 'react';
import useAuth from './useAuth';
import { useRouter } from 'next/navigation';


const useAxios = () => {
    const { user, logout } = useAuth()
    const router = useRouter()
    const axiosInstance = useMemo(() => {
        return axios.create({

            baseURL: 'http://localhost:5000'


        })



    }, [])

    useEffect(() => {
        const requestInterceptor = axiosInstance.interceptors.request.use(
            (config) => {
                if (user?.accessToken) {
                    config.headers.Authorization = `Bearer ${user.accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        const restInterceptor = axiosInstance.interceptors.response.use(
            (response) => response,
            (error) => {
                console.log(error);
                const statusCode = error?.response?.status || error?.status;
                if (statusCode === 401 || statusCode === 403) {
                    logout();
                    router.push('/login');
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosInstance.interceptors.request.eject(requestInterceptor);
            axiosInstance.interceptors.response.eject(restInterceptor);
        };
    }, [axiosInstance, user, logout, router]);



    return axiosInstance;
};

export default useAxios;