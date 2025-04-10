export default async function handler(req, res) {
  const path = req.query.path.join('/');
  const wpUrl = `https://wp.hvyt.pl/wp-json/${path}`;

  // Explicitly handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'https://wp.hvyt.pl');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-WP-Nonce, X-HTTP-Method-Override, X-Requested-With');
    res.status(200).end();
    return;
  }

  // Proxy other requests to your WordPress backend
  const headers = {
    ...req.headers,
    host: 'wp.hvyt.pl',
  };

  const response = await fetch(wpUrl, {
    method: req.method,
    headers,
    body: ['GET', 'HEAD'].includes(req.method) ? undefined : JSON.stringify(req.body),
  });

  const responseData = await response.text();

  // Send back CORS headers on every response
  res.setHeader('Access-Control-Allow-Origin', 'https://wp.hvyt.pl');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-WP-Nonce, X-HTTP-Method-Override, X-Requested-With');

  res.status(response.status).send(responseData);
}
