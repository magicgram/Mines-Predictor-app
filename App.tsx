import React, { useState, useEffect, useCallback } from 'react';
import LoginPage from './components/LoginPage';
import PredictorPage from './components/PredictorPage';
import PostbackGuide from './components/PostbackGuide';
import { verificationService } from './services/verificationService';
import type { User } from './types';

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showGuide, setShowGuide] = useState<boolean>(false);

    const loadUserFromStorage = useCallback(async () => {
        const storedUser = localStorage.getItem('minesPredictorUser');
        if (storedUser) {
            const parsedUser: User = JSON.parse(storedUser);
            if (parsedUser.awaitingDeposit) {
                // User was sent to deposit, let's verify if they did it
                const result = await verificationService.verifyRedeposit(parsedUser.id, parsedUser.knownRedeposits);
                if (result.success && result.newRedepositCount !== undefined) {
                    const updatedUser = { ...parsedUser, predictionCount: 0, awaitingDeposit: false, knownRedeposits: result.newRedepositCount };
                    localStorage.setItem('minesPredictorUser', JSON.stringify(updatedUser));
                    setUser(updatedUser);
                    alert("Deposit successful! You have 15 new predictions.");
                } else {
                    setUser(parsedUser); // Keep them logged in but with limit message
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
        const result = await verificationService.verifyInitialLogin(userId);
        if (result.success) {
            const newUser: User = { id: userId, predictionCount: 0, awaitingDeposit: false, knownRedeposits: result.redepositCount || 0 };
            localStorage.setItem('minesPredictorUser', JSON.stringify(newUser));
            setUser(newUser);
        } else {
            setError(result.message || "Login failed.");
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
    
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
            <header className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-purple-400">Mines Predictor Pro</h1>
                <div>
                     <button
                        onClick={() => setShowGuide(!showGuide)}
                        className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg mr-4 transition-colors"
                    >
                        {showGuide ? 'Hide' : 'Show'} Postback Guide
                    </button>
                    {user && (
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                        >
                            Logout
                        </button>
                    )}
                </div>
            </header>

            {showGuide && <PostbackGuide />}
            
            <main>
                {!user ? (
                    <LoginPage onLogin={handleLogin} error={error} isLoading={isLoading} />
                ) : (
                    <PredictorPage user={user} onUpdateUser={updateUser} />
                )}
            </main>
        </div>
    );
};

export default App;
