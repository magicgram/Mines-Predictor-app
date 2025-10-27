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

            setResponseMessage(`Success! Server responded:\n${JSON.stringify(data, null, 2)}`);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-6 bg-gray-800 rounded-xl shadow-lg mb-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-center text-yellow-400 mb-2">Postback Testing Tool</h2>
            <p className="text-gray-400 text-center mb-6">
                Use this tool to simulate postbacks from 1Win to verify your backend is working. After a successful deposit test, try logging in with the same User ID.
            </p>

            <div className="mb-4">
                <label htmlFor="test-user-id" className="block text-sm font-medium text-gray-300 mb-2">
                    User ID to Test
                </label>
                <input
                    id="test-user-id"
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="e.g., testuser123"
                    className="w-full px-4 py-2 text-gray-200 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                    onClick={() => handleTest({ status: 'registration' })}
                    disabled={isLoading}
                    className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-800 transition-colors"
                >
                    Test Registration
                </button>
                <button
                    onClick={() => handleTest({ status: 'fdp', fdp_usd: '10' })}
                    disabled={isLoading}
                    className="px-4 py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-green-800 transition-colors"
                >
                    Test First Deposit ($10)
                </button>
                 <button
                    onClick={() => handleTest({ status: 'fdp', fdp_usd: '2' })}
                    disabled={isLoading}
                    className="px-4 py-2 font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-red-800 transition-colors"
                >
                    Test Failed Deposit ($2)
                </button>
                <button
                    onClick={() => handleTest({ status: 'dep', dep_sum_usd: '5' })}
                    disabled={isLoading}
                    className="px-4 py-2 font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:bg-purple-800 transition-colors"
                >
                    Test Re-Deposit ($5)
                </button>
            </div>

            <div className="mt-6">
                {isLoading && (
                    <div className="flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-yellow-500"></div>
                        <p className="ml-3 text-gray-300">Sending test postback...</p>
                    </div>
                )}
                {responseMessage && (
                     <pre className="p-4 bg-gray-900 text-green-300 rounded-md text-sm whitespace-pre-wrap">{responseMessage}</pre>
                )}
                {error && (
                    <pre className="p-4 bg-gray-900 text-red-400 rounded-md text-sm whitespace-pre-wrap">{`Error: ${error}`}</pre>
                )}
            </div>
        </div>
    );
};

export default TestPage;
