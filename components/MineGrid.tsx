
import React from 'react';
import type { GridCellState } from '../types';
import BombIcon from './icons/BombIcon';
import StarIcon from './icons/StarIcon';

interface MineGridProps {
    gridState: GridCellState[];
}

const MineGrid: React.FC<MineGridProps> = ({ gridState }) => {
    
    const getCellClasses = (state: GridCellState) => {
        const baseClasses = 'w-full h-full rounded-lg flex items-center justify-center transition-all duration-300';

        switch (state) {
            case 'star':
                // Bright yellow/orange with a subtle inner shadow to give it a "stamped" look
                return `${baseClasses} bg-gradient-to-b from-yellow-400 to-orange-400 shadow-[inset_0_3px_6px_rgba(0,0,0,0.2)]`;
            case 'bomb':
                // A simple dark cell, almost transparent to show the grid background, as seen in the image
                return `${baseClasses} bg-black/20`;
            case 'hidden':
            default:
                // The indented button look from the screenshot
                return `${baseClasses} bg-[#3d4a99] shadow-[inset_0px_4px_8px_rgba(0,0,0,0.4)] cursor-pointer hover:bg-[#4c5aaf]`;
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
                // This creates the dark, indented circle inside the hidden cells
                return <div className="w-10 h-10 bg-black/20 rounded-full shadow-[inset_0px_2px_4px_rgba(0,0,0,0.5)]"></div>;
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
