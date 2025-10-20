// Netlify Function to receive events payload and commit data/events.json to GitHub
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  const body = JSON.parse(event.body || '{}');
  const events = body.events || [];
  // Required env vars: GITHUB_REPO (owner/repo), GITHUB_BRANCH (e.g., main), GITHUB_TOKEN (PAT with repo scope)
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';
  const token = process.env.GITHUB_TOKEN;
  if (!repo || !token) {
    return { statusCode: 500, body: 'Missing server configuration (GITHUB_REPO or GITHUB_TOKEN).' };
  }

  const path = 'data/events.json';
  const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}`;

  try {
    // get current file to obtain sha (if exists)
    const getRes = await fetch(apiUrl + `?ref=${branch}`, {
      headers: { Authorization: `token ${token}`, 'User-Agent': 'netlify-function' }
    });
    const getData = await getRes.json();
    const sha = getData && getData.sha ? getData.sha : undefined;

    const content = Buffer.from(JSON.stringify(events, null, 2)).toString('base64');

    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: { Authorization: `token ${token}`, 'User-Agent': 'netlify-function', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Update events.json via Netlify function',
        content: content,
        sha: sha,
        branch: branch
      })
    });

    const putData = await putRes.json();
    if (putRes.ok) {
      return { statusCode: 200, body: '✅ Events saved to GitHub.' };
    } else {
      return { statusCode: putRes.status, body: JSON.stringify(putData) };
    }
  } catch (err) {
    return { statusCode: 500, body: String(err) };
  }
};
