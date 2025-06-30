// pages/api/create-discord-user.js
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
    const { discordUsername, finalUsername } = req.body

    if (!discordUsername || !finalUsername) {
      return res.status(400).json({ error: 'Discord username and final username are required' })
    }

    console.log('Creating user with data:', {
      username: finalUsername,
      discord_username: discordUsername,
      discord_connected: true,
      total_points: 50
    });

    const { data: insertData, error: insertError } = await supabaseAdmin
      .from("user_leaderboard")
      .insert([{
        username: finalUsername,
        discord_username: discordUsername,
        discord_connected: true,
        total_points: 50,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select();

    if (insertError) {
      console.error('Insert error details:', insertError);
      throw insertError;
    }

    // Add transaction
    const { data: transactionData, error: transactionError } = await supabaseAdmin
      .from("point_transactions")
      .insert([{
        username: finalUsername,
        activity_type: "discord_connect",
        points_earned: 50,
        description: "Connected Discord account",
      }])
      .select();

    if (transactionError) {
      console.error('Transaction error:', transactionError);
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Discord user created successfully',
      points: 50,
      user: insertData?.[0]
    })

  } catch (error) {
    console.error('Error creating Discord user:', error);
    return res.status(500).json({ 
      error: 'Failed to create Discord user',
      details: error.message 
    })
  }
}