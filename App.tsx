import React, { useState, useEffect, useCallback } from 'react';
import LoginPage from './components/LoginPage';
import PredictorPage from './components/PredictorPage';
import PostbackGuide from './components/PostbackGuide';
import TestPage from './components/TestPage';
import { verificationService } from './services/verificationService';
import type { User } from './types';

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [infoMessage, setInfoMessage] = useState<string | null>(null);
    const [showGuide, setShowGuide] = useState<boolean>(false);
    const [showTestPage, setShowTestPage] = useState<boolean>(false);

    const loadUserFromStorage = useCallback(async () => {
        const storedUser = localStorage.getItem('minesPredictorUser');
        if (storedUser) {
            const parsedUser: User = JSON.parse(storedUser);
            if (parsedUser.awaitingDeposit) {
                const result = await verificationService.verifyRedeposit(parsedUser.id, parsedUser.knownRedeposits);
                if (result.success && result.newRedepositCount !== undefined) {
                    const updatedUser = { ...parsedUser, predictionCount: 0, awaitingDeposit: false, knownRedeposits: result.newRedepositCount };
                    localStorage.setItem('minesPredictorUser', JSON.stringify(updatedUser));
                    setUser(updatedUser);
                    alert("Deposit successful! You have 15 new predictions.");
                } else {
                    setUser(parsedUser);
                }
            } else {
                setUser(parsedUser);
            }
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        loadUserFromStorage();
    }, [loadUserFromStorage]);

    const handleLogin = async (userId: string) => {
        setIsLoading(true);
        setError(null);
        setInfoMessage(null);
        const result = await verificationService.verifyInitialLogin(userId);
        if (result.success) {
            const newUser: User = { id: userId, predictionCount: 0, awaitingDeposit: false, knownRedeposits: result.redepositCount || 0 };
            localStorage.setItem('minesPredictorUser', JSON.stringify(newUser));
            setUser(newUser);
        } else {
            if (result.message && result.message.includes('successfully completed registration')) {
                setInfoMessage(result.message);
            } else {
                setError(result.message || "Login failed.");
            }
        }
        setIsLoading(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('minesPredictorUser');
        setUser(null);
    };

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
        localStorage.setItem('minesPredictorUser', JSON.stringify(updatedUser));
    };

    const handleToggleGuide = () => {
        setShowTestPage(false);
        setShowGuide(!showGuide);
    };

    const handleToggleTestPage = () => {
        setShowGuide(false);
        setShowTestPage(!showTestPage);
    };
    
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8">
            <header className="sticky top-4 z-10 flex justify-between items-center mb-8 p-4 bg-black/30 backdrop-blur-lg rounded-2xl border border-white/10 shadow-lg">
                <h1 className="text-xl sm:text-2xl font-bold shimmer-text">Mines Predictor Pro</h1>
                <div className="flex items-center flex-wrap gap-2">
                     <button
                        onClick={handleToggleTestPage}
                        className="px-4 py-2 text-sm font-semibold rounded-lg transition-all bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-300 border border-yellow-500/20"
                    >
                        {showTestPage ? 'Hide Tester' : 'Test Postback'}
                    </button>
                     <button
                        onClick={handleToggleGuide}
                        className="px-4 py-2 text-sm font-semibold rounded-lg transition-all bg-white/5 hover:bg-white/10 border border-white/10"
                    >
                        {showGuide ? 'Hide Guide' : 'Setup Guide'}
                    </button>
                    {user && (
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm font-semibold rounded-lg transition-all bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20"
                        >
                            Logout
                        </button>
                    )}
                </div>
            </header>

            <main className="transition-all duration-300">
                {showTestPage ? <TestPage /> : showGuide ? <PostbackGuide /> : (
                    !user ? (
                        <LoginPage onLogin={handleLogin} error={error} isLoading={isLoading} infoMessage={infoMessage} />
                    ) : (
                        <PredictorPage user={user} onUpdateUser={updateUser} />
                    )
                )}
            </main>
        </div>
    );
};

export default App;