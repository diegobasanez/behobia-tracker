export default async function handler(req, res) {
  const auth = req.headers.authorization;
  const { after, before } = req.query;
  if (!auth) return res.status(401).json({ error: 'Falta cabecera Authorization' });
  if (!after || !before) return res.status(400).json({ error: 'Faltan "after"/"before" (epoch en segundos)' });

  try {
    const url = `https://www.strava.com/api/v3/athlete/activities?after=${after}&before=${before}&per_page=50`;
    const r = await fetch(url, { headers: { Authorization: auth } });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json(data);
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
