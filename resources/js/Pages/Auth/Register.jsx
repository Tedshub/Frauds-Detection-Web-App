import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, CreditCard, Shield, Lock, Zap, CheckCircle, XCircle, User } from 'lucide-react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const [passwordValidation, setPasswordValidation] = useState({
        minLength: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        hasSpecialChar: false,
    });
    const [passwordsMatch, setPasswordsMatch] = useState(null);

    useEffect(() => {
        const password = data.password;
        setPasswordValidation({
            minLength: password.length >= 8,
            hasUpperCase: /[A-Z]/.test(password),
            hasLowerCase: /[a-z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            hasSpecialChar: /[_@*!#$%^&+=\-]/.test(password),
        });
    }, [data.password]);

    useEffect(() => {
        if (data.password_confirmation.length > 0) {
            setPasswordsMatch(data.password === data.password_confirmation);
        } else {
            setPasswordsMatch(null);
        }
    }, [data.password, data.password_confirmation]);

    const submit = (e) => {
        e.preventDefault();

        const allValid = Object.values(passwordValidation).every(v => v);
        if (!allValid || !passwordsMatch) {
            return;
        }

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const ValidationItem = ({ isValid, text }) => (
        <div className="flex items-center gap-2 text-sm">
            {isValid ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
            ) : (
                <XCircle className="w-4 h-4 text-red-400" />
            )}
            <span className={isValid ? 'text-green-400' : 'text-purple-300'}>
                {text}
            </span>
        </div>
    );

    return (
        <div className="relative text-white min-h-screen overflow-hidden bg-[#10121f]">
            <Head title="Register" />

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
                                    href={route('login')}
                                    className="px-6 py-2.5 text-white hover:text-gray-200 transition-colors duration-300 font-medium"
                                >
                                    Log In
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
                                    <div className="absolute w-80 h-80 border-2 border-purple-400/30 rounded-full animate-spin-slow"></div>
                                    <div className="absolute w-96 h-96 border-2 border-purple-400/20 rounded-full animate-spin-slower"></div>

                                    {/* Center icon */}
                                    <div className="relative z-10 w-32 h-32 bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
                                        <User className="w-16 h-16 text-white" />
                                    </div>

                                    {/* Floating icons with animation */}
                                    <div className="absolute top-8 right-12 w-16 h-16 bg-purple-500/20 backdrop-blur-md rounded-full flex items-center justify-center border border-purple-400/30 animate-float">
                                        <Shield className="w-8 h-8 text-purple-300" />
                                    </div>
                                    <div className="absolute bottom-12 left-8 w-16 h-16 bg-purple-500/20 backdrop-blur-md rounded-full flex items-center justify-center border border-purple-400/30 animate-float-delayed">
                                        <CheckCircle className="w-8 h-8 text-purple-300" />
                                    </div>
                                    <div className="absolute top-1/3 left-4 w-16 h-16 bg-purple-500/20 backdrop-blur-md rounded-full flex items-center justify-center border border-purple-400/30 animate-float">
                                        <Lock className="w-8 h-8 text-purple-300" />
                                    </div>
                                    <div className="absolute bottom-1/4 right-8 w-16 h-16 bg-purple-500/20 backdrop-blur-md rounded-full flex items-center justify-center border border-purple-400/30 animate-float-delayed">
                                        <Zap className="w-8 h-8 text-purple-300" />
                                    </div>
                                </div>

                                {/* Welcome Text */}
                                <div className="text-center mt-8">
                                    <h2 className="text-3xl font-bold mb-4">Join SecureCard Today!</h2>
                                    <p className="text-purple-200 text-lg">
                                        Create your account and start securing your transactions
                                    </p>
                                </div>
                            </div>

                            {/* Right Side - Form */}
                            <div className="order-1 lg:order-2 flex lg:justify-center">
                                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 lg:p-8 border border-white/20 shadow-2xl w-full max-w-md">
                                    <div className="mb-6">
                                        <h1 className="text-2xl lg:text-3xl font-bold mb-2">Create Account</h1>
                                        <p className="text-purple-200 text-sm">Fill in your details to get started</p>
                                    </div>

                                    <form onSubmit={submit} className="space-y-5">
                                        <div>
                                            <InputLabel htmlFor="name" value="Full Name" className="text-white font-semibold mb-2" />
                                            <TextInput
                                                id="name"
                                                name="name"
                                                value={data.name}
                                                className="mt-1 block w-full bg-white/10 border-white/20 text-white placeholder-purple-300 focus:border-purple-400 focus:ring-purple-400 rounded-xl"
                                                autoComplete="name"
                                                isFocused={true}
                                                onChange={(e) => setData('name', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.name} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="email" value="Email Address" className="text-white font-semibold mb-2" />
                                            <TextInput
                                                id="email"
                                                type="email"
                                                name="email"
                                                value={data.email}
                                                className="mt-1 block w-full bg-white/10 border-white/20 text-white placeholder-purple-300 focus:border-purple-400 focus:ring-purple-400 rounded-xl"
                                                autoComplete="username"
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
                                                    autoComplete="new-password"
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

                                            {data.password && (
                                                <div className="mt-3 space-y-2 bg-white/5 rounded-lg p-3 border border-white/10">
                                                    <p className="text-xs text-purple-200 font-semibold mb-2">Password requirements:</p>
                                                    <ValidationItem isValid={passwordValidation.minLength} text="At least 8 characters" />
                                                    <ValidationItem isValid={passwordValidation.hasUpperCase} text="One uppercase letter" />
                                                    <ValidationItem isValid={passwordValidation.hasLowerCase} text="One lowercase letter" />
                                                    <ValidationItem isValid={passwordValidation.hasNumber} text="One number" />
                                                    <ValidationItem isValid={passwordValidation.hasSpecialChar} text="One special character (_@*!#$%^&+=-)" />
                                                </div>
                                            )}

                                            <InputError message={errors.password} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel
                                                htmlFor="password_confirmation"
                                                value="Confirm Password"
                                                className="text-white font-semibold mb-2"
                                            />
                                            <div className="relative">
                                                <TextInput
                                                    id="password_confirmation"
                                                    type={showPasswordConfirmation ? 'text' : 'password'}
                                                    name="password_confirmation"
                                                    value={data.password_confirmation}
                                                    className="mt-1 block w-full bg-white/10 border-white/20 text-white placeholder-purple-300 focus:border-purple-400 focus:ring-purple-400 rounded-xl pr-12"
                                                    autoComplete="new-password"
                                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-300 hover:text-white transition-colors"
                                                >
                                                    {showPasswordConfirmation ? (
                                                        <EyeOff className="w-5 h-5" />
                                                    ) : (
                                                        <Eye className="w-5 h-5" />
                                                    )}
                                                </button>
                                            </div>

                                            {passwordsMatch !== null && (
                                                <div className={`mt-2 flex items-center gap-2 text-sm ${passwordsMatch ? 'text-green-400' : 'text-red-400'}`}>
                                                    {passwordsMatch ? (
                                                        <>
                                                            <CheckCircle className="w-4 h-4" />
                                                            <span>Passwords match</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <XCircle className="w-4 h-4" />
                                                            <span>Passwords do not match</span>
                                                        </>
                                                    )}
                                                </div>
                                            )}

                                            <InputError message={errors.password_confirmation} className="mt-2" />
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
                                                        Creating Account...
                                                    </>
                                                ) : (
                                                    'Create Account'
                                                )}
                                            </button>

                                            <div className="text-center text-purple-200 text-sm">
                                                Already have an account?{' '}
                                                <Link
                                                    href={route('login')}
                                                    className="text-white font-semibold hover:underline"
                                                >
                                                    Log in here
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

                @keyframes spin-slow {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }

                @keyframes spin-slower {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(-360deg);
                    }
                }

                .animate-float {
                    animation: float 4s ease-in-out infinite;
                }

                .animate-float-delayed {
                    animation: float-delayed 4s ease-in-out infinite;
                    animation-delay: 2s;
                }

                .animate-spin-slow {
                    animation: spin-slow 20s linear infinite;
                }

                .animate-spin-slower {
                    animation: spin-slower 30s linear infinite;
                }
            `}</style>
        </div>
    );
}
