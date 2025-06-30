// pages/api/update-twitter-connection.js
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { twitterUsername, finalUsername, currentPoints } = req.body

    if (!twitterUsername || !finalUsername) {
      return res.status(400).json({ error: 'Twitter username and final username are required' })
    }

    const { error: updateError } = await supabaseAdmin
      .from("user_leaderboard")
      .update({
        twitter_username: twitterUsername,
        twitter_connected: true,
        total_points: (currentPoints || 0) + 50,
        updated_at: new Date().toISOString()
      })
      .eq("username", finalUsername);

    if (updateError) throw updateError;

    // Add transaction
    const { error: transactionError } = await supabaseAdmin
      .from("point_transactions")
      .insert([{
        username: finalUsername,
        activity_type: "twitter_connect",
        points_earned: 50,
        description: "Connected Twitter account",
      }]);

    if (transactionError) {
      console.error('Transaction error:', transactionError);
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Twitter connection updated successfully',
      points: 50
    })

  } catch (error) {
    console.error('Error updating Twitter connection:', error);
    return res.status(500).json({ 
      error: 'Failed to update Twitter connection',
      details: error.message 
    })
  }
}