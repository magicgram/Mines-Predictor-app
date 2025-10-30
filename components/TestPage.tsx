

import React, { useState } from 'react';
import { useTranslations } from '../hooks/useTranslations';

interface TestPageProps {
    onShowSetupGuide: () => void;
}

const TestPage: React.FC<TestPageProps> = ({ onShowSetupGuide }) => {
    const [userId, setUserId] = useState('testuser123');
    const [isLoading, setIsLoading] = useState(false);
    const [responseMessage, setResponseMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslations();

    const handleTest = async (params: Record<string, string>) => {
        if (!userId.trim()) {
            setError(t('testPage.errorUserId'));
            return;
        }
        setIsLoading(true);
        setResponseMessage(null);
        setError(null);

        try {
            const query = new URLSearchParams({ user_id: userId.trim(), ...params }).toString();
            const url = `/api/postback?${query}`;

            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `Request failed with status ${response.status}`);
            }

            setResponseMessage(`✅ ${t('testPage.success')} ${JSON.stringify(data, null, 2)}`);
        } catch (err: any) {
            setError(`❌ ${t('testPage.error')} ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-8 glassmorphic-card rounded-2xl shadow-2xl mb-8">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold shimmer-text mb-2">
                    {t('testPage.title')}
                </h2>
                <p className="text-text-secondary">{t('testPage.subtitle')}</p>
            </div>


            <div className="mb-6">
                <label htmlFor="test-user-id" className="block text-sm font-medium text-text-secondary mb-2">
                    {t('testPage.userIdLabel')}
                </label>
                <input
                    id="test-user-id"
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="e.g., testuser123"
                    className="form-input"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                    onClick={() => handleTest({ status: 'registration' })}
                    disabled={isLoading}
                    className="btn btn-dark"
                >
                    {t('testPage.testRegistration')}
                </button>
                <button
                    onClick={() => handleTest({ status: 'fdp', fdp_usd: '10' })}
                    disabled={isLoading}
                    className="btn btn-dark"
                >
                    {t('testPage.testFirstDeposit')}
                </button>
                 <button
                    onClick={() => handleTest({ status: 'fdp', fdp_usd: '2' })}
                    disabled={isLoading}
                    className="btn btn-dark"
                >
                    {t('testPage.testFailedDeposit')}
                </button>
                <button
                    onClick={() => handleTest({ status: 'dep', dep_sum_usd: '5' })}
                    disabled={isLoading}
                    className="btn btn-dark"
                >
                    {t('testPage.testRedeposit')}
                </button>
            </div>
            
            <div className="space-y-4 pt-6 mt-6 border-t border-white/20">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full " />
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-bg-secondary px-3 text-sm text-text-secondary rounded-full">
                            {t('testPage.needHelp')}
                        </span>
                    </div>
                </div>
                
                <button
                    onClick={onShowSetupGuide}
                    type="button"
                    className="w-full max-w-sm mx-auto btn btn-dark"
                >
                    {t('testPage.setupGuide')}
                </button>
            </div>

            <div className="mt-8 min-h-[100px] bg-black/40 p-4 rounded-lg border border-white/10 font-mono">
                {isLoading && (
                    <div className="flex items-center justify-center p-4">
                        <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-accent-cyan"></div>
                        <p className="ml-4 text-text-secondary">{t('testPage.sending')}</p>
                    </div>
                )}
                {responseMessage && (
                     <pre className="text-green-300 text-sm whitespace-pre-wrap">{responseMessage}</pre>
                )}
                {error && (
                    <pre className="text-red-300 text-sm whitespace-pre-wrap">{error}</pre>
                )}
            </div>
        </div>
    );
};

export default TestPage;
