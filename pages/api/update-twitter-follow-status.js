// pages/api/update-follow-status.js
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

    // Update user's follow status
    const { error: updateError } = await supabaseAdmin
      .from("user_leaderboard")
      .update({
        twitter_following: true,
        total_points: currentPoints + 100
      })
      .eq("username", username)

    if (updateError) throw updateError

    // Add transaction record
    const { error: transactionError } = await supabaseAdmin
      .from("point_transactions")
      .insert([{
        username: username,
        activity_type: "twitter_follow",
        points_earned: 100,
        description: "Following on Twitter",
      }])

    if (transactionError) throw transactionError

    return res.status(200).json({ 
      success: true, 
      message: 'Follow status updated successfully',
      newPoints: currentPoints + 100
    })

  } catch (error) {
    console.error('Error updating follow status:', error)
    return res.status(500).json({ 
      error: 'Failed to update follow status',
      details: error.message 
    })
  }
}