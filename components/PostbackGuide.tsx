import React from 'react';

const Step: React.FC<{ number: number; title: string; children: React.ReactNode }> = ({ number, title, children }) => (
    <div>
        <h3 className="flex items-center text-xl font-semibold text-white mb-3">
            <span className="flex items-center justify-center w-8 h-8 mr-4 bg-accent-purple/20 text-accent-purple rounded-full font-bold">{number}</span>
            {title}
        </h3>
        <div className="pl-12 border-l-2 border-white/10 ml-4">
            <div className="prose prose-invert text-text-secondary max-w-none space-y-2">
                {children}
            </div>
        </div>
    </div>
);


const PostbackGuide: React.FC = () => {
    const postbackEndpoint = "/api/postback";
    const params = "?user_id={id}&status={status}&fdp_usd={fdp_usd}&dep_sum_usd={dep_sum_usd}";

    return (
        <div className="w-full max-w-4xl mx-auto p-8 glassmorphic-card gradient-border rounded-2xl shadow-2xl mb-8">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-2">
                    1Win Affiliate Postback Setup
                </h2>
                <p className="text-text-secondary">Connect your affiliate account for automated user verification.</p>
            </div>
            
            <div className="space-y-8">
                <Step number={1} title="Deploy to Vercel">
                    <p>First, deploy this project from your GitHub repository to Vercel. After deploying, Vercel provides a public URL (e.g., <code className="text-yellow-300 bg-black/30 px-1.5 py-0.5 rounded text-xs">your-project.vercel.app</code>). This is your base URL.</p>
                </Step>

                <Step number={2} title="Connect Vercel KV Database">
                     <p>In your Vercel project's "Storage" tab, find and create a new <strong>Vercel KV (powered by Upstash)</strong> database. Choose a region close to your users. This step is mandatory for storing user data.</p>
                </Step>
                
                <Step number={3} title="Set Environment Variables">
                    <p>
                        In your Vercel project's "Settings" → "Environment Variables", you must add your affiliate link.
                    </p>
                    <div className="mt-3 bg-black/30 p-4 rounded-lg border border-white/20">
                        <pre className="font-mono text-sm text-left">
                            <code className="text-cyan-400">VITE_AFFILIATE_LINK</code>=<code className="text-yellow-400">"https://1waff.com/?p=YOUR_CODE"</code>
                        </pre>
                        <p className="text-text-secondary text-xs mt-2">
                            This is critical. If not set, registration and deposit links will fail.
                        </p>
                    </div>
                </Step>

                <Step number={4} title="Create the Postback URL">
                    <p>In your 1Win affiliate dashboard, go to the S2S settings and use the following URL for "First Deposit" and "Repeated Deposit" events:</p>
                    <pre className="block bg-black/30 p-4 rounded-lg mt-3 text-sm text-yellow-300 break-all border border-white/20">
                        <code>
                            <span className="text-gray-400">[Your Vercel URL]</span>
                            <span className="text-cyan-400">{postbackEndpoint}</span>
                            <span className="text-purple-400">{params}</span>
                        </code>
                    </pre>
                    <p className="text-text-secondary text-xs mt-2">
                        Replace <code className="text-yellow-300 bg-black/30 px-1.5 py-0.5 rounded text-xs">{'[Your Vercel URL]'}</code> with your actual URL from Step 1.
                    </p>
                </Step>

                <Step number={5} title="How It Works">
                     <ul className="list-disc list-inside space-y-2">
                        <li>When a user deposits, 1Win sends data to your Vercel URL.</li>
                        <li>Your backend (<code className="text-yellow-300 bg-black/30 px-1.5 py-0.5 rounded text-xs">/api/postback.ts</code>) saves this data to your Vercel KV database.</li>
                        <li>The backend validates the first deposit (<code className="text-yellow-300 bg-black/30 px-1.5 py-0.5 rounded text-xs">{`{fdp_usd}`}</code>) is ≥ $5.</li>
                        <li>It also validates repeated deposits (<code className="text-yellow-300 bg-black/30 px-1.5 py-0.5 rounded text-xs">{`{dep_sum_usd}`}</code>) are ≥ $4.</li>
                        <li>The app then verifies the user's ID against the database to grant access.</li>
                    </ul>
                </Step>
            </div>
        </div>
    );
};

export default PostbackGuide;