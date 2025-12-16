import { Head } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import DeleteUserForm from './Partials/DeleteUserForm';

export default function Edit({ auth, mustVerifyEmail, status }) {
    const handleBack = () => {
        window.history.back();
    };

    return (
        <>
            <Head title="Edit Profile" />
            <div className="min-h-screen bg-[#1a1c24] text-white">
                {/* Main Content Area */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Back Button */}
                    <button
                        onClick={handleBack}
                        className="mb-6 flex items-center gap-2 text-purple-300 hover:text-white transition-colors group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back</span>
                    </button>

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
                        <p className="text-purple-200">Manage your account information and security</p>
                    </div>

                    <div className="space-y-8">
                        {/* Update Profile Information */}
                        <div className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                            />
                        </div>

                        {/* Update Password */}
                        <div className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                            <UpdatePasswordForm />
                        </div>

                        {/* Delete Account */}
                        <div className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                            <DeleteUserForm />
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
