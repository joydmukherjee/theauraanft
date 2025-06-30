// pages/api/update-discord-connection.js
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
    const { discordUsername, finalUsername, currentPoints } = req.body

    if (!discordUsername || !finalUsername) {
      return res.status(400).json({ error: 'Discord username and final username are required' })
    }

    const { error: updateError } = await supabaseAdmin
      .from("user_leaderboard")
      .update({
        discord_username: discordUsername,
        discord_connected: true,
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
        activity_type: "discord_connect",
        points_earned: 50,
        description: "Connected Discord account",
      }]);

    if (transactionError) {
      console.error('Transaction error:', transactionError);
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Discord connection updated successfully',
      points: 50
    })

  } catch (error) {
    console.error('Error updating Discord connection:', error);
    return res.status(500).json({ 
      error: 'Failed to update Discord connection',
      details: error.message 
    })
  }
}