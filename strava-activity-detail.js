export default async function handler(req, res) {
  const auth = req.headers.authorization;
  const { id } = req.query;
  if (!auth) return res.status(401).json({ error: 'Falta cabecera Authorization' });
  if (!id) return res.status(400).json({ error: 'Falta "id"' });

  try {
    const r = await fetch(`https://www.strava.com/api/v3/activities/${id}`, {
      headers: { Authorization: auth }
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json(data);
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
