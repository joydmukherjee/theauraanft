export default async function handler(req, res) {
  // Add method check
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const code = req.query.code;
  const state = req.query.state;
  const error = req.query.error;

  // Check for OAuth errors
  if (error) {
    console.error('OAuth error:', error);
    return res.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/#communityv2?twitter_error=${error}`);
  }

  // Verify state parameter
  if (state !== 'aura-twitter-link') {
    return res.status(400).json({ error: 'Invalid state parameter' });
  }

  if (!code) {
    return res.status(400).json({ error: "Missing authorization code" });
  }

  const client_id = process.env.TWITTER_CLIENT_ID;
  const client_secret = process.env.TWITTER_CLIENT_SECRET;
  const redirect_uri = process.env.NEXT_PUBLIC_TWITTER_REDIRECT_URI;

  if (!client_id || !client_secret || !redirect_uri) {
    console.error('Missing environment variables:', { 
      client_id: !!client_id, 
      client_secret: !!client_secret, 
      redirect_uri: !!redirect_uri 
    });
    return res.status(500).json({ error: "Missing environment variables" });
  }

  try {
    console.log('Exchanging code for token...');
    
    // Create Basic Auth credentials
    const credentials = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
    
    // Exchange code for access token
    const tokenResponse = await fetch("https://api.twitter.com/2/oauth2/token", {
      method: "POST",
      headers: { 
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${credentials}`
      },
      body: new URLSearchParams({
        code,
        grant_type: "authorization_code",
        client_id,
        redirect_uri,
        code_verifier: "challenge", // This must match the code_challenge from start.js
      }),
    });

    const tokenData = await tokenResponse.json();
    console.log('Token response:', tokenData);

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error('Token exchange failed:', tokenData);
      return res.status(500).json({ error: "Failed to get token", detail: tokenData });
    }

    console.log('Successfully got access token, fetching user info...');

    // Fetch user info
    const userResponse = await fetch("https://api.twitter.com/2/users/me", {
      headers: {
        "Authorization": `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();
    console.log('User data:', userData);

    if (!userResponse.ok || !userData.data?.username) {
      console.error('Failed to fetch user data:', userData);
      return res.status(500).json({ error: "Failed to fetch Twitter user", detail: userData });
    }

    const username = userData.data.username;
    const userId = userData.data.id;

    console.log('Successfully authenticated user:', username);

    // Redirect back to frontend with success data
    const redirectUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/#communityv2?twitter_success=true&twitter_username=${encodeURIComponent(username)}&twitter_id=${userId}`;
    
    res.redirect(redirectUrl);

  } catch (error) {
    console.error('OAuth process error:', error);
    res.status(500).json({ error: "OAuth process failed", detail: error.message });
  }
}