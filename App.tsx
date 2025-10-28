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
    
    // State to track login attempts from localStorage
    const [loginAttempts, setLoginAttempts] = useState<Record<string, number>>(() => {
        try {
            const storedAttempts = localStorage.getItem('loginAttempts');
            return storedAttempts ? JSON.parse(storedAttempts) : {};
        } catch (e) {
            console.error("Failed to parse login attempts from localStorage", e);
            return {};
        }
    });

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

            // On successful login, clear the attempt counter for this user
            const updatedAttempts = { ...loginAttempts };
            if (updatedAttempts[userId]) {
                delete updatedAttempts[userId];
                setLoginAttempts(updatedAttempts);
                localStorage.setItem('loginAttempts', JSON.stringify(updatedAttempts));
            }
        } else {
            // Check for the specific "not found" error from the backend.
            if (result.message && result.message.startsWith("No registration found yet!")) {
                const currentCount = loginAttempts[userId] || 0;
                const newCount = currentCount + 1;
                
                const updatedAttempts = { ...loginAttempts, [userId]: newCount };
                setLoginAttempts(updatedAttempts);
                localStorage.setItem('loginAttempts', JSON.stringify(updatedAttempts));

                if (newCount < 3) {
                    // For attempts 1 and 2, show the "Not Registered" message.
                    setError("Sorry, You are Not Registered!\nPlease click the REGISTER button first and complete your registration using Register Here Button.");
                } else {
                    // For the 3rd attempt and onwards, suggest waiting.
                    setError("No registration found yet!\nPlease wait 2-5 minutes after registration and enter your Player ID again.");
                }
            } else if (result.message && result.message.includes('successfully completed registration')) {
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
    
    if (isLoading && !user) { // Only show full-screen loader on initial load
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8">
            <header className="flex justify-between items-center mb-10 p-4 rounded-xl bg-black/20 backdrop-blur-sm border-b border-white/10">
                <h1 className="text-2xl sm:text-3xl font-bold shimmer-text">Mines Predictor Pro</h1>
                <div className="flex items-center flex-wrap gap-3">
                     <button
                        onClick={handleToggleTestPage}
                        className="btn text-sm"
                    >
                        {showTestPage ? 'Hide Tester' : 'Test Postback'}
                    </button>
                     <button
                        onClick={handleToggleGuide}
                        className="btn text-sm"
                    >
                        {showGuide ? 'Hide Guide' : 'Setup Guide'}
                    </button>
                    {user && (
                        <button
                            onClick={handleLogout}
                            className="btn text-sm"
                        >
                            Logout
                        </button>
                    )}
                </div>
            </header>

            <main className="main-content">
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