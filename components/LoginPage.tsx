import React, { useState } from 'react';

interface LoginPageProps {
    onLogin: (userId: string) => void;
    error: string | null;
    isLoading: boolean;
}

// IMPORTANT: Set your affiliate link in the Vercel Environment Variables.
// The variable name must be VITE_AFFILIATE_LINK
// Fix for: Property 'env' does not exist on type 'ImportMeta'.
// @ts-ignore
const AFFILIATE_LINK = import.meta.env.VITE_AFFILIATE_LINK || 'https://1waff.com/?p=YOUR_CODE_HERE';

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, error, isLoading }) => {
    const [userId, setUserId] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (userId.trim()) {
            onLogin(userId.trim());
        }
    };

    const handleRegister = () => {
        window.open(AFFILIATE_LINK, '_blank');
    };

    return (
        <div className="flex flex-col items-center justify-center mt-10">
            <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-center text-white">Welcome</h2>
                <p className="text-center text-gray-400">Enter your Player ID to get predictions.</p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="text"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            placeholder="Your Game Player ID"
                            className="w-full px-4 py-3 text-gray-200 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        />
                    </div>
                    {error && <p className="text-red-400 text-sm text-center whitespace-pre-wrap">{error}</p>}
                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full px-4 py-3 font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 disabled:bg-purple-800 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-dashed rounded-full animate-spin border-white"></div>
                            ) : (
                                'Continue'
                            )}
                        </button>
                    </div>
                </form>
                
                <div className="space-y-4 pt-2">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-gray-600" />
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-gray-800 px-3 text-sm text-gray-400">
                                First time here?
                            </span>
                        </div>
                    </div>
                    
                    <button
                        onClick={handleRegister}
                        type="button"
                        className="w-full px-4 py-3 font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 transition-colors"
                    >
                        Register Here
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;