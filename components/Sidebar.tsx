
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

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onShowGuide, onShowTestPage, onShowDashboard, user }) => {
    
    const navLinkClasses = "flex items-center w-full p-3 space-x-4 text-lg text-gray-300 rounded-lg hover:bg-white/10 transition-colors duration-200 cursor-pointer";

    return (
        <div 
            className={`fixed inset-0 z-40 ${isOpen ? '' : 'pointer-events-none'}`}
            aria-hidden={!isOpen}
        >
            {/* Overlay */}
            <div 
                className={`absolute inset-0 bg-black/70 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            ></div>
            
            {/* Close Button on top right of screen */}
             <button 
                onClick={onClose} 
                className={`absolute top-5 right-5 text-gray-400 hover:text-white z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                aria-label="Close menu"
            >
                <CloseIcon className="h-8 w-8" />
            </button>

            {/* Panel */}
            <div className={`relative flex flex-col w-4/5 max-w-sm h-full bg-[#06123f] shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                
                <div className="pt-20 px-6">
                    {/* User Info */}
                    <div className="flex items-center pb-6 space-x-4">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-full bg-blue-900/50 flex items-center justify-center border-2 border-blue-400">
                                <UserIcon className="h-10 w-10 text-blue-300"/>
                            </div>
                        </div>
                        <div>
                            <p className="font-bold text-lg text-white">
                                {user ? `Player ${user.id}` : 'Welcome'}
                            </p>
                            <p className="text-sm text-gray-400">Mines Predictor Pro</p>
                        </div>
                    </div>

                    {/* Nav Links */}
                    <nav className="flex-1 space-y-3">
                        {user && (
                            <a onClick={onShowDashboard} className={navLinkClasses}>
                                <DashboardIcon className="h-6 w-6 text-gray-400" />
                                <span>Dashboard</span>
                            </a>
                        )}
                        <a onClick={onShowTestPage} className={navLinkClasses}>
                            <TestIcon className="h-6 w-6 text-gray-400" />
                            <span>Test Postback</span>
                        </a>
                        <a onClick={onShowGuide} className={navLinkClasses}>
                            <GuideIcon className="h-6 w-6 text-gray-400" />
                            <span>Setup Guide</span>
                        </a>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
