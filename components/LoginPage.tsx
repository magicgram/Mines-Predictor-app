import React, { useState } from 'react';

interface LoginPageProps {
    onLogin: (userId: string) => void;
    error: string | null;
    isLoading: boolean;
}

// IMPORTANT: Replace YOUR_CODE_HERE with your actual affiliate code.
const AFFILIATE_LINK = 'https://1waff.com/?p=YOUR_CODE_HERE';

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
                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}
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
                <div className="text-center">
                    <p className="text-gray-400">Don't have an account?</p>
                    <button
                        onClick={handleRegister}
                        className="font-medium text-purple-400 hover:underline"
                    >
                        Register Here
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
