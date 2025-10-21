const fetch = require('node-fetch');

module.exports = async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: `Method ${req.method} Not Allowed — POST required` });
  }

  // Parse JSON body safely
  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch (err) {
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }

  const { events } = body;
  if (!events || !Array.isArray(events)) {
    return res.status(400).json({ error: 'Missing or invalid events payload' });
  }

  const GITHUB_TOKEN = process.env.GH_PAT;
  if (!GITHUB_TOKEN) {
    return res.status(500).json({ error: 'GitHub token not set in Vercel secrets' });
  }

  const repo = 'LuminationStudios/artemislawnandleaf';

  try {
    const response = await fetch(`https://api.github.com/repos/${repo}/dispatches`, {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        event_type: 'update-events',
        client_payload: { events: JSON.stringify(events, null, 2) }
      })
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: text || 'GitHub dispatch failed' });
    }

    res.status(200).json({ message: 'GitHub Action triggered successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
