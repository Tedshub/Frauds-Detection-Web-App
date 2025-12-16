// resources/js/Pages/FraudsPage.jsx
// resources/js/Pages/FraudsPage.jsx
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
    ChevronDown,
    ChevronUp,
    Search,
    Filter,
    Download,
    Eye,
    Trash2
} from 'lucide-react';

export default function FraudsPage({ frauds }) {
    const [expandedRows, setExpandedRows] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');

    // Toggle row expansion
    const toggleRowExpansion = (id) => {
        if (expandedRows.includes(id)) {
            setExpandedRows(expandedRows.filter(rowId => rowId !== id));
        } else {
            setExpandedRows([...expandedRows, id]);
        }
    };

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

    // Filter frauds based on search term and category
    const filteredFrauds = frauds.data.filter(fraud => {
        const matchesSearch =
            fraud.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            fraud.cc_num.includes(searchTerm) ||
            fraud.zip.includes(searchTerm);

        const matchesCategory = filterCategory === 'all' ||
                               (filterCategory === 'high' && fraud.amt > 500) ||
                               (filterCategory === 'medium' && fraud.amt > 100 && fraud.amt <= 500) ||
                               (filterCategory === 'low' && fraud.amt <= 100);

        return matchesSearch && matchesCategory;
    });

    return (
        <>
            <Head title="Fraudulent Transactions" />
            <div className="min-h-screen h-screen flex flex-col bg-gray-50 text-gray-900">
                {/* Navbar at top, spanning full width */}
                <NavbarIn />

                <div className="flex flex-1 min-h-0 overflow-hidden">
                    {/* Sidebar */}
                    <Sidebar />

                    {/* Main Content Area */}
                    <main className="flex-1 overflow-y-auto p-4 min-w-0 bg-[#1a1c24] text-white">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold flex items-center gap-2">
                                <AlertTriangle size={28} className="text-red-400" />
                                Fraudulent Transactions
                            </h1>
                            <p className="text-purple-200">View and manage detected fraudulent transactions</p>
                        </div>

                        {/* Search and Filter Controls */}
                        <div className="mb-6 flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search by description, card number, or ZIP..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Filter size={20} className="text-gray-400" />
                                <select
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                    className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                                >
                                    <option value="all">All Amounts</option>
                                    <option value="high">High (&gt;$500)</option>
                                    <option value="medium">Medium ($100-$500)</option>
                                    <option value="low">Low (&lt;$100)</option>
                                </select>
                            </div>
                            <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center gap-2">
                                <Download size={18} />
                                Export
                            </button>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-400 text-sm">Total Fraud Cases</p>
                                        <p className="text-2xl font-bold">{frauds.total}</p>
                                    </div>
                                    <AlertTriangle className="text-red-400" size={24} />
                                </div>
                            </div>
                            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-400 text-sm">Total Amount Lost</p>
                                        <p className="text-2xl font-bold">
                                            ${frauds.data.reduce((sum, fraud) => sum + parseFloat(fraud.amt), 0).toFixed(2)}
                                        </p>
                                    </div>
                                    <CreditCard className="text-red-400" size={24} />
                                </div>
                            </div>
                            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-400 text-sm">Average Fraud Amount</p>
                                        <p className="text-2xl font-bold">
                                            ${frauds.data.length > 0 ? (frauds.data.reduce((sum, fraud) => sum + parseFloat(fraud.amt), 0) / frauds.data.length).toFixed(2) : '0.00'}
                                        </p>
                                    </div>
                                    <CreditCard className="text-yellow-400" size={24} />
                                </div>
                            </div>
                            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-400 text-sm">Most Common Category</p>
                                        <p className="text-2xl font-bold">
                                            {frauds.data.length > 0 ?
                                                (() => {
                                                    const categoryCounts = {};
                                                    frauds.data.forEach(fraud => {
                                                        const category = getCategoryLabel(fraud.category);
                                                        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
                                                    });
                                                    return Object.keys(categoryCounts).reduce((a, b) =>
                                                        categoryCounts[a] > categoryCounts[b] ? a : b, "Unknown"
                                                    );
                                                })() :
                                                "N/A"
                                            }
                                        </p>
                                    </div>
                                    <AlertTriangle className="text-yellow-400" size={24} />
                                </div>
                            </div>
                        </div>

                        {/* Fraud Table */}
                        <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-900">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                Transaction Details
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                Card Information
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                Amount
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                Location
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                Date & Time
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {filteredFrauds.length > 0 ? (
                                            filteredFrauds.map((fraud) => (
                                                <React.Fragment key={fraud.id}>
                                                    <tr className="hover:bg-gray-700/50 transition-colors">
                                                        <td className="px-4 py-4">
                                                            <div>
                                                                <p className="font-medium text-white truncate max-w-xs">
                                                                    {fraud.description}
                                                                </p>
                                                                <p className="text-sm text-gray-400">
                                                                    {getCategoryLabel(fraud.category)} • {getGenderLabel(fraud.gender)} • Age: {fraud.age}
                                                                </p>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <div className="font-mono text-sm">
                                                                ****-****-****-{fraud.cc_num.slice(-4)}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <div className="font-bold text-red-400">
                                                                {formatCurrency(fraud.amt)}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <div className="flex items-center text-sm">
                                                                <MapPin size={16} className="mr-1 text-gray-400" />
                                                                {fraud.city}, {fraud.state}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <div className="text-sm">
                                                                <div className="flex items-center">
                                                                    <Calendar size={16} className="mr-1 text-gray-400" />
                                                                    {formatDate(fraud.created_at)}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <div className="flex items-center space-x-2">
                                                                <button
                                                                    onClick={() => toggleRowExpansion(fraud.id)}
                                                                    className="p-1 rounded hover:bg-gray-600 transition-colors"
                                                                    title={expandedRows.includes(fraud.id) ? "Collapse Details" : "Expand Details"}
                                                                >
                                                                    {expandedRows.includes(fraud.id) ?
                                                                        <ChevronUp size={18} /> :
                                                                        <ChevronDown size={18} />
                                                                    }
                                                                </button>
                                                                <Link
                                                                    href={`/frauds/${fraud.id}`}
                                                                    className="p-1 rounded hover:bg-gray-600 transition-colors"
                                                                    title="View Details"
                                                                >
                                                                    <Eye size={18} />
                                                                </Link>
                                                                <button
                                                                    className="p-1 rounded hover:bg-red-600 transition-colors text-red-400"
                                                                    title="Delete Record"
                                                                >
                                                                    <Trash2 size={18} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    {expandedRows.includes(fraud.id) && (
                                                        <tr>
                                                            <td colSpan="6" className="px-4 py-4 bg-gray-900/50">
                                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                                    <div>
                                                                        <h4 className="font-semibold text-sm text-gray-400 mb-2">Transaction Information</h4>
                                                                        <div className="space-y-1 text-sm">
                                                                            <div className="flex justify-between">
                                                                                <span className="text-gray-400">Category:</span>
                                                                                <span>{getCategoryLabel(fraud.category)}</span>
                                                                            </div>
                                                                            <div className="flex justify-between">
                                                                                <span className="text-gray-400">Amount:</span>
                                                                                <span className="text-red-400 font-bold">{formatCurrency(fraud.amt)}</span>
                                                                            </div>
                                                                            <div className="flex justify-between">
                                                                                <span className="text-gray-400">Date:</span>
                                                                                <span>{getDayOfWeekLabel(fraud.dayofweek)}, {getMonthLabel(fraud.month)}</span>
                                                                            </div>
                                                                            <div className="flex justify-between">
                                                                                <span className="text-gray-400">Time:</span>
                                                                                <span>{fraud.hour}:00</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="font-semibold text-sm text-gray-400 mb-2">Cardholder Information</h4>
                                                                        <div className="space-y-1 text-sm">
                                                                            <div className="flex justify-between">
                                                                                <span className="text-gray-400">Card Number:</span>
                                                                                <span className="font-mono">****-****-****-{fraud.cc_num.slice(-4)}</span>
                                                                            </div>
                                                                            <div className="flex justify-between">
                                                                                <span className="text-gray-400">Gender:</span>
                                                                                <span>{getGenderLabel(fraud.gender)}</span>
                                                                            </div>
                                                                            <div className="flex justify-between">
                                                                                <span className="text-gray-400">Age:</span>
                                                                                <span>{fraud.age}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="font-semibold text-sm text-gray-400 mb-2">Location Information</h4>
                                                                        <div className="space-y-1 text-sm">
                                                                            <div className="flex justify-between">
                                                                                <span className="text-gray-400">City:</span>
                                                                                <span>{fraud.city}</span>
                                                                            </div>
                                                                            <div className="flex justify-between">
                                                                                <span className="text-gray-400">State:</span>
                                                                                <span>{fraud.state}</span>
                                                                            </div>
                                                                            <div className="flex justify-between">
                                                                                <span className="text-gray-400">ZIP Code:</span>
                                                                                <span>{fraud.zip}</span>
                                                                            </div>
                                                                            <div className="flex justify-between">
                                                                                <span className="text-gray-400">City Population:</span>
                                                                                <span>{fraud.city_pop.toLocaleString()}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="font-semibold text-sm text-gray-400 mb-2">Geographic Coordinates</h4>
                                                                        <div className="space-y-1 text-sm">
                                                                            <div className="flex justify-between">
                                                                                <span className="text-gray-400">Cardholder Lat:</span>
                                                                                <span>{fraud.lat}</span>
                                                                            </div>
                                                                            <div className="flex justify-between">
                                                                                <span className="text-gray-400">Cardholder Long:</span>
                                                                                <span>{fraud.long}</span>
                                                                            </div>
                                                                            <div className="flex justify-between">
                                                                                <span className="text-gray-400">Merchant Lat:</span>
                                                                                <span>{fraud.merch_lat}</span>
                                                                            </div>
                                                                            <div className="flex justify-between">
                                                                                <span className="text-gray-400">Merchant Long:</span>
                                                                                <span>{fraud.merch_long}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="md:col-span-2 lg:col-span-1">
                                                                        <h4 className="font-semibold text-sm text-gray-400 mb-2">Additional Information</h4>
                                                                        <div className="space-y-1 text-sm">
                                                                            <div className="flex justify-between">
                                                                                <span className="text-gray-400">Record ID:</span>
                                                                                <span>{fraud.id}</span>
                                                                            </div>
                                                                            <div className="flex justify-between">
                                                                                <span className="text-gray-400">Recorded At:</span>
                                                                                <span>{formatDate(fraud.created_at)}</span>
                                                                            </div>
                                                                            <div className="flex justify-between">
                                                                                <span className="text-gray-400">Last Updated:</span>
                                                                                <span>{formatDate(fraud.updated_at)}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="px-4 py-8 text-center text-gray-400">
                                                    {searchTerm || filterCategory !== 'all' ?
                                                        'No fraudulent transactions match your search criteria.' :
                                                        'No fraudulent transactions found.'
                                                    }
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Pagination */}
                        {frauds.links && (
                            <div className="mt-6 flex justify-between items-center">
                                <div className="text-sm text-gray-400">
                                    Showing {frauds.from || 0} to {frauds.to || 0} of {frauds.total} results
                                </div>
                                <div className="flex space-x-1">
                                    {frauds.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`px-3 py-1 rounded-md text-sm ${
                                                link.active
                                                    ? 'bg-purple-600 text-white'
                                                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                            } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </>
    );
}
