// pages/api/sync-discord-user.js
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
    const { discordUsername, avatarUrl, isFollowing = false, isFirstTime = false } = req.body

    if (!discordUsername) {
      return res.status(400).json({ error: 'Discord username is required' })
    }

    console.log("Syncing Discord user:", discordUsername, "Following:", isFollowing, "First time:", isFirstTime, "Avatar URL:", avatarUrl);

    if (isFirstTime) {
      // For first-time users, create new entry
      const initialPoints = isFollowing ? 100 : 50;
      
      const { error: insertError } = await supabaseAdmin
        .from("user_leaderboard")
        .insert([{
          username: discordUsername,
          discord_connected: true,
          discord_username: discordUsername,
          avatar_url: avatarUrl,
          total_points: initialPoints,
          discord_joined_server: isFollowing
        }]);

      if (insertError) {
        console.error("Insert error:", insertError);
        throw insertError;
      }

      // Add transaction records
      const transactions = [{
        username: discordUsername,
        activity_type: "discord_connect",
        points_earned: 50,
        description: "Connected discord account",
      }];

      if (isFollowing) {
        transactions.push({
          username: discordUsername,
          activity_type: "discord_join_server",
          points_earned: 50,
          description: "Joined Discord server",
        });
      }

      const { error: transactionError } = await supabaseAdmin
        .from("point_transactions")
        .insert(transactions);

      if (transactionError) {
        console.error("Transaction error:", transactionError);
      }

      return res.status(200).json({ 
        success: true, 
        message: 'Discord user synced successfully',
        points: initialPoints,
        isFirstTime: true
      })

    } else {
      // For existing users, just update follow status if needed
      // First get current points
      const { data: currentUser, error: fetchCurrentError } = await supabaseAdmin
        .from("user_leaderboard")
        .select("total_points")
        .eq("username", discordUsername)
        .single();

      if (fetchCurrentError) throw fetchCurrentError;

      const { error: updateError } = await supabaseAdmin
        .from("user_leaderboard")
        .update({
          discord_joined_server: isFollowing,
          total_points: (currentUser.total_points || 0) + 50
        })
        .eq("username", discordUsername)
        .eq("discord_joined_server", false); // Only update if not already following

      if (updateError) throw updateError;

      // Add follow transaction
      const { error: transactionError } = await supabaseAdmin
        .from("point_transactions")
        .insert([{
          username: discordUsername,
          activity_type: "discord_join_server",
          points_earned: 50,
          description: "Joined Discord server",
        }]);

      if (transactionError) {
        console.error("Transaction error:", transactionError);
      }

      return res.status(200).json({ 
        success: true, 
        message: 'Discord server join status updated',
        points: 50,
        isFirstTime: false
      })
    }

  } catch (error) {
    console.error('Error syncing Discord user:', error);
    return res.status(500).json({ 
      error: 'Failed to sync Discord user',
      details: error.message 
    })
  }
}

// This code handles the syncing of Discord user data with the Supabase database.
// It checks if the user is a first-time user or an existing user, updates their follow status, and manages their points accordingly.
// The code also handles errors and returns appropriate responses based on the success or failure of the operations