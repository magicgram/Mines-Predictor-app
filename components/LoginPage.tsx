import React, { useState } from 'react';

interface LoginPageProps {
    onLogin: (userId: string) => void;
    error: string | null;
    isLoading: boolean;
    infoMessage: string | null;
}

// IMPORTANT: Set your affiliate link in the Vercel Environment Variables.
// The variable name must be VITE_AFFILIATE_LINK
// @ts-ignore
const AFFILIATE_LINK = import.meta.env.VITE_AFFILIATE_LINK || 'https://1waff.com/?p=YOUR_CODE_HERE';

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, error, isLoading, infoMessage }) => {
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
        <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-md p-8 space-y-6 glassmorphic-card gradient-border rounded-2xl shadow-2xl">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
                    <p className="text-gray-400 mt-2">Enter your Player ID to get predictions.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="text"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            placeholder="Your Game Player ID"
                            className="w-full px-4 py-3 text-gray-200 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                            required
                        />
                    </div>

                    {infoMessage && (
                         <div className="p-4 bg-purple-900/30 border border-purple-500/50 rounded-lg text-sm space-y-3">
                             {infoMessage.split('\n').map((line, index) => {
                                 const trimmedLine = line.trim();
                                 const firstSpaceIndex = trimmedLine.indexOf(' ');
                                 const icon = trimmedLine.substring(0, firstSpaceIndex);
                                 const text = trimmedLine.substring(firstSpaceIndex + 1);
 
                                 return (
                                     <div key={index} className="flex items-start">
                                         <span className="mr-3 text-lg text-purple-400">{icon}</span>
                                         <p className="text-gray-300 flex-1">{text}</p>
                                     </div>
                                 );
                             })}
                         </div>
                     )}

                    {error && 
                        <div className="flex items-start p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-sm space-x-3">
                             <span className="text-lg text-red-400 mt-1">❌</span>
                             <p className="text-red-300 whitespace-pre-wrap flex-1">{error}</p>
                        </div>
                    }

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full px-4 py-3 font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all transform hover:scale-105"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-dashed rounded-full animate-spin border-white"></div>
                            ) : (
                                'Continue'
                            )}
                        </button>
                    </div>
                </form>
                
                <div className="space-y-4 pt-4">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-gray-700" />
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-[rgba(26,26,46,0.6)] px-3 text-sm text-gray-400">
                                New to the game?
                            </span>
                        </div>
                    </div>
                    
                    <button
                        onClick={handleRegister}
                        type="button"
                        className="w-full px-4 py-3 font-semibold text-white bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg hover:from-teal-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 transition-all transform hover:scale-105"
                    >
                        Register Here
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;