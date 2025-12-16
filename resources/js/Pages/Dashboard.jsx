// resources/js/Pages/Dashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import Sidebar from "../Layouts/Sidebar";
import NavbarIn from "../Layouts/NavbarIn";
import {
    Shield,
    CreditCard,
    Zap,
    Lock,
    TrendingUp,
    CheckCircle,
    ArrowRight,
    Wallet,
    BarChart3,
    Users,
    PiggyBank,
    Calendar,
    AlertTriangle,
    TrendingUp as TrendingUpIcon,
    MapPin,
    Clock,
    User,
    ShoppingBag,
    Home
} from 'lucide-react';

export default function Dashboard({ auth, recentFrauds }) {
    const [hoveredSegment, setHoveredSegment] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [tooltipData, setTooltipData] = useState({ label: '', value: '', percentage: '' });
    const pieChartRef = useRef(null);
    const tooltipRef = useRef(null);

    // Calculate percentages for fraud detection
    const totalTransactions = 555719;
    const fraudTransactions = 2145;
    const legitimateTransactions = totalTransactions - fraudTransactions;
    const fraudPercentage = ((fraudTransactions / totalTransactions) * 100).toFixed(2);
    const legitimatePercentage = ((legitimateTransactions / totalTransactions) * 100).toFixed(2);

    // Handle mouse movement on pie chart
    const handleMouseMove = (e) => {
        if (!pieChartRef.current) return;
        const rect = pieChartRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        let degrees = angle * (180 / Math.PI) + 90;
        if (degrees < 0) degrees += 360;
        if (degrees <= fraudPercentage) {
            setHoveredSegment('fraud');
            setTooltipData({
                label: 'Fraudulent Transactions',
                value: fraudTransactions.toLocaleString(),
                percentage: `${fraudPercentage}%`
            });
        } else {
            setHoveredSegment('legitimate');
            setTooltipData({
                label: 'Legitimate Transactions',
                value: legitimateTransactions.toLocaleString(),
                percentage: `${legitimatePercentage}%`
            });
        }
        const tooltipHeight = tooltipRef.current ? tooltipRef.current.offsetHeight : 60;
        setTooltipPosition({
            x: e.clientX,
            y: e.clientY - tooltipHeight - 10
        });
    };

    const handleMouseLeave = () => {
        setHoveredSegment(null);
    };

    useEffect(() => {
        const handleResize = () => {
            if (hoveredSegment && pieChartRef.current) {
                setHoveredSegment(null);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [hoveredSegment]);

    const monthlyIncome = 555.719;

    // --- UPDATED FEATURE IMPORTANCE DATA ---
    // The 'description' property has been removed from each object.
    const featureImportance = [
        { name: 'Credit Card Number', key: 'cc_num', icon: <CreditCard className="w-5 h-5" />, importance: 92 },
        { name: 'Transaction Category', key: 'category', icon: <ShoppingBag className="w-5 h-5" />, importance: 87 },
        { name: 'Transaction Amount', key: 'amt', icon: <Wallet className="w-5 h-5" />, importance: 95 },
        { name: 'Gender', key: 'gender', icon: <User className="w-5 h-5" />, importance: 65 },
        { name: 'Location Data', key: 'location', icon: <MapPin className="w-5 h-5" />, importance: 89 },
        { name: 'Time Factors', key: 'time', icon: <Clock className="w-5 h-5" />, importance: 78 },
        { name: 'Cardholder Age', key: 'age', icon: <Users className="w-5 h-5" />, importance: 71 }
    ];
    // --- END UPDATED FEATURE IMPORTANCE DATA ---

    // --- HELPER FUNCTIONS ---
    const formatDate = (dateString) => {
        const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', }).format(amount);
    };
    // --- END HELPER FUNCTIONS ---

    return (
        <>
            <Head title="Dashboard - Credit Card App" />
            <div className="min-h-screen h-screen flex flex-col bg-gray-50 text-gray-900">
                <NavbarIn auth={auth} />
                <div className="flex flex-1 min-h-0 overflow-hidden">
                    <Sidebar />
                    <main className="flex-1 overflow-y-auto p-4 min-w-0 bg-[#1a1c24] text-white">
                        <div className="mb-6">
                            <p className="text-purple-200">Here's your transactions overview</p>
                        </div>
                        <div className="mb-8">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 shadow-lg">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                            <BarChart3 className="w-6 h-6 text-white" />
                                        </div>
                                        <span className="text-l text-purple-200-bold bg-purple-900/50 px-2 py-1 rounded-full">Total</span>
                                    </div>
                                    <div className="text-5xl font-bold mb-1">{totalTransactions.toLocaleString()}</div>
                                    <div className="text-xl text-purple-200">Transactions</div>
                                </div>
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="bg-gradient-to-br from-purple-600/50 to-purple-800/50 border border-green-700/30 rounded-lg p-4 flex items-start gap-3">
                                        <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                            <TrendingUpIcon className="w-5 h-5 text-green-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-green-400 mb-1">Excellent Transaction Volume!</h3>
                                            <p className="text-sm text-green-200">Congratulations! You've processed {totalTransactions.toLocaleString()} transactions. Keep up the great work!</p>
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-r from-red-900/30 to-red-800/20 border border-red-700/30 rounded-lg p-4 flex items-start gap-3">
                                        <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                            <AlertTriangle className="w-5 h-5 text-red-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-red-400 mb-1">Fraud Detected</h3>
                                            <p className="text-sm text-red-200">Our system has detected {fraudTransactions.toLocaleString()} fraudulent transactions ({fraudPercentage}%).<span className="block mt-1">See detailed analysis in <a href="#fraud-detection" className="underline font-medium">Transaction Security section</a> below.</span></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="fraud-detection" className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                            <div className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                                <h2 className="text-2xl font-bold mb-4">Transaction Security</h2>
                                <div className="relative">
                                    <div ref={pieChartRef} className="relative w-64 h-64 mx-auto cursor-pointer" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-purple-700"></div>
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500 to-red-700 transition-all duration-300" style={{ clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.sin(2 * Math.PI * (fraudPercentage / 100))}% ${50 - 50 * Math.cos(2 * Math.PI * (fraudPercentage / 100))}%)`, transform: hoveredSegment === 'fraud' ? 'scale(1.05)' : 'scale(1)', transformOrigin: 'center', zIndex: hoveredSegment === 'fraud' ? 10 : 1 }}></div>
                                        <div className="absolute inset-8 rounded-full bg-[#10121f] flex items-center justify-center z-20"><div className="text-center"><div className="text-2xl font-bold">{fraudPercentage}%</div><div className="text-xs text-purple-300">Fraud Rate</div></div></div>
                                        <div className="absolute inset-8 rounded-full bg-purple-500/20 animate-ping"></div>
                                    </div>
                                    <div className="flex justify-center mt-6 space-x-6">
                                        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-gradient-to-br from-purple-500 to-purple-700 rounded"></div><span className="text-sm">Legitimate ({legitimatePercentage}%)</span></div>
                                        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-gradient-to-br from-red-500 to-red-700 rounded"></div><span className="text-sm">Fraud ({fraudPercentage}%)</span></div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                                <h2 className="text-2xl font-bold mb-4">Transaction Analysis</h2>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center"><span className="text-purple-200">Total Transactions</span><span className="text-xl font-bold">{totalTransactions.toLocaleString()}</span></div>
                                    <div className="flex justify-between items-center"><span className="text-purple-200">Legitimate Transactions</span><span className="text-xl font-bold text-green-400">{legitimateTransactions.toLocaleString()}</span></div>
                                    <div className="flex justify-between items-center"><span className="text-purple-200">Fraudulent Transactions</span><span className="text-xl font-bold text-red-400">{fraudTransactions.toLocaleString()}</span></div>
                                </div>
                                <div className="mt-6 p-4 bg-purple-900/30 rounded-lg">
                                    <h3 className="font-semibold mb-2">How Our AI Works</h3>
                                    <p className="text-sm text-purple-200">Our advanced machine learning algorithms analyze transaction patterns in real-time, identifying suspicious activities with remarkable accuracy.</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl font-bold">Recent Fraud Activity</h2>
                                    <Link href="/fraudsList" className="text-sm text-purple-400 hover:text-purple-300 underline">View All</Link>
                                </div>
                                <div className="space-y-3">
                                    {recentFrauds && recentFrauds.length > 0 ? (
                                        recentFrauds.map((fraud) => (
                                            <div key={fraud.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <AlertTriangle className="w-5 h-5 text-red-400" />
                                                    </div>
                                                    <div>
                                                        <div className="font-mono text-sm">****-****-****-{fraud.cc_num.slice(-4)}</div>
                                                        <div className="text-xs text-gray-400 truncate max-w-xs" title={fraud.description}>{fraud.description}</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-red-400 font-medium">{formatCurrency(fraud.amt)}</div>
                                                    <div className="text-xs text-gray-400">{formatDate(fraud.created_at)}</div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center text-gray-400 py-8">No recent fraudulent activity detected.</div>
                                    )}
                                </div>
                            </div>
                            {/* --- UPDATED FEATURE IMPORTANCE SECTION --- */}
                            <div className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                                <h2 className="text-2xl font-bold mb-4">Feature Importance</h2>
                                <p className="text-sm text-purple-200 mb-4">Key factors our AI model uses to detect fraudulent transactions</p>
                                <div className="space-y-3">
                                    {featureImportance.map((feature, index) => (
                                        <div key={index} className="p-3 bg-white/5 rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${feature.importance >= 90 ? 'bg-red-500/20' : feature.importance >= 80 ? 'bg-orange-500/20' : feature.importance >= 70 ? 'bg-yellow-500/20' : 'bg-blue-500/20'}`}>
                                                        <div className={`${feature.importance >= 90 ? 'text-red-400' : feature.importance >= 80 ? 'text-orange-400' : feature.importance >= 70 ? 'text-yellow-400' : 'text-blue-400'}`}>{feature.icon}</div>
                                                    </div>
                                                    <div className="font-medium">{feature.name}</div>
                                                </div>
                                                <div className={`font-medium ${feature.importance >= 90 ? 'text-red-400' : feature.importance >= 80 ? 'text-orange-400' : feature.importance >= 70 ? 'text-yellow-400' : 'text-blue-400'}`}>{feature.importance}%</div>
                                            </div>
                                            <div className="w-full bg-gray-700 rounded-full h-2.5">
                                                <div
                                                    className={`h-2.5 rounded-full transition-all duration-500 ${
                                                        feature.importance >= 90 ? 'bg-red-400' :
                                                        feature.importance >= 80 ? 'bg-orange-400' :
                                                        feature.importance >= 70 ? 'bg-yellow-400' :
                                                        'bg-blue-400'
                                                    }`}
                                                    style={{ width: `${feature.importance}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* --- END UPDATED FEATURE IMPORTANCE SECTION --- */}
                        </div>
                    </main>
                </div>
            </div>
            {hoveredSegment && (
                <div ref={tooltipRef} className="fixed z-50 bg-white text-gray-800 p-3 rounded-lg shadow-xl pointer-events-none" style={{ left: `${tooltipPosition.x}px`, top: `${tooltipPosition.y}px`, transform: 'translateX(-50%)' }}>
                    <div className="font-bold text-sm">{tooltipData.label}</div>
                    <div className="text-lg">{tooltipData.value} ({tooltipData.percentage})</div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white"></div>
                </div>
            )}
        </>
    );
}
