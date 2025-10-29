
import React from 'react';
import type { GridCellState } from '../types';
import BombIcon from './icons/BombIcon';
import StarIcon from './icons/StarIcon';

interface MineGridProps {
    gridState: GridCellState[];
}

const MineGrid: React.FC<MineGridProps> = ({ gridState }) => {
    
    const getCellClasses = (state: GridCellState) => {
        const baseClasses = 'w-full h-full rounded-md flex items-center justify-center transition-all duration-300 shadow-[inset_0px_3px_6px_rgba(0,0,0,0.4)]';

        switch (state) {
            case 'star':
                return `${baseClasses} bg-gradient-to-br from-yellow-400 to-orange-500 shadow-orange-500/50 shadow-lg`;
            case 'bomb':
                return `${baseClasses} bg-gradient-to-br from-red-600 to-rose-800 shadow-rose-500/50 shadow-lg`;
            case 'hidden':
            default:
                return `${baseClasses} bg-[#3d4a99] cursor-pointer hover:bg-[#4c5aaf]`;
        }
    };

    const renderCellContent = (state: GridCellState) => {
        switch (state) {
            case 'bomb':
                return <BombIcon />;
            case 'star':
                return <StarIcon />;
            case 'hidden':
            default:
                // This creates the dark circle for hidden cells
                return <div className="w-5 h-5 bg-black/20 rounded-full shadow-[inset_0px_2px_4px_rgba(0,0,0,0.5)]"></div>;
        }
    };

    return (
        <div className="grid grid-cols-5 gap-2.5 aspect-square p-2 bg-gradient-to-b from-[#2c2263] to-[#426b9a] rounded-lg border border-white/10">
            {gridState.map((state, index) => (
                <div
                    key={index}
                    className={getCellClasses(state)}
                >
                    {renderCellContent(state)}
                </div>
            ))}
        </div>
    );
};

export default MineGrid;