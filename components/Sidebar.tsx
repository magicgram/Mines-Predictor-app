
import React from 'react';
import type { User } from '../types';
import CloseIcon from './icons/CloseIcon';
import UserIcon from './icons/UserIcon';
import GuideIcon from './icons/GuideIcon';
import TestIcon from './icons/TestIcon';
import DashboardIcon from './icons/DashboardIcon';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onShowGuide: () => void;
    onShowTestPage: () => void;
    onShowDashboard: () => void;
    user: User | null;
}

const NavLink: React.FC<{ onClick: () => void; icon: React.ReactNode; text: string }> = ({ onClick, icon, text }) => (
    <a 
        onClick={onClick} 
        className="group relative flex items-center w-full p-3 space-x-4 text-lg text-gray-300 rounded-lg hover:bg-white/10 focus:outline-none focus:bg-white/10 transition-colors duration-200 cursor-pointer overflow-hidden"
    >
        <span className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-accent-cyan to-accent-magenta transform scale-y-0 group-hover:scale-y-100 group-focus:scale-y-100 transition-transform duration-300 origin-center ease-in-out"></span>
        {icon}
        <span>{text}</span>
    </a>
);

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onShowGuide, onShowTestPage, onShowDashboard, user }) => {

    return (
        <div 
            className={`fixed inset-0 z-40 ${isOpen ? '' : 'pointer-events-none'}`}
            aria-hidden={!isOpen}
            role="dialog"
            aria-modal="true"
        >
            {/* Overlay */}
            <div 
                className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            ></div>
            
            {/* Close Button on top right of screen */}
             <button 
                onClick={onClose} 
                className={`absolute top-5 right-5 text-gray-400 hover:text-white hover:scale-110 transform transition-all duration-200 z-50 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                aria-label="Close menu"
            >
                <CloseIcon className="h-8 w-8" />
            </button>

            {/* Panel */}
            <div className={`relative flex flex-col w-80 max-w-[calc(100vw-40px)] h-full glassmorphic-card gradient-border transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                
                <div className="p-6">
                    {/* User Info */}
                    <div className="flex items-center pb-6 mt-12 space-x-4 border-b border-white/10">
                        <div className="relative p-0.5 rounded-full gradient-border">
                            <div className="w-16 h-16 rounded-full bg-bg-secondary flex items-center justify-center">
                                <UserIcon className="h-10 w-10 text-accent-cyan"/>
                            </div>
                        </div>
                        <div>
                            <p className="font-bold text-lg text-white font-['Orbitron'] tracking-wider break-all">
                                {user ? `Player ${user.id}` : 'Welcome'}
                            </p>
                            <p className="text-sm shimmer-text">Mines Predictor Pro</p>
                        </div>
                    </div>

                    {/* Nav Links */}
                    <nav className="flex-1 space-y-4 pt-6">
                        {user && (
                           <NavLink 
                                onClick={onShowDashboard}
                                icon={<DashboardIcon className="h-6 w-6 text-gray-400 group-hover:text-accent-cyan transition-colors" />}
                                text="Dashboard"
                           />
                        )}
                        <NavLink 
                            onClick={onShowTestPage}
                            icon={<TestIcon className="h-6 w-6 text-gray-400 group-hover:text-accent-cyan transition-colors" />}
                            text="Test Postback"
                        />
                        <NavLink 
                            onClick={onShowGuide}
                            icon={<GuideIcon className="h-6 w-6 text-gray-400 group-hover:text-accent-cyan transition-colors" />}
                            text="Setup Guide"
                        />
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
