import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default async function handler(req, res) {
  console.log('=== Discord OAuth Callback Started ===');
  console.log('Query params:', req.query);
  
  const code = req.query.code;

  if (!code) {
    console.log('ERROR: No OAuth code provided');
    //return res.redirect('http://localhost:3000/#communityv2?discord_error=oauth_code_missing');
    return res.redirect(`${process.env.NEXTAUTH_URL}/#community?discord_error=oauth_code_missing`);
    
  }

  try {
    console.log('Step 1: Exchanging code for access token...');
    
    // Step 1: Exchange code for access token
    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI,
        scope: 'identify',
      }),
    });

    const tokenData = await tokenRes.json();
    console.log('Token response status:', tokenRes.status);
    console.log('Token data:', tokenData);
    
    if (!tokenData.access_token) {
      console.log('ERROR: Failed to get access token');
      throw new Error('Failed to get access token');
    }

    console.log('Step 2: Getting user info from Discord...');
    
    // Step 2: Get user info from Discord
    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!userRes.ok) {
      console.log('ERROR: Failed to fetch user info, status:', userRes.status);
      throw new Error(`Failed to fetch user info: ${userRes.status}`);
    }

    const discordUser = await userRes.json();
    console.log('Discord user data:', discordUser);
    
    const discordUsername = discordUser.discriminator === '0' 
      ? discordUser.username 
      : `${discordUser.username}#${discordUser.discriminator}`;

    console.log('Final Discord username:', discordUsername);

    // Step 3: Redirect with Discord user info
    const redirectUrl = `${process.env.NEXTAUTH_URL}/#community?discord_success=true&discord_username=${encodeURIComponent(discordUsername)}&discord_id=${discordUser.id}`;
    
    console.log('Redirecting to:', redirectUrl);
    res.redirect(redirectUrl);
    
  } catch (err) {
    console.error('Discord OAuth Error:', err);
    console.error('Error details:', err.message);
    
    // Redirect with error
    res.redirect(`${process.env.NEXTAUTH_URL}/#community?discord_error=oauth_failed`);
    
  }
}