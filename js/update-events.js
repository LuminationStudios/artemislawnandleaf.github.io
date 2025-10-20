import fetch from 'node-fetch';

export default async function handler(req, res){
  if(req.method !== 'POST') return res.status(405).end();

  const { events } = req.body;
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO = 'LuminationStudios/artielawnandleaf.github.io'; // replace
  const PATH = 'events.json';
  const BRANCH = 'main';

  try {
    // 1️⃣ Get SHA of existing file
    const fileRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${PATH}?ref=${BRANCH}`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` }
    });
    const fileData = await fileRes.json();
    const sha = fileData.sha;

    // 2️⃣ Update file
    const updateRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${PATH}`, {
      method: 'PUT',
      headers: { Authorization: `token ${GITHUB_TOKEN}` },
      body: JSON.stringify({
        message: "Update events.json from admin",
        content: Buffer.from(JSON.stringify(events,null,2)).toString('base64'),
        sha,
        branch: BRANCH
      })
    });

    const result = await updateRes.json();
    res.status(200).json(result);
  } catch(err){
    console.error(err);
    res.status(500).send('Failed to push events');
  }
}
