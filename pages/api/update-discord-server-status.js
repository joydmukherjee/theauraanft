// pages/api/update-discord-server-status.js
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
    const { username, currentPoints = 0 } = req.body

    if (!username) {
      return res.status(400).json({ error: 'Username is required' })
    }

    const { error: updateError } = await supabaseAdmin
      .from("user_leaderboard")
      .update({
        discord_joined_server: true,
        total_points: currentPoints + 50,
        updated_at: new Date().toISOString()
      })
      .eq("username", username);

    if (updateError) throw updateError;

    const { error: transactionError } = await supabaseAdmin
      .from("point_transactions")
      .insert([{
        username: username,
        activity_type: "discord_join_server",
        points_earned: 50,
        description: "Joined Discord server",
      }]);

    if (transactionError) {
      console.error('Transaction error:', transactionError);
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Discord server status updated successfully',
      points: 50
    })

  } catch (error) {
    console.error('Error updating Discord server status:', error);
    return res.status(500).json({ 
      error: 'Failed to update Discord server status',
      details: error.message 
    })
  }
}