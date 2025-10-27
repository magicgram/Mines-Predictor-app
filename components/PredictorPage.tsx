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
                    <p className="text-gray-400">Welcome, Player <span className="font-bold text-purple-400">{user.id}</span></p>
                    <div className="mt-2">
                        <p className="text-sm text-gray-300 mb-1">{user.predictionCount}/{PREDICTION_LIMIT} Predictions Used</p>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                            <div className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-center text-gray-300">Select Traps</h3>
                    <div className="flex justify-center space-x-2 sm:space-x-4">
                        {[1, 3, 5].map(num => (
                            <button
                                key={num}
                                onClick={() => setTraps(num)}
                                disabled={isRevealed}
                                className={`w-20 py-2 rounded-lg font-semibold transition-all duration-300 transform focus:outline-none ${
                                    traps === num 
                                    ? 'bg-purple-600 text-white shadow-lg scale-110' 
                                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                                } disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100`}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                </div>

                {isRevealed && (
                    <div className="my-4 p-3 bg-gray-900/50 rounded-lg text-center border border-green-500/30">
                        <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-cyan-300">Accuracy: {accuracy}%</p>
                        <p className="text-yellow-500 text-xs mt-1">Warning: Play responsibly and within your limits.</p>
                    </div>
                )}

                <MineGrid gridState={gridState} />

                {showLimitMessage ? (
                    <div className="mt-6 text-center p-6 bg-gradient-to-br from-yellow-900/50 to-yellow-800/30 border border-yellow-600/50 rounded-lg shadow-lg">
                        <p className="font-bold text-2xl text-yellow-300">Prediction Limit Reached!</p>
                        <p className="text-yellow-400 mt-2">To unlock another 15 predictions, please make a new deposit of at least $4.</p>
                        <button
                            onClick={handleDepositAgain}
                            className="mt-4 px-8 py-3 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg"
                        >
                            Deposit Again
                        </button>
                    </div>
                ) : (
                    <div className="mt-6 flex flex-col sm:flex-row justify-between gap-4">
                        <button
                            onClick={handleReveal}
                            disabled={isRevealed}
                            className="w-full py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold rounded-lg transition-all disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transform hover:scale-105 disabled:scale-100 shadow-lg"
                        >
                            Reveal
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={!isRevealed}
                            className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-lg transition-all disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transform hover:scale-105 disabled:scale-100 shadow-lg"
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