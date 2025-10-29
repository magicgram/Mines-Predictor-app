import React, { useState, useEffect, useRef } from 'react';

interface PasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

// IMPORTANT: Set your admin password in the Vercel Environment Variables.
// The variable name must be VITE_TEST_PAGE_PASSWORD
// @ts-ignore
const CORRECT_PASSWORD = import.meta.env.VITE_TEST_PAGE_PASSWORD || 'admin'; // Fallback for local dev

const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const modalRef = useRef<HTMLDivElement>(null);

    // Reset state when modal is closed
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setPassword('');
                setError('');
            }, 300); // Delay reset to allow for closing animation
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!CORRECT_PASSWORD) {
            setError('Password is not set in environment variables.');
            return;
        }
        if (password === CORRECT_PASSWORD) {
            onSuccess();
        } else {
            setError('Incorrect password. Please try again.');
            setPassword(''); // Clear input on error
        }
    };
    
    // Handle clicks outside the modal content to close it
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={handleOverlayClick}
            aria-labelledby="password-modal-title"
            role="dialog"
            aria-modal="true"
        >
            <div 
                ref={modalRef}
                className="w-full max-w-sm p-8 space-y-6 glassmorphic-card gradient-border rounded-2xl shadow-2xl main-content"
            >
                <div className="text-center">
                    <h2 id="password-modal-title" className="text-2xl font-bold text-white font-['Orbitron']">
                        Admin Access
                    </h2>
                    <p className="text-text-secondary mt-2">Enter the password to access the test page.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="password-input" className="sr-only">Password</label>
                        <input
                            id="password-input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="form-input text-center"
                            required
                            autoFocus
                        />
                    </div>

                    {error && (
                        <div className="flex items-start text-sm text-red-300">
                             <span className="text-lg text-red-400 mr-2">❌</span>
                             <p>{error}</p>
                        </div>
                    )}

                    <div className="flex gap-4 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full btn"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="w-full btn btn-primary"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PasswordModal;
