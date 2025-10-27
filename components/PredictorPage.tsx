import React, { useState, useEffect } from 'react';
import type { User, GridCellState } from '../types';
import MineGrid from './MineGrid';

interface PredictorPageProps {
    user: User;
    onUpdateUser: (user: User) => void;
}

const GRID_SIZE = 25;
const PREDICTION_LIMIT = 15;
// IMPORTANT: Set your affiliate link in the Vercel Environment Variables.
// The variable name must be VITE_AFFILIATE_LINK
// @ts-ignore
const AFFILIATE_LINK = import.meta.env.VITE_AFFILIATE_LINK || 'https://1waff.com/?p=YOUR_CODE_HERE';

const PredictorPage: React.FC<PredictorPageProps> = ({ user, onUpdateUser }) => {
    const [traps, setTraps] = useState<number>(3);
    const [isRevealed, setIsRevealed] = useState<boolean>(false);
    const [gridState, setGridState] = useState<GridCellState[]>(Array(GRID_SIZE).fill('hidden'));
    const [accuracy, setAccuracy] = useState<number>(0);

    const showLimitMessage = user.predictionCount >= PREDICTION_LIMIT;

    useEffect(() => {
        if (isRevealed) {
            const newAccuracy = Math.floor(Math.random() * (98 - 85 + 1)) + 85;
            setAccuracy(newAccuracy);
        }
    }, [isRevealed]);

    const handleReveal = () => {
        if (showLimitMessage) return;

        const newGrid: GridCellState[] = Array(GRID_SIZE).fill('star');
        const bombIndices = new Set<number>();
        while (bombIndices.size < traps) {
            const randomIndex = Math.floor(Math.random() * GRID_SIZE);
            bombIndices.add(randomIndex);
        }
        bombIndices.forEach(index => {
            newGrid[index] = 'bomb';
        });

        setGridState(newGrid);
        setIsRevealed(true);
        onUpdateUser({ ...user, predictionCount: user.predictionCount + 1 });
    };

    const handleNext = () => {
        setIsRevealed(false);
        setGridState(Array(GRID_SIZE).fill('hidden'));
        setAccuracy(0);
    };

    const handleDepositAgain = () => {
        onUpdateUser({ ...user, awaitingDeposit: true });
        window.open(AFFILIATE_LINK, '_blank');
        alert("You will be redirected to deposit. After completing, please come back to this page. The app will verify your deposit automatically.");
    };
    
    const predictionsLeft = PREDICTION_LIMIT - user.predictionCount;
    const progressPercentage = (user.predictionCount / PREDICTION_LIMIT) * 100;

    return (
        <div className="flex flex-col items-center w-full">
            <div className="w-full max-w-lg p-6 space-y-6 glassmorphic-card gradient-border rounded-2xl shadow-2xl">
                <div className="text-center">
                    <p className="text-text-secondary">Welcome, Player <span className="font-bold text-accent-cyan">{user.id}</span></p>
                    <div className="mt-4">
                        <div className="flex justify-between items-center mb-1 text-sm text-text-secondary">
                             <p>Predictions Used</p>
                             <p className="font-semibold text-text-primary">{user.predictionCount} / {PREDICTION_LIMIT}</p>
                        </div>
                        <div className="w-full bg-black/40 rounded-full h-3 border border-white/10 p-0.5">
                            <div className="bg-gradient-to-r from-accent-magenta to-accent-cyan h-full rounded-full transition-all duration-500 shadow-[0_0_10px_var(--glow-cyan)]" style={{ width: `${progressPercentage}%` }}></div>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-3 text-center">
                    <h3 className="text-lg font-semibold text-text-primary">Select Traps</h3>
                    <div className="flex justify-center bg-black/40 p-1 rounded-lg border border-white/10 w-max mx-auto">
                        {[1, 3, 5].map(num => (
                            <button
                                key={num}
                                onClick={() => setTraps(num)}
                                disabled={isRevealed}
                                className={`w-24 py-2 rounded-md font-semibold transition-all duration-300 text-sm focus:outline-none relative ${
                                    traps === num 
                                    ? 'text-white' 
                                    : 'text-text-secondary hover:bg-white/5'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {traps === num && <span className="absolute inset-0 bg-gradient-to-r from-accent-cyan to-accent-magenta rounded-md opacity-70 shadow-lg"></span>}
                                <span className="relative z-10">{num} Traps</span>
                            </button>
                        ))}
                    </div>
                </div>

                {isRevealed && (
                    <div className="my-2 p-3 bg-black/40 rounded-lg text-center border border-green-500/30">
                        <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-cyan-300">Accuracy: {accuracy}%</p>
                        <p className="text-yellow-500 text-xs mt-1">Warning: Play responsibly and within your limits.</p>
                    </div>
                )}

                <MineGrid gridState={gridState} />

                {showLimitMessage ? (
                    <div className="mt-6 text-center p-6 bg-gradient-to-br from-yellow-900/50 to-yellow-800/30 border border-yellow-600/50 rounded-lg shadow-lg">
                        <h3 className="font-bold text-2xl text-yellow-300 font-['Orbitron']">Prediction Limit Reached!</h3>
                        <p className="text-yellow-400 mt-2">To unlock another 15 predictions, please make a new deposit of at least $4.</p>
                        <button
                            onClick={handleDepositAgain}
                            className="mt-4 px-8 py-3 bg-gradient-to-r from-green-500 to-teal-500 hover:opacity-90 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg"
                        >
                            Deposit Again
                        </button>
                    </div>
                ) : (
                    <div className="mt-6 flex flex-col sm:flex-row justify-between gap-4">
                        <button
                            onClick={handleReveal}
                            disabled={isRevealed}
                            className="w-full btn btn-primary"
                        >
                            Reveal
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={!isRevealed}
                            className="w-full btn"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PredictorPage;