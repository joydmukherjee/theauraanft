// pages/api/submit-post.js
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
    const { formData, username } = req.body

    if (!username) {
      return res.status(400).json({ 
        error: 'Username is required',
        message: 'Connect with X or Discord to submit posts!!!'
      })
    }

    if (!formData) {
      return res.status(400).json({ error: 'Form data is required' })
    }

    // Insert the post using admin client to bypass RLS
    const { data, error } = await supabaseAdmin
      .from('user_posts_to_feature_or_points')
      .insert([{
        ...formData,
        username: username, // Ensure username is included
        points_given: false,
        created_at: new Date().toISOString()
      }])
      .select(); // Return the inserted data

    if (error) {
      console.error('Error inserting post:', error);
      throw error;
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Post submitted successfully',
      data: data[0] // Return the inserted post data
    })

  } catch (error) {
    console.error('Error submitting post:', error);
    return res.status(500).json({ 
      error: 'Failed to submit post',
      details: error.message,
      message: 'Error submitting post. Please try again.'
    })
  }
}