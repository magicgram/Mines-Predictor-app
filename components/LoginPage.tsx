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
            <div className="w-full max-w-md p-8 space-y-6 glassmorphic-card rounded-2xl shadow-2xl">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white font-['Orbitron']">Unlock Predictions</h2>
                    <p className="text-gray-200 mt-2">Enter your Player ID to synchronize.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                         <label htmlFor="userId" className="text-sm font-medium text-gray-300 mb-2 block">Player ID</label>
                        <input
                            id="userId"
                            type="text"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            placeholder="12345678"
                            className="form-input"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {isLoading && (
                        <div className="flex items-center p-4 bg-black/30 border border-blue-500/50 rounded-lg text-sm space-x-3">
                            <span className="text-lg">🔍</span>
                            <p className="text-blue-300">Checking your registration status...</p>
                        </div>
                    )}

                    {infoMessage && !isLoading && (
                         <div className="p-4 bg-black/30 border border-purple-500/50 rounded-lg text-sm space-y-3">
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

                    {error && !isLoading && 
                        <div className="flex items-start p-4 bg-red-900/40 border border-red-500/50 rounded-lg text-sm space-x-3">
                             <span className="text-lg text-red-400 mt-1">❌</span>
                             <p className="text-red-300 whitespace-pre-wrap flex-1">{error}</p>
                        </div>
                    }

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn btn-dark"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-dashed rounded-full animate-spin border-white mx-auto"></div>
                            ) : (
                                'Continue'
                            )}
                        </button>
                    </div>
                </form>
                
                <div className="space-y-4 pt-4">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span style={{ backgroundColor: '#5c50d5' }} className="px-3 text-gray-300">
                                I don't have account
                            </span>
                        </div>
                    </div>
                    
                    <button
                        onClick={handleRegister}
                        type="button"
                        className="w-full btn btn-dark"
                    >
                        Register Here
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;