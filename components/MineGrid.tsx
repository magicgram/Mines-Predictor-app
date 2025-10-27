
import React from 'react';
import type { GridCellState } from '../types';
import BombIcon from './icons/BombIcon';
import StarIcon from './icons/StarIcon';

interface MineGridProps {
    gridState: GridCellState[];
}

const MineGrid: React.FC<MineGridProps> = ({ gridState }) => {
    const renderCellContent = (state: GridCellState) => {
        switch (state) {
            case 'bomb':
                return <BombIcon />;
            case 'star':
                return <StarIcon />;
            case 'hidden':
            default:
                return null;
        }
    };

    return (
        <div className="grid grid-cols-5 gap-2 aspect-square">
            {gridState.map((state, index) => (
                <div
                    key={index}
                    className={`w-full h-full rounded-md flex items-center justify-center transition-all duration-300
                    ${state === 'hidden' ? 'bg-gray-700' : 'bg-gray-600'}
                    ${state === 'bomb' ? 'animate-pulse' : ''}
                    `}
                >
                    {renderCellContent(state)}
                </div>
            ))}
        </div>
    );
};

export default MineGrid;
