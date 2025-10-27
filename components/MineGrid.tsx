
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
        <div className="grid grid-cols-5 gap-2 aspect-square p-2 bg-black/40 rounded-lg border border-white/10">
            {gridState.map((state, index) => (
                <div
                    key={index}
                    className={`w-full h-full rounded-md flex items-center justify-center transition-all duration-300 transform
                    ${state === 'hidden' ? 'bg-black/30 hover:bg-black/50 hover:scale-105 cursor-pointer shadow-inner shadow-black/50 hover:shadow-[inset_0_0_10px_var(--glow-cyan)]' : 'bg-white/5 scale-105'}
                    `}
                >
                    {renderCellContent(state)}
                </div>
            ))}
        </div>
    );
};

export default MineGrid;