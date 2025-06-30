// pages/api/check-twitter-follow.js

import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // Try to get session from NextAuth
    const session = await getServerSession(req, res, authOptions)
    
    // If no session from NextAuth, check if client sent session data
    const { twitter_id, twitter_username, accessToken } = req.body || {}
    
    console.log('Server session:', session)
    console.log('Client data:', { twitter_id, twitter_username, hasAccessToken: !!accessToken })
    
    // Use session data from either source
    const finalTwitterId = session?.twitter_id || twitter_id
    const finalAccessToken = session?.accessToken || accessToken
    const finalUsername = session?.twitter_username || twitter_username
    
    if (!finalTwitterId) {
      return res.status(401).json({ 
        message: 'Twitter ID not found',
        debug: {
          hasSession: !!session,
          hasClientData: !!(twitter_id || twitter_username)
        }
      })
    }

    const YOUR_TWITTER_ID = process.env.YOUR_TWITTER_ACCOUNT_ID
    
    if (!YOUR_TWITTER_ID) {
      return res.status(500).json({ message: 'Twitter account ID not configured' })
    }

    console.log('Checking follow status for:', finalTwitterId, 'following:', YOUR_TWITTER_ID)

    let isFollowing = false;
    let apiResponse;
    let method = 'none';

    // Method 1: Use the correct Twitter API v2 endpoint for checking following relationships
    if (process.env.TWITTER_BEARER_TOKEN) {
      try {
        console.log('Checking with bearer token using correct endpoint...')
        
        // Use the correct endpoint: GET /2/users/{id}/following
        // This gets the list of users that the specified user is following
        apiResponse = await fetch(
          `https://api.twitter.com/2/users/${finalTwitterId}/following?user.fields=id&max_results=1000`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
              'Content-Type': 'application/json',
            },
          }
        )
        
        console.log('Bearer token response:', apiResponse.status)
        
        if (apiResponse.ok) {
          const data = await apiResponse.json()
          console.log('Bearer token response data:', data)
          
          // Check if YOUR_TWITTER_ID is in the list of users being followed
          isFollowing = data.data?.some(user => user.id === YOUR_TWITTER_ID) || false
          method = 'bearer_following_list'
          
          console.log('Following check result:', isFollowing)
        } else {
          const errorData = await apiResponse.json()
          console.log('Bearer token error:', errorData)
        }
      } catch (error) {
        console.log('Bearer token method failed:', error.message)
      }
    }

    // Method 2: Alternative approach - check followers of your account
    if (!apiResponse?.ok && process.env.TWITTER_BEARER_TOKEN) {
      try {
        console.log('Trying reverse lookup - checking your followers...')
        
        apiResponse = await fetch(
          `https://api.twitter.com/2/users/${YOUR_TWITTER_ID}/followers?user.fields=id&max_results=1000`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
              'Content-Type': 'application/json',
            },
          }
        )
        
        console.log('Reverse lookup response:', apiResponse.status)
        
        if (apiResponse.ok) {
          const data = await apiResponse.json()
          console.log('Reverse lookup data:', data)
          
          // Check if the user's ID is in your followers list
          isFollowing = data.data?.some(follower => follower.id === finalTwitterId) || false
          method = 'reverse_followers_list'
          
          console.log('Reverse lookup result:', isFollowing)
        } else {
          const errorData = await apiResponse.json()
          console.log('Reverse lookup error:', errorData)
        }
      } catch (error) {
        console.log('Reverse lookup failed:', error.message)
      }
    }

    // Method 3: If both fail, try with user's access token (if available and has right scopes)
    if (!apiResponse?.ok && finalAccessToken) {
      try {
        console.log('Trying with user access token...')
        
        apiResponse = await fetch(
          `https://api.twitter.com/2/users/${finalTwitterId}/following?user.fields=id&max_results=1000`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${finalAccessToken}`,
              'Content-Type': 'application/json',
            },
          }
        )
        
        console.log('User token response:', apiResponse.status)
        
        if (apiResponse.ok) {
          const data = await apiResponse.json()
          console.log('User token response data:', data)
          
          isFollowing = data.data?.some(user => user.id === YOUR_TWITTER_ID) || false
          method = 'user_token_following_list'
        } else {
          const errorData = await apiResponse.json()
          console.log('User token error:', errorData)
        }
      } catch (error) {
        console.log('User token method failed:', error.message)
      }
    }

    // If all methods fail, return a graceful response
    if (!apiResponse?.ok) {
      console.log('All methods failed, returning default response')
      return res.status(200).json({ 
        isFollowing: false,
        twitter_username: finalUsername,
        twitter_id: finalTwitterId,
        error: 'Could not verify follow status',
        debug: {
          hasUserToken: !!finalAccessToken,
          hasBearerToken: !!process.env.TWITTER_BEARER_TOKEN,
          lastApiStatus: apiResponse?.status,
          method: method
        }
      })
    }

    res.status(200).json({ 
      isFollowing,
      twitter_username: finalUsername,
      twitter_id: finalTwitterId,
      debug: {
        hasUserToken: !!finalAccessToken,
        hasBearerToken: !!process.env.TWITTER_BEARER_TOKEN,
        apiResponseStatus: apiResponse?.status,
        method: method
      }
    })

  } catch (error) {
    console.error('Error checking Twitter follow:', error)
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    })
  }
}