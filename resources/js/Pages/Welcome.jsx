import React, { useState, useEffect, useRef } from 'react';
import { Shield, CreditCard, Zap, Lock, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
    const [hoveredSegment, setHoveredSegment] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [tooltipData, setTooltipData] = useState({ label: '', value: '', percentage: '' });
    const pieChartRef = useRef(null);
    const tooltipRef = useRef(null);

    // Calculate percentages
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

    return (
        <div className="relative text-white min-h-screen overflow-hidden bg-[#10121f]">
            {/* Background Gradient Circles */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-[#e7c8bc] opacity-60 blur-3xl -translate-x-1/4 -translate-y-1/4"></div>
                <div className="absolute top-10 left-10 w-[800px] h-[800px] rounded-full bg-[#aa86cc] opacity-50 blur-3xl -translate-x-1/5 -translate-y-1/5"></div>
                <div className="absolute top-20 left-20 w-[1000px] h-[1000px] rounded-full bg-[#6a4dab] opacity-40 blur-3xl -translate-x-1/6 -translate-y-1/6"></div>
                <div className="absolute top-40 left-40 w-[1200px] h-[1200px] rounded-full bg-[#10121f] opacity-60 blur-3xl -translate-x-1/8 -translate-y-1/8"></div>
            </div>

            {/* Content wrapper */}
            <div className="relative z-10">
                {/* Navbar */}
                <nav className="fixed top-0 w-full z-50 bg-[#10121f]/80 backdrop-blur-md border-b border-white/10">
                    <div className="max-w-7xl mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CreditCard className="w-8 h-8 text-purple-400" />
                                <span className="text-2xl font-bold">SecureCard</span>
                            </div>
                            <div className="flex items-center gap-4">
                                {auth?.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="px-6 py-2.5 bg-white text-purple-900 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="px-6 py-2.5 text-white hover:text-gray-200 transition-colors duration-300 font-medium"
                                        >
                                            Log In
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="px-6 py-2.5 bg-white text-purple-900 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg"
                                        >
                                            Join Now
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section - Padding increased */}
                <section className="pt-40 pb-32 px-12">
                    <div className="max-w-full mx-auto">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="space-y-8">
                                <h1 className="text-5xl lg:text-5xl font-bold leading-tight">
                                    Secure Payments with{' '}
                                    <span className="inline-block bg-white/70 text-purple-900 px-4 py-1 rounded-full">
                                        AI-Powered
                                    </span>{' '}
                                    Fraud Detection
                                </h1>
                                <p className="text-xl text-purple-100 leading-relaxed">
                                    Experience future of credit card transactions with our intelligent machine learning system that protects you from fraud in real-time.
                                </p>
                                <div className="flex gap-4">
                                    {auth?.user ? (
                                        <Link
                                            href={route('dashboard')}
                                            className="px-8 py-4 bg-white text-purple-900 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-2xl flex items-center gap-2"
                                        >
                                            Dashboard
                                            <ArrowRight className="w-5 h-5" />
                                        </Link>
                                    ) : (
                                        <Link
                                            href={route('register')}
                                            className="px-8 py-4 bg-white text-purple-900 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-2xl flex items-center gap-2"
                                        >
                                            Start Now
                                            <ArrowRight className="w-5 h-5" />
                                        </Link>
                                    )}
                                    <button className="px-8 py-4 bg-purple-800/50 backdrop-blur-sm text-white rounded-full font-bold text-lg hover:bg-purple-800/70 transition-all duration-300 border border-white/20">
                                        Learn More
                                    </button>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="relative w-full h-96 flex items-center justify-center">
                                    {/* Orbiting circles */}
                                    <div className="absolute w-80 h-80 border-2 border-purple-400/30 rounded-full"></div>
                                    <div className="absolute w-96 h-96 border-2 border-purple-400/20 rounded-full"></div>

                                    {/* Center text */}
                                    <div className="relative z-10 text-center">
                                        <div className="text-6xl font-bold">99.9%</div>
                                        <div className="text-xl text-purple-200 mt-2">Detection Rate</div>
                                    </div>

                                    {/* Floating icons with animation */}
                                    <div className="absolute top-8 right-12 w-16 h-16 bg-purple-500/20 backdrop-blur-md rounded-full flex items-center justify-center border border-purple-400/30 animate-float">
                                        <Shield className="w-8 h-8 text-purple-300" />
                                    </div>
                                    <div className="absolute bottom-12 left-8 w-16 h-16 bg-purple-500/20 backdrop-blur-md rounded-full flex items-center justify-center border border-purple-400/30 animate-float-delayed">
                                        <Lock className="w-8 h-8 text-purple-300" />
                                    </div>
                                    <div className="absolute top-1/3 left-4 w-16 h-16 bg-purple-500/20 backdrop-blur-md rounded-full flex items-center justify-center border border-purple-400/30 animate-float">
                                        <Zap className="w-8 h-8 text-purple-300" />
                                    </div>
                                    <div className="absolute bottom-1/4 right-8 w-16 h-16 bg-purple-500/20 backdrop-blur-md rounded-full flex items-center justify-center border border-purple-400/30 animate-float-delayed">
                                        <TrendingUp className="w-8 h-8 text-purple-300" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Fraud Detection Statistics Section - Padding increased */}
                <section className="py-20 px-12 bg-black/20">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                                Real-World Fraud Detection
                            </h2>
                            <p className="text-xl text-purple-200">
                                Our AI system analyzes millions of transactions to keep your money safe
                            </p>
                        </div>
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="relative">
                                {/* Pie Chart Container */}
                                <div
                                    ref={pieChartRef}
                                    className="relative w-80 h-80 mx-auto cursor-pointer"
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
                                            <div className="text-3xl font-bold">{fraudPercentage}%</div>
                                            <div className="text-sm text-purple-300">Fraud Rate</div>
                                        </div>
                                    </div>

                                    {/* Center Pulse Animation */}
                                    <div className="absolute inset-8 rounded-full bg-purple-500/20 animate-ping"></div>
                                </div>

                                {/* Legend */}
                                <div className="flex justify-center mt-8 space-x-8">
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

                            <div className="space-y-6">
                                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                                    <h3 className="text-2xl font-bold mb-4">Transaction Analysis</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-purple-200">Total Transactions</span>
                                            <span className="text-2xl font-bold">{totalTransactions.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-purple-200">Legitimate Transactions</span>
                                            <span className="text-2xl font-bold text-green-400">{legitimateTransactions.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-purple-200">Fraudulent Transactions</span>
                                            <span className="text-2xl font-bold text-red-400">{fraudTransactions.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                                    <h3 className="text-2xl font-bold mb-4">How Our AI Works</h3>
                                    <p className="text-purple-100 leading-relaxed">
                                        Our advanced machine learning algorithms analyze transaction patterns in real-time, identifying suspicious activities with remarkable accuracy. By processing over 500,000 transactions monthly, our system continuously learns and adapts to new fraud techniques, keeping your financial information secure.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Security & Ease Section - Padding increased */}
                <section className="py-20 px-12">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                                Security Meets Simplicity
                            </h2>
                            <p className="text-xl text-purple-200">
                                Protected by advanced AI, designed for everyone
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center mb-6">
                                    <Shield className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Maximum Security</h3>
                                <p className="text-purple-100 text-lg leading-relaxed">
                                    Our intelligent machine learning algorithm analyzes every transaction in real-time, detecting suspicious patterns and preventing fraud before it happens. Your money is protected 24/7.
                                </p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
                                <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-6">
                                    <Zap className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Lightning Fast</h3>
                                <p className="text-purple-100 text-lg leading-relaxed">
                                    Complete transactions in seconds with our optimized payment processing system. No delays, no hassle—just seamless, instant payments whenever you need them.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section - Padding increased */}
                <section className="py-20 px-12 bg-black/20">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                                Powerful Features
                            </h2>
                            <p className="text-xl text-purple-200">
                                Everything you need for secure transactions
                            </p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-400/50 transition-all duration-300">
                                <div className="w-12 h-12 bg-purple-500/30 rounded-xl flex items-center justify-center mb-4">
                                    <Lock className="w-6 h-6 text-purple-300" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">End-to-End Encryption</h3>
                                <p className="text-purple-200">
                                    Military-grade encryption protects all your data and transactions from unauthorized access.
                                </p>
                            </div>
                            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-400/50 transition-all duration-300">
                                <div className="w-12 h-12 bg-purple-500/30 rounded-xl flex items-center justify-center mb-4">
                                    <TrendingUp className="w-6 h-6 text-purple-300" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Real-Time Monitoring</h3>
                                <p className="text-purple-200">
                                    Track all your transactions instantly with detailed analytics and spending insights.
                                </p>
                            </div>
                            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-400/50 transition-all duration-300">
                                <div className="w-12 h-12 bg-purple-500/30 rounded-xl flex items-center justify-center mb-4">
                                    <CheckCircle className="w-6 h-6 text-purple-300" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Instant Verification</h3>
                                <p className="text-purple-200">
                                    Quick and secure identity verification ensures only you can access your account.
                                </p>
                            </div>
                            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-400/50 transition-all duration-300">
                                <div className="w-12 h-12 bg-purple-500/30 rounded-xl flex items-center justify-center mb-4">
                                    <CreditCard className="w-6 h-6 text-purple-300" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Multi-Card Support</h3>
                                <p className="text-purple-200">
                                    Manage multiple credit cards in one place with seamless switching between accounts.
                                </p>
                            </div>
                            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-400/50 transition-all duration-300">
                                <div className="w-12 h-12 bg-purple-500/30 rounded-xl flex items-center justify-center mb-4">
                                    <Shield className="w-6 h-6 text-purple-300" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">AI Fraud Prevention</h3>
                                <p className="text-purple-200">
                                    Advanced machine learning detects and blocks fraudulent transactions automatically.
                                </p>
                            </div>
                            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-400/50 transition-all duration-300">
                                <div className="w-12 h-12 bg-purple-500/30 rounded-xl flex items-center justify-center mb-4">
                                    <Zap className="w-6 h-6 text-purple-300" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Instant Alerts</h3>
                                <p className="text-purple-200">
                                    Get notified immediately about every transaction and suspicious activity on your account.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section - Padding increased */}
                <section className="relative py-20 px-12 overflow-hidden">
                    {/* Background Gradient Circles for CTA */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#e7c8bc] opacity-60 blur-3xl translate-x-1/4 -translate-y-1/4"></div>
                        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] rounded-full bg-[#aa86cc] opacity-50 blur-3xl translate-x-1/5 translate-y-1/5"></div>
                        <div className="absolute bottom-0 left-0 w-[1000px] h-[1000px] rounded-full bg-[#6a4dab] opacity-40 blur-3xl -translate-x-1/6 translate-y-1/6"></div>
                    </div>

                    <div className="relative z-10 max-w-5xl mx-auto">
                        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 text-center shadow-2xl border border-white/20">
                            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                                Ready to Secure Your Transactions?
                            </h2>
                            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
                                Join thousands of users who trust SecureCard for their daily transactions. Get started in minutes.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                {auth?.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="px-10 py-4 bg-white text-purple-900 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl flex items-center gap-2"
                                    >
                                        Dashboard
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                ) : (
                                    <Link
                                        href={route('register')}
                                        className="px-10 py-4 bg-white text-purple-900 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl flex items-center gap-2"
                                    >
                                        Get Started Free
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                )}
                                <button className="px-10 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all duration-300">
                                    Schedule Demo
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer - Padding increased */}
                <footer className="py-12 px-12 bg-[#10121f]/80 border-t border-white/10">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid md:grid-cols-4 gap-8 mb-8">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <CreditCard className="w-8 h-8 text-purple-400" />
                                    <span className="text-2xl font-bold">SecureCard</span>
                                </div>
                                <p className="text-purple-200">
                                    AI-powered credit card system with advanced fraud detection technology.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-bold text-lg mb-4">Product</h4>
                                <ul className="space-y-2 text-purple-200">
                                    <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-lg mb-4">Company</h4>
                                <ul className="space-y-2 text-purple-200">
                                    <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-lg mb-4">Legal</h4>
                                <ul className="space-y-2 text-purple-200">
                                    <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Compliance</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="border-t border-white/10 pt-8 text-center text-purple-200">
                            <p>&copy; 2025 SecureCard. All rights reserved. Powered by Advanced Machine Learning Technology.</p>
                        </div>
                    </div>
                </footer>
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

            {/* Custom styles for animations */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-15px);
                    }
                }

                @keyframes float-delayed {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-15px);
                    }
                }

                .animate-float {
                    animation: float 4s ease-in-out infinite;
                }

                .animate-float-delayed {
                    animation: float-delayed 4s ease-in-out infinite;
                    animation-delay: 2s;
                }
            `}</style>
        </div>
    );
}
