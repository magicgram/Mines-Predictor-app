import React from 'react';

const PostbackGuide: React.FC = () => {
    const postbackEndpoint = "/api/postback";
    const params = "?user_id={id}&status={status}&fdp_usd={fdp_usd}&dep_sum_usd={dep_sum_usd}";

    return (
        <div className="w-full max-w-4xl mx-auto p-8 glassmorphic-card gradient-border rounded-2xl shadow-2xl mb-8">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-2">
                    1Win Affiliate Postback Setup
                </h2>
                <p className="text-gray-400">Connect your affiliate account to this app for automated user verification.</p>
            </div>
            
            <div className="space-y-8">
                <div>
                    <h3 className="text-xl font-semibold text-white mb-2 border-l-4 border-purple-500 pl-4">Step 1: Deploy to Vercel</h3>
                    <p className="text-gray-300 mt-1">First, deploy this project from your GitHub repository to Vercel. After deploying, Vercel provides a public URL (e.g., <code className="text-yellow-300 bg-black/20 px-1 rounded">your-project.vercel.app</code>). This is your base URL.</p>
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-white mb-2 border-l-4 border-purple-500 pl-4">Step 2: Connect Vercel KV Database</h3>
                    <p className="text-gray-300 mt-1">In your Vercel project's "Storage" tab, find and create a new <strong>Vercel KV (powered by Upstash)</strong> database. Choose a region close to your users. This step is mandatory for storing user data.</p>
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-white mb-2 border-l-4 border-purple-500 pl-4">Step 3: Set Environment Variables</h3>
                    <p className="text-gray-300 mt-1">
                        In your Vercel project's "Settings" → "Environment Variables", you must add your affiliate link.
                    </p>
                    <div className="mt-3 bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                        <p className="font-mono text-sm">
                            <span className="text-cyan-400">VITE_AFFILIATE_LINK</span>=<span className="text-yellow-400">"https://1waff.com/?p=YOUR_CODE"</span>
                        </p>
                        <p className="text-gray-400 text-xs mt-2">
                            This is critical. If not set, registration and deposit links will fail.
                        </p>
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-white mb-2 border-l-4 border-purple-500 pl-4">Step 4: Create the Postback URL</h3>
                    <p className="text-gray-300 mt-1">In your 1Win affiliate dashboard, go to the S2S settings and use the following URL for "First Deposit" and "Repeated Deposit" events:</p>
                    <code className="block bg-gray-900/50 p-4 rounded-lg mt-3 text-sm text-yellow-300 break-all border border-gray-700">
                        <span className="text-gray-400">[Your Vercel URL]</span>
                        <span className="text-cyan-400">{postbackEndpoint}</span>
                        <span className="text-purple-400">{params}</span>
                    </code>
                    <p className="text-gray-400 text-xs mt-2">
                        Replace <code className="text-yellow-300 bg-black/20 px-1 rounded">{'[Your Vercel URL]'}</code> with your actual URL from Step 1.
                    </p>
                </div>
                
                <div>
                    <h3 className="text-xl font-semibold text-white mb-2 border-l-4 border-purple-500 pl-4">Step 5: How It Works</h3>
                    <ul className="list-disc list-inside text-gray-300 mt-2 space-y-2 text-sm pl-2">
                        <li>When a user deposits, 1Win sends data to your Vercel URL.</li>
                        <li>Your backend (<code className="text-yellow-300 bg-black/20 px-1 rounded">/api/postback.ts</code>) saves this data to your Vercel KV database.</li>
                        <li>The backend validates the first deposit (<code className="text-yellow-300 bg-black/20 px-1 rounded">{`{fdp_usd}`}</code>) is ≥ $5.</li>
                        <li>It also validates repeated deposits (<code className="text-yellow-300 bg-black/20 px-1 rounded">{`{dep_sum_usd}`}</code>) are ≥ $4.</li>
                        <li>The app then verifies the user's ID against the database to grant access.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default PostbackGuide;