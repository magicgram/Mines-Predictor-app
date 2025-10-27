import React, { useState } from 'react';

const TestPage: React.FC = () => {
    const [userId, setUserId] = useState('testuser123');
    const [isLoading, setIsLoading] = useState(false);
    const [responseMessage, setResponseMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleTest = async (params: Record<string, string>) => {
        if (!userId.trim()) {
            setError('Please enter a User ID to test with.');
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

            setResponseMessage(`✅ Success! Server responded:\n${JSON.stringify(data, null, 2)}`);
        } catch (err: any) {
            setError(`❌ Error: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-8 glassmorphic-card gradient-border rounded-2xl shadow-2xl mb-8">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 mb-2">
                    Postback Testing Tool
                </h2>
                <p className="text-text-secondary">Simulate 1Win postbacks to verify your backend. After a deposit test, log in with the same User ID.</p>
            </div>


            <div className="mb-6">
                <label htmlFor="test-user-id" className="block text-sm font-medium text-text-secondary mb-2">
                    User ID to Test
                </label>
                <input
                    id="test-user-id"
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="e.g., testuser123"
                    className="w-full px-4 py-3 text-text-primary bg-black/30 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                    onClick={() => handleTest({ status: 'registration' })}
                    disabled={isLoading}
                    className="px-4 py-3 font-semibold text-white bg-blue-600/80 rounded-lg hover:bg-blue-600 disabled:bg-gray-700/50 transition-colors"
                >
                    Test Registration
                </button>
                <button
                    onClick={() => handleTest({ status: 'fdp', fdp_usd: '10' })}
                    disabled={isLoading}
                    className="px-4 py-3 font-semibold text-white bg-green-600/80 rounded-lg hover:bg-green-600 disabled:bg-gray-700/50 transition-colors"
                >
                    Test 1st Deposit ($10)
                </button>
                 <button
                    onClick={() => handleTest({ status: 'fdp', fdp_usd: '2' })}
                    disabled={isLoading}
                    className="px-4 py-3 font-semibold text-white bg-red-600/80 rounded-lg hover:bg-red-600 disabled:bg-gray-700/50 transition-colors"
                >
                    Test Failed Deposit ($2)
                </button>
                <button
                    onClick={() => handleTest({ status: 'dep', dep_sum_usd: '5' })}
                    disabled={isLoading}
                    className="px-4 py-3 font-semibold text-white bg-purple-600/80 rounded-lg hover:bg-purple-600 disabled:bg-gray-700/50 transition-colors"
                >
                    Test Re-Deposit ($5)
                </button>
            </div>

            <div className="mt-6 min-h-[100px] bg-black/30 p-4 rounded-lg border border-white/10">
                {isLoading && (
                    <div className="flex items-center justify-center p-4">
                        <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-yellow-500"></div>
                        <p className="ml-4 text-text-secondary">Sending test postback...</p>
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