
import React from 'react';

const StarIcon: React.FC = () => (
    <div style={{ animation: 'star-shimmer 2.5s infinite' }}>
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-10 w-10" 
            viewBox="0 0 24 24" 
            strokeWidth="1.5" 
            stroke="white" 
            fill="white" 
            strokeLinecap="round" 
            strokeLinejoin="round"
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />
        </svg>
    </div>
);

export default StarIcon;
