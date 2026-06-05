const PAIEMENTPRO_INIT_URL =
  "https://www.paiementpro.net/webservice/onlinepayment/init/curl-init.php";

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

    let data;
    try {
      data = await response.json();
    } catch (parseError: any) {
      const text = await response.text();
      data = { success: false, error: 'Invalid response from Paiement Pro', details: text || parseError?.message };
    }

    res.status(response.ok ? 200 : 502).json(data);
  } catch (err: any) {
    console.error('PaiementPro proxy error:', err);
    res.status(502).json({ success: false, error: err?.message || 'Proxy error' });
  }
}
