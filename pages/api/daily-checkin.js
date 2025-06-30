// pages/api/daily-checkin.js
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
    const { username } = req.body

    if (!username) {
      return res.status(400).json({ error: 'Username is required' })
    }

    const today = new Date().toISOString().split('T')[0];

    // Check if user has already checked in today
    const { data: existingCheckin, error: checkinError } = await supabaseAdmin
      .from('daily_checkins')
      .select('*')
      .eq('username', username)
      .eq('checkin_date', today)
      .single();

    if (checkinError && checkinError.code !== 'PGRST116') {
      console.error('Error checking existing checkin:', checkinError);
      throw checkinError;
    }

    // If user already checked in today
    if (existingCheckin) {
      return res.status(200).json({ 
        alreadyCheckedIn: true,
        message: "You've already checked in today! Come back tomorrow."
      })
    }

    const pointsToAdd = 20;

    // 1. Insert daily check-in record
    const { error: insertCheckinError } = await supabaseAdmin
      .from('daily_checkins')
      .insert({
        username: username,
        checkin_date: today,
        points_earned: pointsToAdd
      });

    if (insertCheckinError) {
      console.error('Error inserting daily checkin:', insertCheckinError);
      throw insertCheckinError;
    }

    // 2. Get current user data from leaderboard
    const { data: currentUserData, error: getUserError } = await supabaseAdmin
      .from('user_leaderboard')
      .select('*')
      .eq('username', username)
      .single();

    if (getUserError) {
      console.error('Error getting user data:', getUserError);
      throw getUserError;
    }

    // 3. Calculate new streak
    const lastCheckinDate = currentUserData?.last_checkin_date;
    let newStreak = 1;
    
    if (lastCheckinDate) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (lastCheckinDate === yesterdayStr) {
        newStreak = (currentUserData.checkin_streak || 0) + 1;
      } else {
        newStreak = 1;
      }
    }

    // 4. Update user leaderboard
    const { error: updateLeaderboardError } = await supabaseAdmin
      .from('user_leaderboard')
      .update({
        total_points: (currentUserData?.total_points || 0) + pointsToAdd,
        last_checkin_date: today,
        checkin_streak: newStreak,
        updated_at: new Date().toISOString()
      })
      .eq('username', username);

    if (updateLeaderboardError) {
      console.error('Error updating leaderboard:', updateLeaderboardError);
      throw updateLeaderboardError;
    }

    // 5. Insert point transaction record
    const { error: insertTransactionError } = await supabaseAdmin
      .from('point_transactions')
      .insert({
        username: username,
        activity_type: 'daily_checkin',
        points_earned: pointsToAdd,
        description: `Daily check-in reward. Streak: ${newStreak} days`
      });

    if (insertTransactionError) {
      console.error('Error inserting point transaction:', insertTransactionError);
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Daily check-in completed successfully',
      points: pointsToAdd,
      streak: newStreak
    })

  } catch (error) {
    console.error('Error during daily checkin:', error);
    return res.status(500).json({ 
      error: 'Failed to complete daily check-in',
      details: error.message 
    })
  }
}