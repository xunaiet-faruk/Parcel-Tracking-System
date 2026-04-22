// hooks/useRiderApplication.js
import { useState, useEffect, useCallback } from 'react';
import useAxios from './useAxios';
import useAuth from './useAuth';

const useRiderApplication = () => {
    const axios = useAxios();
    const { user } = useAuth();

    const [applicationStatus, setApplicationStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchApplicationStatus = useCallback(async () => {
        if (!user?.email) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const res = await axios.get(`/rider/check-application/${user.email}`);
            setApplicationStatus(res.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching application status:", err);
            setError(err.response?.data?.message || "Failed to fetch application status");
            setApplicationStatus(null);
        } finally {
            setIsLoading(false);
        }
    }, [user?.email, axios]);

    useEffect(() => {
        fetchApplicationStatus();
    }, [fetchApplicationStatus]);

    const refetch = useCallback(() => {
        fetchApplicationStatus();
    }, [fetchApplicationStatus]);

    return {
        applicationStatus,
        isLoading,
        error,
        refetch,
        canApply: !applicationStatus?.hasApplied || applicationStatus?.status === 'rejected',
        isApproved: applicationStatus?.status === 'approved',
        isRejected: applicationStatus?.status === 'rejected',
        isPending: applicationStatus?.status === 'pending'
    };
};

export default useRiderApplication;