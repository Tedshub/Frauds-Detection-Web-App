import React, { useState } from 'react';
import { Eye, EyeOff, CreditCard, Shield, Lock, Zap, TrendingUp } from 'lucide-react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="relative text-white min-h-screen overflow-hidden bg-[#10121f]">
            <Head title="Log In" />

            {/* Background Gradient Circles */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-[#e7c8bc] opacity-60 blur-3xl -translate-x-1/4 -translate-y-1/4"></div>
                <div className="absolute top-10 left-10 w-[800px] h-[800px] rounded-full bg-[#aa86cc] opacity-50 blur-3xl -translate-x-1/5 -translate-y-1/5"></div>
                <div className="absolute top-20 left-20 w-[1000px] h-[1000px] rounded-full bg-[#6a4dab] opacity-40 blur-3xl -translate-x-1/6 -translate-y-1/6"></div>
                <div className="absolute bottom-0 right-0 w-[800px] h-[800px] rounded-full bg-[#aa86cc] opacity-50 blur-3xl translate-x-1/5 translate-y-1/5"></div>
            </div>

            {/* Content wrapper */}
            <div className="relative z-10">
                {/* Navbar */}
                <nav className="fixed top-0 w-full z-50 bg-[#10121f]/80 backdrop-blur-md border-b border-white/10">
                    <div className="max-w-7xl mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            <Link href="/" className="flex items-center gap-2">
                                <CreditCard className="w-8 h-8 text-purple-400" />
                                <span className="text-2xl font-bold">SecureCard</span>
                            </Link>
                            <div className="flex items-center gap-4">
                                <Link
                                    href={route('register')}
                                    className="px-6 py-2.5 bg-white text-purple-900 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg"
                                >
                                    Join Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <section className="pt-32 pb-20 px-6 min-h-screen flex items-center">
                    <div className="max-w-7xl mx-auto w-full">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            {/* Left Side - Animation */}
                            <div className="relative order-2 lg:order-1 hidden lg:block">
                                <div className="relative w-full h-96 flex items-center justify-center">
                                    {/* Orbiting circles */}
                                    <div className="absolute w-80 h-80 border-2 border-purple-400/30 rounded-full"></div>
                                    <div className="absolute w-96 h-96 border-2 border-purple-400/20 rounded-full"></div>

                                    {/* Center icon */}
                                    <div className="relative z-10 w-32 h-32 bg-gradient-to-br from-purple-500 to-purple-700 rounded-3xl flex items-center justify-center shadow-2xl">
                                        <Lock className="w-16 h-16 text-white" />
                                    </div>

                                    {/* Floating icons with animation */}
                                    <div className="absolute top-8 right-12 w-16 h-16 bg-purple-500/20 backdrop-blur-md rounded-full flex items-center justify-center border border-purple-400/30 animate-float">
                                        <Shield className="w-8 h-8 text-purple-300" />
                                    </div>
                                    <div className="absolute bottom-12 left-8 w-16 h-16 bg-purple-500/20 backdrop-blur-md rounded-full flex items-center justify-center border border-purple-400/30 animate-float-delayed">
                                        <CreditCard className="w-8 h-8 text-purple-300" />
                                    </div>
                                    <div className="absolute top-1/3 left-4 w-16 h-16 bg-purple-500/20 backdrop-blur-md rounded-full flex items-center justify-center border border-purple-400/30 animate-float">
                                        <Zap className="w-8 h-8 text-purple-300" />
                                    </div>
                                    <div className="absolute bottom-1/4 right-8 w-16 h-16 bg-purple-500/20 backdrop-blur-md rounded-full flex items-center justify-center border border-purple-400/30 animate-float-delayed">
                                        <TrendingUp className="w-8 h-8 text-purple-300" />
                                    </div>
                                </div>

                                {/* Welcome Text */}
                                <div className="text-center mt-8">
                                    <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
                                    <p className="text-purple-200 text-lg">
                                        Sign in to access your secure account
                                    </p>
                                </div>
                            </div>

                            {/* Right Side - Form */}
                            <div className="order-1 lg:order-2 flex lg:justify-center">
                                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 lg:p-8 border border-white/20 shadow-2xl w-full max-w-md">
                                    <div className="mb-6">
                                        <h1 className="text-2xl lg:text-3xl font-bold mb-2">Log In</h1>
                                        <p className="text-purple-200 text-sm">Enter your credentials to continue</p>
                                    </div>

                                    {status && (
                                        <div className="mb-4 text-sm font-medium text-green-400 bg-green-400/10 border border-green-400/20 rounded-lg p-3">
                                            {status}
                                        </div>
                                    )}

                                    <form onSubmit={submit} className="space-y-5">
                                        <div>
                                            <InputLabel htmlFor="email" value="Email" className="text-white font-semibold mb-2" />
                                            <TextInput
                                                id="email"
                                                type="email"
                                                name="email"
                                                value={data.email}
                                                className="mt-1 block w-full bg-white/10 border-white/20 text-white placeholder-purple-300 focus:border-purple-400 focus:ring-purple-400 rounded-xl"
                                                autoComplete="username"
                                                isFocused={true}
                                                onChange={(e) => setData('email', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.email} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="password" value="Password" className="text-white font-semibold mb-2" />
                                            <div className="relative">
                                                <TextInput
                                                    id="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    name="password"
                                                    value={data.password}
                                                    className="mt-1 block w-full bg-white/10 border-white/20 text-white placeholder-purple-300 focus:border-purple-400 focus:ring-purple-400 rounded-xl pr-12"
                                                    autoComplete="current-password"
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-300 hover:text-white transition-colors"
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="w-5 h-5" />
                                                    ) : (
                                                        <Eye className="w-5 h-5" />
                                                    )}
                                                </button>
                                            </div>
                                            <InputError message={errors.password} className="mt-2" />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <label className="flex items-center">
                                                <Checkbox
                                                    name="remember"
                                                    checked={data.remember}
                                                    onChange={(e) => setData('remember', e.target.checked)}
                                                    className="rounded border-white/20 bg-white/10 text-purple-500 focus:ring-purple-400"
                                                />
                                                <span className="ms-2 text-sm text-purple-200">Remember me</span>
                                            </label>

                                            {canResetPassword && (
                                                <Link
                                                    href={route('password.request')}
                                                    className="text-sm text-purple-300 hover:text-white underline transition-colors"
                                                >
                                                    Forgot password?
                                                </Link>
                                            )}
                                        </div>

                                        <div className="space-y-4">
                                            <button
                                                type="submit"
                                                className="w-full bg-white text-purple-900 hover:bg-gray-100 font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg flex items-center justify-center"
                                                disabled={processing}
                                            >
                                                {processing ? (
                                                    <>
                                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-purple-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Logging in...
                                                    </>
                                                ) : (
                                                    'Log In'
                                                )}
                                            </button>

                                            <div className="text-center text-purple-200 text-sm">
                                                Don't have an account?{' '}
                                                <Link
                                                    href={route('register')}
                                                    className="text-white font-semibold hover:underline"
                                                >
                                                    Sign up now
                                                </Link>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

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
