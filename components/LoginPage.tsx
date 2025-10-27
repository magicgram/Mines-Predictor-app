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
                    <h2 className="text-3xl font-bold text-white">Unlock Predictions</h2>
                    <p className="text-text-secondary mt-2">Enter your Player ID to begin.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                         <label htmlFor="userId" className="text-sm font-medium text-text-secondary mb-2 block">Player ID</label>
                        <input
                            id="userId"
                            type="text"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            placeholder="12345678"
                            className="w-full px-4 py-3 text-text-primary bg-black/30 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-purple transition-all"
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
                            className="w-full px-4 py-3 font-semibold text-white bg-gradient-to-r from-accent-purple to-accent-cyan rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-dark-secondary focus:ring-accent-purple disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all transform hover:scale-105"
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
                            <div className="w-full border-t border-white/20" />
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-bg-dark-secondary px-3 text-sm text-text-secondary rounded-full">
                                New to the game?
                            </span>
                        </div>
                    </div>
                    
                    <button
                        onClick={handleRegister}
                        type="button"
                        className="w-full px-4 py-3 font-semibold text-accent-cyan bg-transparent border-2 border-accent-cyan rounded-lg hover:bg-accent-cyan hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-dark-secondary focus:ring-accent-cyan transition-all transform hover:scale-105"
                    >
                        Register Here
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
