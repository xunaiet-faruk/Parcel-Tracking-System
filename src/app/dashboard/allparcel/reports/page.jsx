"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FaPrint, FaDownload, FaFileInvoice, FaCalendarAlt, FaBox, FaMoneyBillWave, FaTruck, FaUserCheck } from 'react-icons/fa';
import useAxios from '@/app/(site)/hooks/useAxios';
import Loading from '@/app/components/Loading';
import Link from 'next/link';
import Image from 'next/image';

const PrintReport = React.forwardRef(({ reportType, stats, parcels, companyName, logoUrl }, ref) => {
    return (
        <div ref={ref} className="max-w-7xl mx-auto bg-white rounded-2xl overflow-hidden shadow-xl print:shadow-none">

            <div className="bg-gradient-to-r from-[#03373d] to-[#1a5c64] px-8 py-6 text-white flex justify-between items-center">
                <div className="flex items-center gap-4">
                    {logoUrl && (
                        <img src={logoUrl} alt="Logo" className="w-16 h-16 object-contain bg-white rounded-xl p-2" />
                    )}
                    <div>
                        <h1 className="text-2xl font-bold">{companyName}</h1>
                        <p className="text-sm opacity-80">Delivery Management System</p>
                    </div>
                </div>
                <div className="text-right">
                    <h3 className="text-xl font-semibold">Delivery Report</h3>
                    <p className="text-sm opacity-80">Period: {reportType === '7days' ? 'Last 7 Days' : reportType === '30days' ? 'Last 30 Days' : 'All Time'}</p>
                    <p className="text-xs opacity-70">Generated: {new Date().toLocaleString()}</p>
                </div>
            </div>


            <div className="grid grid-cols-4 gap-5 p-8 bg-gray-50">
                <div className="bg-white rounded-xl p-5 text-center shadow-sm border">
                    <h4 className="text-gray-500 text-sm uppercase tracking-wide">Total Deliveries</h4>
                    <p className="text-3xl font-bold text-[#03373d]">{stats.count}</p>
                </div>
                <div className="bg-white rounded-xl p-5 text-center shadow-sm border">
                    <h4 className="text-gray-500 text-sm uppercase tracking-wide">Total Revenue</h4>
                    <p className="text-3xl font-bold text-green-600">৳{stats.totalAmount.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-xl p-5 text-center shadow-sm border">
                    <h4 className="text-gray-500 text-sm uppercase tracking-wide">Unique Customers</h4>
                    <p className="text-3xl font-bold text-purple-600">{stats.uniqueCustomers}</p>
                </div>
                <div className="bg-white rounded-xl p-5 text-center shadow-sm border">
                    <h4 className="text-gray-500 text-sm uppercase tracking-wide">Avg Per Delivery</h4>
                    <p className="text-3xl font-bold text-blue-600">৳{stats.avgAmount}</p>
                </div>
            </div>


            <div className="p-8">
                <h3 className="text-lg font-semibold text-[#03373d] mb-4 border-b-2 border-[#caeb66] inline-block">📦 Delivery Details</h3>
                <div className="overflow-x-auto mt-4">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">SL</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Tracking ID</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Parcel Name</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Customer</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Weight</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Amount</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Delivery Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {parcels.map((p, idx) => (
                                <tr key={idx} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm">{idx + 1}</td>
                                    <td className="px-4 py-3 text-sm font-mono font-semibold text-[#03373d]">{p.trackingId || 'N/A'}</td>
                                    <td className="px-4 py-3 text-sm">{p.parcelName || 'N/A'}</td>
                                    <td className="px-4 py-3 text-sm">{p.senderName || 'N/A'}</td>
                                    <td className="px-4 py-3 text-sm">{p.parcelWeight || 'N/A'} kg</td>
                                    <td className="px-4 py-3 text-sm font-semibold text-green-600">৳{p.totalPrice || 0}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{new Date(p.deliveredAt || p.updatedAt || p.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>


            <div className="bg-gray-50 px-8 py-5 text-center border-t">
                <p className="text-xs text-gray-500">{companyName} Delivery Service | www.{companyName.toLowerCase()}.com | support@{companyName.toLowerCase()}.com</p>
                <p className="text-xs text-gray-400 mt-1">© {new Date().getFullYear()} {companyName}. All rights reserved.</p>
                <div className="flex justify-between mt-5 pt-4 border-t border-dashed">
                    <div className="text-center"><div className="w-32 h-px bg-gray-300 mb-2"></div><p className="text-xs text-gray-500">Customer Signature</p></div>
                    <div className="text-center"><div className="w-32 h-px bg-gray-300 mb-2"></div><p className="text-xs text-gray-500">Authorized Signature</p></div>
                    <div className="text-center"><div className="w-32 h-px bg-gray-300 mb-2"></div><p className="text-xs text-gray-500">Delivery Agent</p></div>
                </div>
            </div>
        </div>
    );
});

PrintReport.displayName = 'PrintReport';

const PrintInvoice = React.forwardRef(({ parcel, companyName, logoUrl }, ref) => {
    return (
        <div ref={ref} className="max-w-3xl mx-auto bg-white rounded-2xl overflow-hidden shadow-xl print:shadow-none">
            <div className="bg-gradient-to-r from-[#03373d] to-[#1a5c64] px-6 py-5 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                    {logoUrl && <img src={logoUrl} alt="Logo" className="w-12 h-12 object-contain bg-white rounded-xl p-1.5" />}
                    <div>
                        <h2 className="text-xl font-bold">{companyName}</h2>
                        <p className="text-xs opacity-80">Delivery Management</p>
                    </div>
                </div>
                <div className="text-right">
                    <h3 className="text-lg font-semibold">DELIVERY INVOICE</h3>
                    <p className="text-xs opacity-80">#{parcel.trackingId}</p>
                </div>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-2 gap-5 mb-5">
                    <div className="bg-gray-50 rounded-xl p-4 border">
                        <h4 className="text-sm font-semibold text-[#03373d] mb-3 border-l-3 border-l-[#caeb66] pl-2">📦 PARCEL INFORMATION</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-gray-500">Parcel Name:</span><span className="font-medium">{parcel.parcelName || 'N/A'}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Weight:</span><span className="font-medium">{parcel.parcelWeight || 'N/A'} kg</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Delivery Date:</span><span className="font-medium">{new Date(parcel.deliveredAt || parcel.updatedAt || parcel.createdAt).toLocaleString()}</span></div>
                        </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 border">
                        <h4 className="text-sm font-semibold text-[#03373d] mb-3 border-l-3 border-l-[#caeb66] pl-2">👤 CUSTOMER DETAILS</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-gray-500">Name:</span><span className="font-medium">{parcel.senderName || 'N/A'}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Phone:</span><span className="font-medium">{parcel.senderPhone || 'N/A'}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Email:</span><span className="font-medium">{parcel.senderEmail || 'N/A'}</span></div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border mb-5">
                    <h4 className="text-sm font-semibold text-[#03373d] mb-3 border-l-3 border-l-[#caeb66] pl-2">📍 DELIVERY ADDRESS</h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-gray-500">Receiver:</span><span className="font-medium">{parcel.receiverName || 'N/A'}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Phone:</span><span className="font-medium">{parcel.receiverPhone || 'N/A'}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Address:</span><span className="font-medium">{parcel.receiverAddress || 'N/A'}, {parcel.receiverDistrict || 'N/A'}</span></div>
                    </div>
                </div>

                <div className="bg-gray-100 rounded-xl p-4 flex justify-between items-center">
                    <span className="text-lg font-semibold">TOTAL AMOUNT</span>
                    <span className="text-2xl font-bold text-[#03373d]">৳{parcel.totalPrice || 0}</span>
                </div>

                <div className="text-center mt-5 pt-4 border-t border-dashed text-gray-500 text-sm">
                    Thank you for choosing {companyName}. Your parcel has been delivered successfully!
                </div>
            </div>

            <div className="bg-gray-50 px-6 py-3 text-center text-xs text-gray-500 border-t">
                <p>{companyName} Delivery Service | www.{companyName.toLowerCase()}.com | support@{companyName.toLowerCase()}.com</p>
            </div>
        </div>
    );
});

PrintInvoice.displayName = 'PrintInvoice';

const ReportsPage = () => {
    const axios = useAxios();
    const [loading, setLoading] = useState(true);
    const [parcels, setParcels] = useState([]);
    const [reportType, setReportType] = useState('7days');
    const printRef = useRef();
    const invoiceRef = useRef();
    const [currentInvoice, setCurrentInvoice] = useState(null);

    const companyName = "SpeedyX";
    const logoUrl = `${window.location.origin}/assets/mainlogo.png`;

    useEffect(() => {
        fetchAllParcels();
    }, []);

    const fetchAllParcels = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/admin/parcels/all');
            setParcels(response.data || []);
        } catch (error) {
            console.error("Error fetching parcels:", error);
        } finally {
            setLoading(false);
        }
    };

    const getFilteredParcels = () => {
        const now = new Date();
        let filterDate = new Date();

        if (reportType === '7days') {
            filterDate.setDate(now.getDate() - 7);
        } else if (reportType === '30days') {
            filterDate.setDate(now.getDate() - 30);
        } else if (reportType === 'all') {
            return parcels.filter(p => p.deliverystatus === 'delivered');
        }

        return parcels.filter(p => {
            const parcelDate = new Date(p.deliveredAt || p.updatedAt || p.createdAt);
            return p.deliverystatus === 'delivered' && parcelDate >= filterDate;
        });
    };

    const getStats = () => {
        const deliveredParcels = getFilteredParcels();
        const totalAmount = deliveredParcels.reduce((sum, p) => sum + (p.totalPrice || 0), 0);
        const uniqueCustomers = new Set(deliveredParcels.map(p => p.senderEmail)).size;

        return {
            count: deliveredParcels.length,
            totalAmount,
            uniqueCustomers,
            avgAmount: deliveredParcels.length > 0 ? (totalAmount / deliveredParcels.length).toFixed(2) : 0
        };
    };

    const handlePrint = () => {
        const printContent = printRef.current;
        const originalTitle = document.title;
        document.title = `Delivery Report - ${reportType}`;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Delivery Report</title>
                <script src="https:
                <style>
                    @media print {
                        body { margin: 0; padding: 0; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                ${printContent.outerHTML}
                <script>
                    window.onload = () => { window.print(); window.close(); }
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
        document.title = originalTitle;
    };

    const handlePrintInvoice = (parcel) => {
        setCurrentInvoice(parcel);
        setTimeout(() => {
            const printContent = invoiceRef.current;
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Invoice - ${parcel.trackingId}</title>
                    <script src="https:
                    <style>
                        @media print {
                            body { margin: 0; padding: 0; }
                        }
                    </style>
                </head>
                <body>
                    ${printContent.outerHTML}
                    <script>
                        window.onload = () => { window.print(); window.close(); }
                    </script>
                </body>
                </html>
            `);
            printWindow.document.close();
        }, 100);
    };

    const handleExportCSV = () => {
        const filteredParcels = getFilteredParcels();
        const headers = ['SL', 'Tracking ID', 'Parcel Name', 'Customer Name', 'Customer Email', 'Amount', 'Weight', 'Delivery Date'];
        const csvData = filteredParcels.map((p, idx) => [
            idx + 1, p.trackingId || 'N/A', p.parcelName || 'N/A', p.senderName || 'N/A',
            p.senderEmail || 'N/A', p.totalPrice || 0, p.parcelWeight || 'N/A',
            new Date(p.deliveredAt || p.updatedAt || p.createdAt).toLocaleDateString()
        ]);
        const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `delivery-report-${reportType}-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const stats = getStats();
    const filteredParcels = getFilteredParcels();

    if (loading) return <Loading />;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-[#03373d]">Reports & Invoices</h1>
                        <p className="text-gray-500 text-sm">Generate delivery reports and invoices</p>
                    </div>
                    <Link href='/dashboard/allparcel'>
                        <button className="text-[#03373d] cursor-pointer border border-[#03373d] px-4 py-2 rounded-lg hover:bg-[#03373d] hover:text-white transition">
                            ← Back to Parcels
                        </button>
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex gap-3">
                            <button onClick={() => setReportType('7days')} className={`px-5 py-2 cursor-pointer rounded-lg font-medium transition flex items-center gap-2 ${reportType === '7days' ? 'bg-[#03373d] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                                <FaCalendarAlt /> Last 7 Days
                            </button>
                            <button onClick={() => setReportType('30days')} className={`px-5 py-2 cursor-pointer rounded-lg font-medium transition flex items-center gap-2 ${reportType === '30days' ? 'bg-[#03373d] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                                <FaCalendarAlt /> Last 30 Days
                            </button>
                            <button onClick={() => setReportType('all')} className={`px-5 py-2 cursor-pointer rounded-lg font-medium transition flex items-center gap-2 ${reportType === 'all' ? 'bg-[#03373d] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                                <FaBox /> All Time
                            </button>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={handlePrint} className="bg-[#03373d] cursor-pointer text-white px-5 py-2 rounded-lg hover:bg-[#caeb66] hover:text-[#03373d] transition flex items-center gap-2">
                                <FaPrint /> Print Report
                            </button>
                            <button onClick={handleExportCSV} className="bg-green-600 cursor-pointer text-white px-5 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2">
                                <FaDownload /> Export CSV
                            </button>
                        </div>
                    </div>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
                    <div className="bg-white rounded-xl shadow-md p-5"><div className="flex items-center justify-between"><div><p className="text-gray-500 text-sm">Total Deliveries</p><p className="text-2xl font-bold text-[#03373d]">{stats.count}</p></div><FaTruck className="text-3xl text-[#caeb66]" /></div></div>
                    <div className="bg-white rounded-xl shadow-md p-5"><div className="flex items-center justify-between"><div><p className="text-gray-500 text-sm">Total Revenue</p><p className="text-2xl font-bold text-green-600">৳{stats.totalAmount.toLocaleString()}</p></div><FaMoneyBillWave className="text-3xl text-green-500" /></div></div>
                    <div className="bg-white rounded-xl shadow-md p-5"><div className="flex items-center justify-between"><div><p className="text-gray-500 text-sm">Unique Customers</p><p className="text-2xl font-bold text-purple-600">{stats.uniqueCustomers}</p></div><FaUserCheck className="text-3xl text-purple-500" /></div></div>
                    <div className="bg-white rounded-xl shadow-md p-5"><div className="flex items-center justify-between"><div><p className="text-gray-500 text-sm">Avg. Per Delivery</p><p className="text-2xl font-bold text-blue-600">৳{stats.avgAmount}</p></div><FaFileInvoice className="text-3xl text-blue-500" /></div></div>
                </div>


                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-5 border-b bg-gray-50"><h3 className="font-semibold text-gray-800">Delivery Details</h3><p className="text-sm text-gray-500">Showing {filteredParcels.length} deliveries</p></div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#03373d] text-white">
                                <tr><th className="px-4 py-3 text-left text-sm">SL</th><th className="px-4 py-3 text-left text-sm">Tracking ID</th><th className="px-4 py-3 text-left text-sm">Parcel Name</th><th className="px-4 py-3 text-left text-sm">Customer</th><th className="px-4 py-3 text-left text-sm">Amount</th><th className="px-4 py-3 text-left text-sm">Delivery Date</th><th className="px-4 py-3 text-left text-sm">Action</th></tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredParcels.length === 0 ? <tr><td colSpan="7" className="text-center py-8 text-gray-500">No deliveries found</td></tr> :
                                    filteredParcels.map((parcel, idx) => (
                                        <tr key={parcel._id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm">{idx + 1}</td>
                                            <td className="px-4 py-3 text-sm font-mono font-semibold text-[#03373d]">{parcel.trackingId || 'N/A'}</td>
                                            <td className="px-4 py-3 text-sm">{parcel.parcelName || 'N/A'}</td>
                                            <td className="px-4 py-3 text-sm">{parcel.senderName || 'N/A'}</td>
                                            <td className="px-4 py-3 text-sm font-semibold text-green-600">৳{parcel.totalPrice || 0}</td>
                                            <td className="px-4 py-3 text-sm text-gray-500">{new Date(parcel.deliveredAt || parcel.updatedAt || parcel.createdAt).toLocaleDateString()}</td>
                                            <td className="px-4 py-3">
                                                <button onClick={() => handlePrintInvoice(parcel)} className="text-[#03373d] cursor-pointer hover:text-[#caeb66] transition flex items-center gap-1 text-sm">
                                                    <FaPrint /> Invoice
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>


            <div className="hidden">
                <PrintReport ref={printRef} reportType={reportType} stats={stats} parcels={filteredParcels} companyName={companyName} logoUrl={logoUrl} />
                {currentInvoice && (
                    <PrintInvoice ref={invoiceRef} parcel={currentInvoice} companyName={companyName} logoUrl={logoUrl} />
                )}
            </div>
        </div>
    );
};

export default ReportsPage;