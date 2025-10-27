
import React from 'react';

const BombIcon: React.FC = () => (
    <div style={{ animation: 'subtle-pulse 2s infinite' }}>
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-10 w-10 text-red-500" 
            viewBox="0 0 24 24" 
            strokeWidth="1.5" 
            stroke="currentColor" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            style={{ filter: 'drop-shadow(0 0 5px rgba(239, 68, 68, 0.7))' }}
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M11.01 3.01l.01 -.011a4.2 4.2 0 0 1 5.958 5.958l-.01 .011l-1.99 1.99a2.5 2.5 0 0 0 -.732 1.767v1.285a2.5 2.5 0 0 0 2.5 2.5h1.285a2.5 2.5 0 0 0 1.767 -.732l1.99 -1.99a4.2 4.2 0 1 1 -5.98 -5.98l-1.99 1.99a2.5 2.5 0 0 0 -.732 1.767v1.285a2.5 2.5 0 0 0 2.5 2.5h1.285a2.5 2.5 0 0 0 1.767 -.732l1.99 -1.99" />
            <path d="M12 12m-6 0a6 6 0 1 0 12 0a6 6 0 1 0 -12 0" />
        </svg>
    </div>
);

export default BombIcon;