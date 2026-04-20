"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "../(site)/context/Authprovider";
import Sidebar from "./page";

const queryClient = new QueryClient();

export default function DashboardLayout({ children }) {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <Sidebar>
                    {children}
                </Sidebar>
            </AuthProvider>
        </QueryClientProvider>
    );
}