import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { events } = req.body;
  if (!events) {
    return res.status(400).json({ error: 'Missing events data in request body' });
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO = 'LuminationStudios/artemislawnandleaf.github.io';
  const PATH = 'data/events.json';
  const BRANCH = 'main';
  const WORKFLOW_FILE = 'update-ics.yml'; // Only the workflow filename

  try {
    let sha = null;

    // 1️⃣ Try to get SHA of existing file
    const fileRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${PATH}?ref=${BRANCH}`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` }
    });

    if (fileRes.ok) {
      const fileData = await fileRes.json();
      sha = fileData.sha;
    } else if (fileRes.status !== 404) {
      const txt = await fileRes.text();
      return res.status(500).send('Failed to fetch current events.json: ' + txt);
    }
    // If 404, file will be created (sha remains null)

    // 2️⃣ Update or create events.json
    const updateRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${PATH}`, {
      method: 'PUT',
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: sha ? 'Update events.json from admin' : 'Create events.json from admin',
        content: Buffer.from(JSON.stringify(events, null, 2)).toString('base64'),
        sha, // null if creating new
        branch: BRANCH
      })
    });

    if (!updateRes.ok) {
      const txt = await updateRes.text();
      return res.status(500).send('Failed to update/create events.json: ' + txt);
    }

    // 3️⃣ Trigger workflow dispatch
    const dispatchRes = await fetch(`https://api.github.com/repos/${REPO}/actions/workflows/${WORKFLOW_FILE}/dispatches`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ref: BRANCH })
    });

    if (!dispatchRes.ok) {
      const txt = await dispatchRes.text();
      return res.status(500).send('Events updated but workflow dispatch failed: ' + txt);
    }

    res.status(200).json({ message: 'Events updated/created and workflow triggered!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
}
