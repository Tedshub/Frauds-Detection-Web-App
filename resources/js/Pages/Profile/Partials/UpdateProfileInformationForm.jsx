import { useForm, usePage, router } from '@inertiajs/react';
import { User, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { Transition } from '@headlessui/react';

export default function UpdateProfileInformationForm({ mustVerifyEmail, status, className = '' }) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header className="mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <User className="w-6 h-6" />
                    Profile Information
                </h2>
                <p className="mt-2 text-purple-200">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-purple-200 mb-2">
                        Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoComplete="name"
                    />
                    {errors.name && (
                        <div className="mt-2 flex items-center gap-2 text-red-400 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            {errors.name}
                        </div>
                    )}
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-purple-200 mb-2">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />
                    {errors.email && (
                        <div className="mt-2 flex items-center gap-2 text-red-400 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            {errors.email}
                        </div>
                    )}
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="p-4 bg-yellow-900/30 border border-yellow-700/30 rounded-lg">
                        <p className="text-sm text-yellow-200 flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <span>
                                Your email address is unverified.{' '}
                                <button
                                    type="button"
                                    onClick={() => router.post(route('verification.send'))}
                                    className="underline hover:text-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded"
                                >
                                    Click here to re-send the verification email.
                                </button>
                            </span>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 flex items-center gap-2 text-green-400 text-sm font-medium">
                                <CheckCircle className="w-4 h-4" />
                                A new verification link has been sent to your email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#1a1c24] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        Save
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out duration-300"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-green-400 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Saved.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
