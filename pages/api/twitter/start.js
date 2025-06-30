export default async function handler(req, res) {
  // Add method check
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const redirect_uri = process.env.NEXT_PUBLIC_TWITTER_REDIRECT_URI;
  const client_id = process.env.TWITTER_CLIENT_ID;
  
  // Check if environment variables exist
  if (!client_id || !redirect_uri) {
    console.error('Missing environment variables:', { 
      client_id: !!client_id, 
      redirect_uri: !!redirect_uri 
    });
    return res.status(500).json({ error: 'Missing environment variables' });
  }

  const scope = "tweet.read users.read offline.access";

  // Generate a simple code challenge for PKCE
  // In production, use a proper cryptographically secure random string
  const codeChallenge = "challenge";

  const params = new URLSearchParams({
    response_type: "code",
    client_id,
    redirect_uri,
    scope,
    state: "aura-twitter-link", // This should match what you check in callback
    code_challenge: codeChallenge,
    code_challenge_method: "plain", // Use "S256" in production with proper hashing
  });

  const authUrl = `https://twitter.com/i/oauth2/authorize?${params.toString()}`;
  
  console.log('Redirecting to Twitter OAuth:', authUrl);
  
  res.redirect(authUrl);
}