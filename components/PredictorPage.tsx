import React, { useState, useEffect } from 'react';
import type { User, GridCellState } from '../types';
import MineGrid from './MineGrid';

interface PredictorPageProps {
    user: User;
    onUpdateUser: (user: User) => void;
}

const GRID_SIZE = 25;
const PREDICTION_LIMIT = 15;
// IMPORTANT: Replace YOUR_CODE_HERE with your actual affiliate code.
const AFFILIATE_LINK = 'https://1waff.com/?p=YOUR_CODE_HERE';

const PredictorPage: React.FC<PredictorPageProps> = ({ user, onUpdateUser }) => {
    const [traps, setTraps] = useState<number>(3);
    const [isRevealed, setIsRevealed] = useState<boolean>(false);
    const [gridState, setGridState] = useState<GridCellState[]>(Array(GRID_SIZE).fill('hidden'));
    const [accuracy, setAccuracy] = useState<number>(0);

    const showLimitMessage = user.predictionCount >= PREDICTION_LIMIT;

    useEffect(() => {
        if (isRevealed) {
             // Simulate a random accuracy for entertainment
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

    return (
        <div className="flex flex-col items-center w-full">
            <div className="w-full max-w-lg p-6 bg-gray-800 rounded-xl shadow-lg">
                <div className="mb-4 text-center text-gray-400">
                    Player ID: <span className="font-bold text-purple-400">{user.id}</span> | Predictions used: {user.predictionCount}/{PREDICTION_LIMIT}
                </div>
                
                {/* Trap selection */}
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-center mb-2">Select Traps</h3>
                    <div className="flex justify-center space-x-2">
                        {[1, 3, 5].map(num => (
                            <button
                                key={num}
                                onClick={() => setTraps(num)}
                                disabled={isRevealed}
                                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                                    traps === num 
                                    ? 'bg-purple-600 text-white shadow-md' 
                                    : 'bg-gray-700 text-gray-300'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                </div>

                {isRevealed && (
                    <div className="my-4 p-3 bg-gray-900 rounded-lg text-center">
                        <p className="text-green-400 font-bold">Accuracy: {accuracy}%</p>
                        <p className="text-yellow-500 text-xs mt-1">Warning: Play in your limits.</p>
                    </div>
                )}

                <MineGrid gridState={gridState} />

                {showLimitMessage ? (
                    <div className="mt-6 text-center p-4 bg-yellow-900/50 border border-yellow-700 rounded-lg">
                        <p className="font-semibold text-yellow-300">You've reached your limit!</p>
                        <p className="text-yellow-400 mt-2">Please deposit again at least $4 to continue your predictions.</p>
                        <button
                            onClick={handleDepositAgain}
                            className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors"
                        >
                            Deposit Again
                        </button>
                    </div>
                ) : (
                    <div className="mt-6 flex justify-between space-x-4">
                        <button
                            onClick={handleReveal}
                            disabled={isRevealed}
                            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors disabled:bg-green-800 disabled:cursor-not-allowed"
                        >
                            Reveal
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={!isRevealed}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors disabled:bg-blue-800 disabled:cursor-not-allowed"
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
