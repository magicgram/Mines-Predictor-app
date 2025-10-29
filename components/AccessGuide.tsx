
import React, { useState } from 'react';
import CopyIcon from './icons/CopyIcon';

const Step: React.FC<{ number: number; children: React.ReactNode }> = ({ number, children }) => (
    <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 mr-2 bg-gradient-to-br from-accent-cyan to-accent-magenta text-black rounded-full font-bold text-lg">
            {number}
        </div>
        <p className="text-text-secondary text-lg mt-0.5">{children}</p>
    </div>
);

const PromoCode: React.FC = () => {
    const [copied, setCopied] = useState(false);
    const promoCode = "FSS23";

    const handleCopy = () => {
        navigator.clipboard.writeText(promoCode).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
        });
    };

    return (
        <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 mr-2 bg-gradient-to-br from-accent-cyan to-accent-magenta text-black rounded-full font-bold text-lg">
                4
            </div>
            <div className="text-text-secondary text-lg mt-0.5 flex-grow">
                <p>Use Specify Promocode during registration:</p>
                <div className="mt-2 flex items-center bg-black/40 p-2 rounded-lg border border-white/20 w-max">
                    <span className="font-mono text-xl text-yellow-300 mr-4">{promoCode}</span>
                    <button 
                        onClick={handleCopy}
                        className="p-2 rounded-md hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-cyan"
                        aria-label="Copy promocode"
                    >
                        {copied ? (
                           <span className="text-green-400 text-sm font-semibold">Copied!</span>
                        ) : (
                           <CopyIcon className="h-5 w-5 text-gray-400" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};


const AccessGuide: React.FC = () => {
    return (
        <div className="w-full max-w-2xl mx-auto p-8 glassmorphic-card gradient-border rounded-2xl shadow-2xl mb-8">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold shimmer-text mb-2">
                    How To Get Access?
                </h2>
                <p className="text-text-secondary">Follow these steps to unlock the predictor.</p>
            </div>
            
            <div className="space-y-6">
                <Step number={1}>Click on the 'Register Here' Button</Step>
                <Step number={2}>Create Your Account Using The 'Register Here' Button</Step>
                <Step number={3}>Your Account Must Be New</Step>
                <PromoCode />
            </div>

            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-white/20" />
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-bg-secondary px-4 text-sm font-semibold text-text-secondary rounded-full tracking-widest uppercase shadow-md">
                        THEN
                    </span>
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white flex items-center">
                    <span className="mr-3 text-3xl">📝</span> How to find Player ID?
                </h3>
                <Step number={1}>Login to Mostbet account</Step>
                <Step number={2}>Go to Profile Settings</Step>
                <Step number={3}>Copy Player ID number</Step>
                <Step number={4}>Paste it on Players I'd section.</Step>
            </div>
        </div>
    );
};

export default AccessGuide;
