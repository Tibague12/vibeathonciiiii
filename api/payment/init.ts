const PAIEMENTPRO_INIT_URL =
  'https://www.paiementpro.net/webservice/onlinepayment/js/initialize/initialize.php';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed' });
    return;
  }

  try {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const response = await fetch(PAIEMENTPRO_INIT_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    res.status(response.ok ? 200 : 502).json(data);
  } catch (err) {
    console.error('PaiementPro proxy error:', err);
    res.status(502).json({ success: false, error: 'Proxy error' });
  }
}
