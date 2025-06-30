// pages/api/get-user-status.js
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { username, platform } = req.query // 'twitter' or 'discord'

    if (!username || !platform) {
      return res.status(400).json({ error: 'Username and platform are required' })
    }

    const usernameField = platform === 'twitter' ? 'twitter_username' : 'discord_username'
    
    const { data: existingUser, error: fetchError } = await supabaseAdmin
      .from("user_leaderboard")
      .select("*")
      .eq(usernameField, username)
      .single();

    if (fetchError && fetchError.code === 'PGRST116') {
      // User doesn't exist
      return res.status(200).json({ 
        exists: false, 
        user: null 
      })
    } else if (fetchError) {
      throw fetchError;
    }

    return res.status(200).json({ 
      exists: true, 
      user: existingUser 
    })

  } catch (error) {
    console.error('Error getting user status:', error);
    return res.status(500).json({ 
      error: 'Failed to get user status',
      details: error.message 
    })
  }
}

// This function handles GET requests to check if a user exists on the specified platform
// It retrieves the username and platform from the request parameters, queries the database,