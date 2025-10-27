import React from 'react';

const PostbackGuide: React.FC = () => {
    const postbackEndpoint = "/api/postback";
    const params = "?user_id={id}&status={status}&fdp_usd={f_d_p_usd}&dep_sum_usd={dep_sum_usd}";

    return (
        <div className="w-full max-w-4xl mx-auto p-6 bg-gray-800 rounded-xl shadow-lg mb-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-center text-purple-400 mb-4">How to Set Up Your 1Win Affiliate Postback</h2>
            <p className="text-gray-400 text-center mb-6">This guide explains how to connect your affiliate account to this app for user verification.</p>
            
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold text-white">Step 1: Deploy This Project to Vercel</h3>
                    <p className="text-gray-300 mt-1">First, push all the project code to GitHub and deploy it to Vercel. After deploying, Vercel will give you a public URL, for example: <code className="text-yellow-300">https://your-project-name.vercel.app</code>. This is your base URL.</p>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-white">Step 2: Connect Vercel KV Database</h3>
                    <p className="text-gray-300 mt-1">In your Vercel project dashboard, go to the "Storage" tab. Select "KV (New)" and connect a new database to your project. This is where user deposit information will be stored. It's a required step.</p>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-white">Step 3: Create the Postback URL</h3>
                    <p className="text-gray-300 mt-1">Your backend is now live. The postback URL is your Vercel URL plus the API endpoint path. In your 1Win affiliate dashboard, go to the Postback/S2S settings and use the following URL for events like "First Deposit" and "Repeated Deposit":</p>
                    <code className="block bg-gray-900 p-3 rounded-md mt-2 text-sm text-yellow-300 break-all">
                        {'[Your Vercel URL]'}
                        {postbackEndpoint}
                        {params}
                    </code>
                    <p className="text-gray-400 text-xs mt-2">
                        Replace <code className="text-yellow-300">{'[Your Vercel URL]'}</code> with your actual URL from Step 1. For example: <br />
                        <code className="text-yellow-300 break-all">https://your-project-name.vercel.app/api/postback?user_id=...</code>
                    </p>
                </div>
                
                <div>
                    <h3 className="text-lg font-semibold text-white">Step 4: How It Works</h3>
                    <ul className="list-disc list-inside text-gray-300 mt-2 space-y-2 text-sm">
                        <li>When a user deposits through your link, 1Win sends data to your Vercel URL.</li>
                        <li>Your backend code (<code className="text-yellow-300">/api/postback.ts</code>) saves this data to your Vercel KV database.</li>
                         <li>Your backend checks if the first deposit (<code className="text-yellow-300">{`{fdp_usd}`}</code>) is at least $5.</li>
                        <li>It also checks if repeated deposits (<code className="text-yellow-300">{`{dep_sum_usd}`}</code>) are at least $4.</li>
                        <li>When the user enters their ID in this app, the app asks your backend, which checks the database to verify them.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default PostbackGuide;
