export default function handler(req, res) {
  const token = req.cookies.gh_token;
  if (token) {
    res.status(200).json({ token });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
}
