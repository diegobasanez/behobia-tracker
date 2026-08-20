export default async function handler(req, res) {
  const { action, code, refresh_token } = req.query;
  const client_id = process.env.STRAVA_CLIENT_ID;
  const client_secret = process.env.STRAVA_CLIENT_SECRET;

  if (!client_id || !client_secret) {
    return res.status(500).json({
      error: 'Faltan las variables de entorno STRAVA_CLIENT_ID / STRAVA_CLIENT_SECRET en Vercel.'
    });
  }

  let body;
  if (action === 'exchange') {
    if (!code) return res.status(400).json({ error: 'Falta "code"' });
    body = { client_id, client_secret, code, grant_type: 'authorization_code' };
  } else if (action === 'refresh') {
    if (!refresh_token) return res.status(400).json({ error: 'Falta "refresh_token"' });
    body = { client_id, client_secret, refresh_token, grant_type: 'refresh_token' };
  } else {
    return res.status(400).json({ error: 'action debe ser "exchange" o "refresh"' });
  }

  try {
    const r = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await r.json();
    if (!r.ok) {
      return res.status(r.status).json({ error: data.message || 'Error al hablar con Strava' });
    }
    res.status(200).json({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: data.expires_at
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
