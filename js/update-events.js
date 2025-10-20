// pages/api/update-events.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { events } = req.body;
  if (!events) return res.status(400).json({ success: false, message: "No events sent" });

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO = 'LuminationStudios/artielawnandleaf.github.io';
  const PATH = 'events.json';
  const BRANCH = 'main';

  try {
    // 1️⃣ Get SHA if file exists
    let sha;
    const fileRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${PATH}?ref=${BRANCH}`, {
      headers: { Authorization: `Bearer ${GITHUB_TOKEN}` }
    });

    if (fileRes.status === 200) {
      const fileData = await fileRes.json();
      sha = fileData.sha;
    }

    // 2️⃣ Create or update the file
    const updateRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${PATH}`, {
      method: 'PUT',
      headers: { 
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: "Update events.json from admin",
        content: Buffer.from(JSON.stringify(events, null, 2)).toString('base64'),
        sha, 
        branch: BRANCH
      })
    });

    const result = await updateRes.json();

    if (updateRes.ok) {
      return res.status(200).json({ success: true, message: "Events pushed to GitHub!", result });
    } else {
      return res.status(updateRes.status).json({ success: false, message: "Failed to push events", result });
    }

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error while pushing events' });
  }
}
