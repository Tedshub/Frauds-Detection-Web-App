// resources/js/Pages/FraudDetail.jsx
import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import Sidebar from "../Layouts/Sidebar";
import NavbarIn from "../Layouts/NavbarIn";
import {
    AlertTriangle,
    CreditCard,
    MapPin,
    Calendar,
    Clock,
    ArrowLeft,
    Download,
    Trash2,
    Edit
} from 'lucide-react';

export default function FraudDetail({ fraud }) {
    // Format date
    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    // Get category label from value
    const getCategoryLabel = (categoryValue) => {
        const categories = {
            0: "Grocery",
            1: "Online Shopping",
            2: "Gas Transport",
            3: "Restaurant",
            4: "Jewelry",
            5: "Misc",
            6: "Personal Care",
            7: "Home"
        };
        return categories[categoryValue] || "Unknown";
    };

    // Get gender label from value
    const getGenderLabel = (genderValue) => {
        return genderValue === 1 ? "Female" : "Male";
    };

    // Get day of week label from value
    const getDayOfWeekLabel = (dayValue) => {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return days[dayValue] || "Unknown";
    };

    // Get month label from value
    const getMonthLabel = (monthValue) => {
        const months = ["January", "February", "March", "April", "May", "June",
                       "July", "August", "September", "October", "November", "December"];
        return months[monthValue - 1] || "Unknown";
    };

    return (
        <>
            <Head title={`Fraud Transaction #${fraud.id}`} />
            <div className="min-h-screen h-screen flex flex-col bg-gray-50 text-gray-900">
                {/* Navbar at top, spanning full width */}
                <NavbarIn />

                <div className="flex flex-1 min-h-0 overflow-hidden">
                    {/* Sidebar */}
                    <Sidebar />

                    {/* Main Content Area */}
                    <main className="flex-1 overflow-y-auto p-4 min-w-0 bg-[#1a1c24] text-white">
                        <div className="mb-6 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/fraudsList"
                                    className="p-2 rounded-md hover:bg-gray-700 transition-colors"
                                >
                                    <ArrowLeft size={20} />
                                </Link>
                                <h1 className="text-2xl font-bold flex items-center gap-2">
                                    <AlertTriangle size={28} className="text-red-400" />
                                    Fraud Transaction Details
                                </h1>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center gap-2">
                                    <Download size={18} />
                                    Export
                                </button>
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2">
                                    <Edit size={18} />
                                    Edit
                                </button>
                                <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center gap-2">
                                    <Trash2 size={18} />
                                    Delete
                                </button>
                            </div>
                        </div>

                        {/* Alert Banner */}
                        <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-lg">
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="text-red-400" size={24} />
                                <div>
                                    <span className="text-red-400 font-medium">High Risk Transaction</span>
                                    <p className="text-red-300 text-sm mt-1">{fraud.description}</p>
                                </div>
                            </div>
                        </div>

                        {/* Transaction Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                                <h3 className="text-gray-400 text-sm mb-2">Transaction Amount</h3>
                                <p className="text-2xl font-bold text-red-400">{formatCurrency(fraud.amt)}</p>
                            </div>
                            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                                <h3 className="text-gray-400 text-sm mb-2">Card Number</h3>
                                <p className="text-xl font-mono">****-****-****-{fraud.cc_num.slice(-4)}</p>
                            </div>
                            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                                <h3 className="text-gray-400 text-sm mb-2">Transaction Date</h3>
                                <p className="text-xl">{formatDate(fraud.created_at)}</p>
                            </div>
                        </div>

                        {/* Detailed Information */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Transaction Details */}
                            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <CreditCard size={20} />
                                    Transaction Details
                                </h2>
                                <div className="space-y-3">
                                    <div className="flex justify-between pb-3 border-b border-gray-700">
                                        <span className="text-gray-400">Transaction ID</span>
                                        <span>{fraud.id}</span>
                                    </div>
                                    <div className="flex justify-between pb-3 border-b border-gray-700">
                                        <span className="text-gray-400">Category</span>
                                        <span>{getCategoryLabel(fraud.category)}</span>
                                    </div>
                                    <div className="flex justify-between pb-3 border-b border-gray-700">
                                        <span className="text-gray-400">Amount</span>
                                        <span className="text-red-400 font-bold">{formatCurrency(fraud.amt)}</span>
                                    </div>
                                    <div className="flex justify-between pb-3 border-b border-gray-700">
                                        <span className="text-gray-400">Day of Week</span>
                                        <span>{getDayOfWeekLabel(fraud.dayofweek)}</span>
                                    </div>
                                    <div className="flex justify-between pb-3 border-b border-gray-700">
                                        <span className="text-gray-400">Month</span>
                                        <span>{getMonthLabel(fraud.month)}</span>
                                    </div>
                                    <div className="flex justify-between pb-3 border-b border-gray-700">
                                        <span className="text-gray-400">Hour</span>
                                        <span>{fraud.hour}:00</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Description</span>
                                        <span className="text-right max-w-xs">{fraud.description}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Cardholder Information */}
                            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <CreditCard size={20} />
                                    Cardholder Information
                                </h2>
                                <div className="space-y-3">
                                    <div className="flex justify-between pb-3 border-b border-gray-700">
                                        <span className="text-gray-400">Card Number</span>
                                        <span className="font-mono">****-****-****-{fraud.cc_num.slice(-4)}</span>
                                    </div>
                                    <div className="flex justify-between pb-3 border-b border-gray-700">
                                        <span className="text-gray-400">Gender</span>
                                        <span>{getGenderLabel(fraud.gender)}</span>
                                    </div>
                                    <div className="flex justify-between pb-3 border-b border-gray-700">
                                        <span className="text-gray-400">Age</span>
                                        <span>{fraud.age}</span>
                                    </div>
                                    <div className="flex justify-between pb-3 border-b border-gray-700">
                                        <span className="text-gray-400">City</span>
                                        <span>{fraud.city}</span>
                                    </div>
                                    <div className="flex justify-between pb-3 border-b border-gray-700">
                                        <span className="text-gray-400">State</span>
                                        <span>{fraud.state}</span>
                                    </div>
                                    <div className="flex justify-between pb-3 border-b border-gray-700">
                                        <span className="text-gray-400">ZIP Code</span>
                                        <span>{fraud.zip}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">City Population</span>
                                        <span>{fraud.city_pop.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Location Information */}
                            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <MapPin size={20} />
                                    Location Information
                                </h2>
                                <div className="space-y-3">
                                    <div className="flex justify-between pb-3 border-b border-gray-700">
                                        <span className="text-gray-400">Cardholder Latitude</span>
                                        <span>{fraud.lat}</span>
                                    </div>
                                    <div className="flex justify-between pb-3 border-b border-gray-700">
                                        <span className="text-gray-400">Cardholder Longitude</span>
                                        <span>{fraud.long}</span>
                                    </div>
                                    <div className="flex justify-between pb-3 border-b border-gray-700">
                                        <span className="text-gray-400">Merchant Latitude</span>
                                        <span>{fraud.merch_lat}</span>
                                    </div>
                                    <div className="flex justify-between pb-3 border-b border-gray-700">
                                        <span className="text-gray-400">Merchant Longitude</span>
                                        <span>{fraud.merch_long}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Distance</span>
                                        <span>
                                            {(() => {
                                                const R = 6371; // Radius of earth in km
                                                const dLat = (fraud.merch_lat - fraud.lat) * Math.PI / 180;
                                                const dLon = (fraud.merch_long - fraud.long) * Math.PI / 180;
                                                const a = 0.5 - Math.cos(dLat)/2 + Math.cos(fraud.lat * Math.PI / 180) * Math.cos(fraud.merch_lat * Math.PI / 180) * (1 - Math.cos(dLon))/2;
                                                return `${(R * 2 * Math.asin(Math.sqrt(a))).toFixed(2)} km`;
                                            })()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* System Information */}
                            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <Clock size={20} />
                                    System Information
                                </h2>
                                <div className="space-y-3">
                                    <div className="flex justify-between pb-3 border-b border-gray-700">
                                        <span className="text-gray-400">Record ID</span>
                                        <span>{fraud.id}</span>
                                    </div>
                                    <div className="flex justify-between pb-3 border-b border-gray-700">
                                        <span className="text-gray-400">Recorded At</span>
                                        <span>{formatDate(fraud.created_at)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Last Updated</span>
                                        <span>{formatDate(fraud.updated_at)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
