// pages/api/leaderboard.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    // Fetch leaderboard data with pagination
    const { data: leaderboardData, error, count } = await supabase
      .from('user_leaderboard')
      .select(`
        id,
        username,
        total_points,
        discord_connected,
        twitter_connected,
        discord_username,
        twitter_username,
        avatar_url,
        checkin_streak,
        twitter_following,
        discord_joined_server,
        walletID
      `, { count: 'exact' })
      .order('total_points', { ascending: false })
      .range(offset, offset + limitNum - 1);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch leaderboard data' 
      });
    }

    // Calculate if there are more pages
    const totalPages = Math.ceil(count / limitNum);
    const hasMore = pageNum < totalPages;

    return res.status(200).json({
      success: true,
      data: leaderboardData || [],
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalUsers: count,
        hasMore,
        limit: limitNum
      },
      hasMore // For backward compatibility with frontend
    });

  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}