import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { events } = req.body;
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO = 'LuminationStudios/artielawnandleaf.github.io';
  const PATH = 'events.json';
  const BRANCH = 'main';
  const WORKFLOW_FILE = 'deploy.yml'; // replace with your workflow filename

  try {
    // 1️⃣ Get SHA of existing file
    const fileRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${PATH}?ref=${BRANCH}`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` }
    });
    const fileData = await fileRes.json();
    const sha = fileData.sha;

    // 2️⃣ Update events.json
    const updateRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${PATH}`, {
      method: 'PUT',
      headers: { Authorization: `token ${GITHUB_TOKEN}` },
      body: JSON.stringify({
        message: 'Update events.json from admin',
        content: Buffer.from(JSON.stringify(events, null, 2)).toString('base64'),
        sha,
        branch: BRANCH
      })
    });

    if (!updateRes.ok) {
      const txt = await updateRes.text();
      return res.status(500).send('Failed to update events.json: ' + txt);
    }

    // 3️⃣ Trigger workflow dispatch
    const dispatchRes = await fetch(`https://api.github.com/repos/${REPO}/actions/workflows/${WORKFLOW_FILE}/dispatches`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github+json'
      },
      body: JSON.stringify({ ref: BRANCH })
    });

    if (!dispatchRes.ok) {
      const txt = await dispatchRes.text();
      return res.status(500).send('Events updated but workflow dispatch failed: ' + txt);
    }

    res.status(200).json({ message: 'Events updated and workflow triggered!' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}
