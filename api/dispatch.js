import fetch from 'node-fetch';

export default async function handler(req, res) {
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});

  const { events } = req.body;
  if(!events) return res.status(400).json({error:'Missing events'});

  const GITHUB_TOKEN = process.env.GH_PAT; // Vercel secret
  const repo = 'LuminationStudios/artemislawnandleaf'; // Replace with your repo

  try {
    const response = await fetch(`https://api.github.com/repos/${repo}/dispatches`, {
      method:'POST',
      headers:{
        'Accept':'application/vnd.github+json',
        'Authorization':`token ${GITHUB_TOKEN}`,
        'Content-Type':'application/json'
      },
      body: JSON.stringify({
        event_type:'update-events',
        client_payload:{ events: JSON.stringify(events,null,2) }
      })
    });

    if(!response.ok){
      const text = await response.text();
      return res.status(response.status).json({error:text});
    }

    res.status(200).json({message:'GitHub Action triggered!'});
  } catch(err){
    console.error(err);
    res.status(500).json({error:err.message});
  }
}
