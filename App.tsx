
import React, { useState, useEffect, useCallback, useRef } from 'react';
import LoginPage from './components/LoginPage';
import PredictorPage from './components/PredictorPage';
import PostbackGuide from './components/PostbackGuide';
import TestPage from './components/TestPage';
import { verificationService } from './services/verificationService';
import type { User } from './types';
import MenuIcon from './components/icons/MenuIcon';

// Local storage keys
const ACTIVE_USER_KEY = 'minesPredictorActiveUser';
const USER_DATA_KEY_PREFIX = 'minesPredictorUser:';


const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [infoMessage, setInfoMessage] = useState<string | null>(null);
    const [showGuide, setShowGuide] = useState<boolean>(false);
    const [showTestPage, setShowTestPage] = useState<boolean>(false);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);

    
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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const loadUserFromStorage = useCallback(async () => {
        const activeUserId = localStorage.getItem(ACTIVE_USER_KEY);
        if (activeUserId) {
            const storedUserJSON = localStorage.getItem(`${USER_DATA_KEY_PREFIX}${activeUserId}`);
            if (storedUserJSON) {
                const parsedUser: User = JSON.parse(storedUserJSON);
                
                if (parsedUser.awaitingDeposit) {
                    const result = await verificationService.verifyRedeposit(parsedUser.id, parsedUser.knownRedeposits);
                    if (result.success && result.newRedepositCount !== undefined) {
                        const updatedUser = { ...parsedUser, predictionCount: 0, awaitingDeposit: false, knownRedeposits: result.newRedepositCount };
                        localStorage.setItem(`${USER_DATA_KEY_PREFIX}${updatedUser.id}`, JSON.stringify(updatedUser));
                        setUser(updatedUser);
                        alert("Deposit successful! You have 15 new predictions.");
                    } else {
                        setUser(parsedUser);
                    }
                } else {
                    setUser(parsedUser);
                }
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
        
        if (result.success && result.redepositCount !== undefined) {
            const apiRedepositCount = result.redepositCount;
            const userStorageKey = `${USER_DATA_KEY_PREFIX}${userId}`;
            const storedUserJSON = localStorage.getItem(userStorageKey);
            let userToActivate: User;

            if (storedUserJSON) {
                // User has logged in on this device before.
                const storedUser: User = JSON.parse(storedUserJSON);

                if (apiRedepositCount > storedUser.knownRedeposits) {
                    // Re-deposit detected! Reset prediction count.
                    userToActivate = { 
                        ...storedUser, 
                        predictionCount: 0, 
                        awaitingDeposit: false, 
                        knownRedeposits: apiRedepositCount 
                    };
                    alert("New deposit confirmed! Your prediction count has been reset.");
                } else {
                    // No new deposit, just logging in again. Preserve prediction count.
                    userToActivate = {
                        ...storedUser,
                        awaitingDeposit: false, // Ensure this is reset on login
                        knownRedeposits: apiRedepositCount // Sync count just in case
                    };
                }
            } else {
                // First time this user is logging in on this device.
                userToActivate = { 
                    id: userId, 
                    predictionCount: 0, 
                    awaitingDeposit: false, 
                    knownRedeposits: apiRedepositCount 
                };
            }

            // Save the user's persistent state
            localStorage.setItem(userStorageKey, JSON.stringify(userToActivate));
            // Set the active user for the session
            localStorage.setItem(ACTIVE_USER_KEY, userId);
            // Update React state
            setUser(userToActivate);

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
        // Only remove the active session key, not the user's data
        localStorage.removeItem(ACTIVE_USER_KEY);
        setUser(null);
    };

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
        // Save the updated user data to their specific storage key
        localStorage.setItem(`${USER_DATA_KEY_PREFIX}${updatedUser.id}`, JSON.stringify(updatedUser));
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
    
    const isPredictorPageActive = user && !showGuide && !showTestPage;

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8">
            <header className="relative flex justify-between items-center mb-10 p-4 rounded-xl bg-black/20 backdrop-blur-sm border-b border-white/10">
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setIsMenuOpen(prev => !prev)}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-cyan"
                        aria-label="Open menu"
                    >
                        <MenuIcon className="h-6 w-6 text-white"/>
                    </button>
                    {isMenuOpen && (
                        <div className="absolute left-0 mt-2 w-56 p-2 space-y-1 origin-top-left glassmorphic-card gradient-border rounded-lg shadow-lg z-50">
                            <button
                                onClick={() => { handleToggleTestPage(); setIsMenuOpen(false); }}
                                className="w-full text-left px-3 py-2 rounded-md hover:bg-white/10 transition-colors flex items-center gap-3"
                            >
                                <span role="img" aria-label="test tube">🧪</span> Test Postback
                            </button>
                            <button
                                onClick={() => { handleToggleGuide(); setIsMenuOpen(false); }}
                                className="w-full text-left px-3 py-2 rounded-md hover:bg-white/10 transition-colors flex items-center gap-3"
                            >
                                <span role="img" aria-label="book">📖</span> Setup Guide
                            </button>
                        </div>
                    )}
                </div>
                
                <h1 className={`absolute left-1/2 -translate-x-1/2 text-2xl sm:text-3xl font-bold shimmer-text transition-opacity duration-300 pointer-events-none ${isPredictorPageActive ? 'opacity-0' : 'opacity-100'}`}>
                    Mines Predictor Pro
                </h1>

                <div className="flex items-center">
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
                        <>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold shimmer-text text-center mb-8 font-['Orbitron']" style={{ textShadow: '0 0 15px rgba(255, 255, 255, 0.4)'}}>
                                Mines Predictor Pro
                            </h2>
                            <PredictorPage user={user} onUpdateUser={updateUser} />
                        </>
                    )
                )}
            </main>
        </div>
    );
};

export default App;
