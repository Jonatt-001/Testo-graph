export default async function handler(req, res) {
  const { code } = req.query;
  if (!code) return res.status(400).send('No code provided');

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: `${process.env.APP_URL}/api/callback`
    })
  });
  
  const data = await tokenRes.json();
  if (data.error) return res.status(400).send(data.error);

  // Set secure, HttpOnly cookie (JavaScript cannot read this, preventing XSS)
  res.setHeader('Set-Cookie', `gh_token=${data.access_token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`);
  
  // Redirect back to your app
  res.redirect(`${process.env.APP_URL}/?login=success`);
}
