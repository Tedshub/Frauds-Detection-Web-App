import React, { useState, useEffect, useRef } from 'react';
import { Head } from '@inertiajs/react';
import Sidebar from "../Layouts/Sidebar";
import NavbarIn from "../Layouts/NavbarIn";
import { Shield, CreditCard, Zap, Lock, TrendingUp, CheckCircle, ArrowRight, Wallet, BarChart3, Users, PiggyBank, Calendar, AlertTriangle, TrendingUp as TrendingUpIcon } from 'lucide-react';

export default function Dashboard({ auth }) {
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

        // Calculate angle from center to mouse position
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        // Convert to degrees and normalize to 0-360
        let degrees = angle * (180 / Math.PI) + 90;
        if (degrees < 0) degrees += 360;

        // Determine which segment is being hovered
        // Fraud segment is from 0 to fraudPercentage degrees
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

        // Position tooltip above cursor
        const tooltipHeight = tooltipRef.current ? tooltipRef.current.offsetHeight : 60;
        setTooltipPosition({
            x: e.clientX,
            y: e.clientY - tooltipHeight - 10 // 10px offset above cursor
        });
    };

    const handleMouseLeave = () => {
        setHoveredSegment(null);
    };

    // Handle tooltip positioning on window resize
    useEffect(() => {
        const handleResize = () => {
            if (hoveredSegment && pieChartRef.current) {
                // Recalculate position if tooltip is visible
                const rect = pieChartRef.current.getBoundingClientRect();
                const tooltipHeight = tooltipRef.current ? tooltipRef.current.offsetHeight : 60;

                // We'll just hide tooltip on resize to avoid positioning issues
                setHoveredSegment(null);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [hoveredSegment]);

    // Sample data for dashboard
    const monthlyIncome = 555.719;

    return (
        <>
            <Head title="Dashboard - Group Finances" />
            <div className="min-h-screen h-screen flex flex-col bg-gray-50 text-gray-900">
                {/* Navbar at the top, spanning full width */}
                <NavbarIn auth={auth} />

                <div className="flex flex-1 min-h-0 overflow-hidden">
                    {/* Sidebar */}
                    <Sidebar />

                    {/* Main Content Area */}
                    <main className="flex-1 overflow-y-auto p-8 min-w-0 bg-[#1a1c24] text-white">
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {auth.user.name}!</h1>
                            <p className="text-purple-200">Here's your transactions overview</p>
                        </div>

                        {/* Financial Summary Cards with Appreciation and Warning Messages */}
                        <div className="mb-8">
                            {/* Two-column layout for card and messages */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Total Transactions Card */}
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

                                {/* Appreciation and Warning Messages - stacked vertically */}
                                <div className="lg:col-span-2 space-y-6">
                                    {/* Appreciation Message */}
                                    <div className="bg-gradient-to-br from-purple-600/50 to-purple-800/50 border border-green-700/30 rounded-lg p-4 flex items-start gap-3">
                                        <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                            <TrendingUpIcon className="w-5 h-5 text-green-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-green-400 mb-1">Excellent Transaction Volume!</h3>
                                            <p className="text-sm text-green-200">
                                                Congratulations! You've processed {totalTransactions.toLocaleString()} transactions. Keep up the great work!
                                            </p>
                                        </div>
                                    </div>

                                    {/* Fraud Warning Message */}
                                    <div className="bg-gradient-to-r from-red-900/30 to-red-800/20 border border-red-700/30 rounded-lg p-4 flex items-start gap-3">
                                        <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                            <AlertTriangle className="w-5 h-5 text-red-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-red-400 mb-1">Fraud Detected</h3>
                                            <p className="text-sm text-red-200">
                                                Our system has detected {fraudTransactions.toLocaleString()} fraudulent transactions ({fraudPercentage}%).
                                                <span className="block mt-1">See detailed analysis in <a href="#fraud-detection" className="underline font-medium">Transaction Security section</a> below.</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Fraud Detection Statistics Section */}
                        <div id="fraud-detection" className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                            <div className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                                <h2 className="text-2xl font-bold mb-4">Transaction Security</h2>
                                <div className="relative">
                                    {/* Pie Chart Container */}
                                    <div
                                        ref={pieChartRef}
                                        className="relative w-64 h-64 mx-auto cursor-pointer"
                                        onMouseMove={handleMouseMove}
                                        onMouseLeave={handleMouseLeave}
                                    >
                                        {/* Background Circle */}
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-purple-700"></div>

                                        {/* Fraud Segment */}
                                        <div
                                            className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500 to-red-700 transition-all duration-300"
                                            style={{
                                                clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.sin(2 * Math.PI * (fraudPercentage / 100))}% ${50 - 50 * Math.cos(2 * Math.PI * (fraudPercentage / 100))}%)`,
                                                transform: hoveredSegment === 'fraud' ? 'scale(1.05)' : 'scale(1)',
                                                transformOrigin: 'center',
                                                zIndex: hoveredSegment === 'fraud' ? 10 : 1
                                            }}
                                        ></div>

                                        {/* Center Circle (to create donut effect) */}
                                        <div className="absolute inset-8 rounded-full bg-[#10121f] flex items-center justify-center z-20">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold">{fraudPercentage}%</div>
                                                <div className="text-xs text-purple-300">Fraud Rate</div>
                                            </div>
                                        </div>

                                        {/* Center Pulse Animation */}
                                        <div className="absolute inset-8 rounded-full bg-purple-500/20 animate-ping"></div>
                                    </div>

                                    {/* Legend */}
                                    <div className="flex justify-center mt-6 space-x-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 bg-gradient-to-br from-purple-500 to-purple-700 rounded"></div>
                                            <span className="text-sm">Legitimate ({legitimatePercentage}%)</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 bg-gradient-to-br from-red-500 to-red-700 rounded"></div>
                                            <span className="text-sm">Fraud ({fraudPercentage}%)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                                <h2 className="text-2xl font-bold mb-4">Transaction Analysis</h2>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-purple-200">Total Transactions</span>
                                        <span className="text-xl font-bold">{totalTransactions.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-purple-200">Legitimate Transactions</span>
                                        <span className="text-xl font-bold text-green-400">{legitimateTransactions.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-purple-200">Fraudulent Transactions</span>
                                        <span className="text-xl font-bold text-red-400">{fraudTransactions.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="mt-6 p-4 bg-purple-900/30 rounded-lg">
                                    <h3 className="font-semibold mb-2">How Our AI Works</h3>
                                    <p className="text-sm text-purple-200">
                                        Our advanced machine learning algorithms analyze transaction patterns in real-time, identifying suspicious activities with remarkable accuracy.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity & Pending Requests */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                                <h2 className="text-2xl font-bold mb-4">Recent Transactions</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                                                <ArrowRight className="w-5 h-5 text-green-400" />
                                            </div>
                                            <div>
                                                <div className="font-medium">Payment Received</div>
                                                <div className="text-xs text-purple-200">From John Doe</div>
                                            </div>
                                        </div>
                                        <div className="text-green-400 font-medium">+$250.00</div>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                                                <ArrowRight className="w-5 h-5 text-red-400 transform rotate-180" />
                                            </div>
                                            <div>
                                                <div className="font-medium">Payment Sent</div>
                                                <div className="text-xs text-purple-200">To Jane Smith</div>
                                            </div>
                                        </div>
                                        <div className="text-red-400 font-medium">-$120.00</div>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                                                <Calendar className="w-5 h-5 text-purple-400" />
                                            </div>
                                            <div>
                                                <div className="font-medium">Scheduled Payment</div>
                                                <div className="text-xs text-purple-200">Rent - Due in 5 days</div>
                                            </div>
                                        </div>
                                        <div className="text-purple-400 font-medium">$1,200.00</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                                <h2 className="text-2xl font-bold mb-4">Group Activity</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                                                <Users className="w-5 h-5 text-blue-400" />
                                            </div>
                                            <div>
                                                <div className="font-medium">Family Group</div>
                                                <div className="text-xs text-purple-200">New expense added by Mom</div>
                                            </div>
                                        </div>
                                        <div className="text-blue-400 font-medium">2 hours ago</div>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                                                <CheckCircle className="w-5 h-5 text-green-400" />
                                            </div>
                                            <div>
                                                <div className="font-medium">Roommates Group</div>
                                                <div className="text-xs text-purple-200">Monthly contribution completed</div>
                                            </div>
                                        </div>
                                        <div className="text-green-400 font-medium">Yesterday</div>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                                                <Calendar className="w-5 h-5 text-yellow-400" />
                                            </div>
                                            <div>
                                                <div className="font-medium">Trip Planning Group</div>
                                                <div className="text-xs text-purple-200">Payment reminder for hotel</div>
                                            </div>
                                        </div>
                                        <div className="text-yellow-400 font-medium">3 days ago</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* Global Tooltip - positioned absolutely in viewport */}
            {hoveredSegment && (
                <div
                    ref={tooltipRef}
                    className="fixed z-50 bg-white text-gray-800 p-3 rounded-lg shadow-xl pointer-events-none"
                    style={{
                        left: `${tooltipPosition.x}px`,
                        top: `${tooltipPosition.y}px`,
                        transform: 'translateX(-50%)'
                    }}
                >
                    <div className="font-bold text-sm">
                        {tooltipData.label}
                    </div>
                    <div className="text-lg">
                        {tooltipData.value} ({tooltipData.percentage})
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white"></div>
                </div>
            )}
        </>
    );
}
