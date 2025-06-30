// pages/api/save_studio_j.js
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { formData, username } = req.body;

    if (!username) {
      return res.status(400).json({
        error: 'Username is required',
        message: 'Connect with X or Discord to submit jobs!'
      });
    }

    if (!formData) {
      return res.status(400).json({ error: 'Form data is required' });
    }

    const { data, error } = await supabaseAdmin
      .from('studio_jobs')
      .insert([
        {
          ...formData,
          username,
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error('Error inserting job:', error);
      throw error;
    }

    return res.status(200).json({
      success: true,
      message: 'Studio job submitted successfully',
      data: data[0]
    });

  } catch (error) {
    console.error('Error submitting studio job:', error);
    return res.status(500).json({
      error: 'Failed to submit studio job',
      details: error.message,
      message: 'Error submitting studio job. Please try again.'
    });
  }
}
