import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';

interface UserData {
  id: string;
  hasFirstDeposit: boolean;
  redepositCount: number;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const dbKey = `user:${userId}`;
    const userData = await kv.get<UserData>(dbKey);

    // Check if user data exists and if they have made the first deposit.
    if (userData && userData.hasFirstDeposit) {
      // Login is successful. Send back success and the current redeposit count.
      res.status(200).json({
        success: true,
        redepositCount: userData.redepositCount || 0,
      });
    } else {
      // Login failed.
      res.status(403).json({
        success: false,
        message: "You're not registered or not deposited at least $5.",
      });
    }
  } catch (error) {
    console.error('Login verification error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}