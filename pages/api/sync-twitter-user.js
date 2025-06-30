// pages/api/sync-twitter-user.js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { username, isFollowing, isFirstTime, twitterUsername, twitterId, avatarUrl } = req.body

    if (!username) {
      return res.status(400).json({ error: 'Username is required' })
    }

    console.log('Syncing Twitter user:', { username, isFollowing, isFirstTime, twitterUsername, twitterId, avatarUrl })

    // Check if user exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('user_leaderboard')
      .select('*')
      .eq('username', username)
      .single()

    let pointsAwarded = 0
    let message = ''
    let transactions = []

    if (fetchError && fetchError.code === 'PGRST116') {
      // User doesn't exist - create new user
      console.log('Creating new Twitter user:', username)
      
      // Calculate points for new user
      pointsAwarded = 50 // Connection points
      transactions.push({
        username: username,
        activity_type: "twitter_connect",
        points_earned: 50,
        description: "Connected Twitter account",
      })

      if (isFollowing) {
        pointsAwarded += 100 // Follow points
        transactions.push({
          username: username,
          activity_type: "twitter_follow",
          points_earned: 100,
          description: "Following on Twitter",
        })
      }

      // Insert new user
      const { error: insertError } = await supabase
        .from('user_leaderboard')
        .insert({
          username: username,
          twitter_username: twitterUsername || username,
          twitter_id: twitterId,
          avatar_url: avatarUrl || null,
          twitter_connected: true,
          twitter_following: isFollowing || false,
          total_points: pointsAwarded,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (insertError) {
        console.error('Error creating user:', insertError)
        return res.status(500).json({ error: 'Failed to create user' })
      }

      // Insert point transactions
      const { error: transactionError } = await supabase
        .from("point_transactions")
        .insert(transactions)

      if (transactionError) {
        console.error('Error creating transactions:', transactionError)
        // Don't fail the request, just log the error
      }

      message = isFollowing 
        ? `Welcome to Aura! Thanks for following! +${pointsAwarded} Points! 🎉`
        : `Twitter Connected! +${pointsAwarded} Points! Follow us anytime for +100 more! 🐦`

    } else if (!fetchError && existingUser) {
      // User exists - handle different scenarios
      console.log('Updating existing user:', username)
      
      if (isFirstTime) {
        // First-time connection for existing user (shouldn't happen, but handle it)
        const updates = {
          updated_at: new Date().toISOString()
        }

        // Add Twitter info if not already set
        if (!existingUser.twitter_connected) {
          updates.twitter_connected = true
          updates.twitter_username = twitterUsername || username
          updates.twitter_id = twitterId
            updates.avatar_url = avatarUrl || null
          pointsAwarded += 50 // Connection points
          
          transactions.push({
            username: username,
            activity_type: "twitter_connect",
            points_earned: 50,
            description: "Connected Twitter account",
          })
        }

        // Add follow points if following and not already awarded
        if (isFollowing && !existingUser.twitter_following) {
          updates.twitter_following = true
          pointsAwarded += 100 // Follow points
          
          transactions.push({
            username: username,
            activity_type: "twitter_follow",
            points_earned: 100,
            description: "Following on Twitter",
          })
        }

        // Update total points
        if (pointsAwarded > 0) {
          updates.total_points = (existingUser.total_points || 0) + pointsAwarded
        }

        // Update user if there are changes
        if (Object.keys(updates).length > 1) { // More than just updated_at
          const { error: updateError } = await supabase
            .from('user_leaderboard')
            .update(updates)
            .eq('username', username)

          if (updateError) {
            console.error('Error updating user:', updateError)
            return res.status(500).json({ error: 'Failed to update user' })
          }
        }

        // Insert point transactions if any
        if (transactions.length > 0) {
          const { error: transactionError } = await supabase
            .from("point_transactions")
            .insert(transactions)

          if (transactionError) {
            console.error('Error creating transactions:', transactionError)
            // Don't fail the request, just log the error
          }
        }

      } else {
        // For existing users, just update follow status if needed
        if (isFollowing && !existingUser.twitter_following) {
          // Use conditional update - only update if not already following
          const { error: updateError } = await supabase
            .from("user_leaderboard")
            .update({
              twitter_following: isFollowing,
              total_points: (existingUser.total_points || 0) + 100,
              updated_at: new Date().toISOString()
            })
            .eq("username", username)
            .eq("twitter_following", false) // Only update if not already following

          if (updateError) {
            console.error('Error updating user follow status:', updateError)
            return res.status(500).json({ error: 'Failed to update user' })
          }

          pointsAwarded = 100

          // Add follow transaction
          const { error: transactionError } = await supabase
            .from("point_transactions")
            .insert([{
              username: username,
              activity_type: "twitter_follow",
              points_earned: 100,
              description: "Following on Twitter",
            }])

          if (transactionError) {
            console.error('Error creating follow transaction:', transactionError)
            // Don't fail the request, just log the error
          }
        }
      }

      // Generate appropriate message
      if (pointsAwarded === 0) {
        message = `Welcome back, ${username}! You're already connected! 🎉`
      } else if (pointsAwarded === 150) {
        message = `Welcome to Aura! Thanks for following! +${pointsAwarded} Points! 🎉`
      } else if (pointsAwarded === 100) {
        message = `Thanks for following! +${pointsAwarded} Points! 🎉`
      } else if (pointsAwarded === 50) {
        message = `Twitter Connected! +${pointsAwarded} Points! Follow us anytime for +100 more! 🐦`
      }

    } else {
      console.error('Unexpected error:', fetchError)
      return res.status(500).json({ error: 'Database error' })
    }

    res.status(200).json({
      success: true,
      pointsAwarded,
      message,
      username,
      transactions: transactions.length
    })

  } catch (error) {
    console.error('Sync Twitter user error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}