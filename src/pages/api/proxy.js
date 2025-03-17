import fetch from 'node-fetch';

export default async function handler(req, res) {
    const { method, body, query } = req;

    // Separate endpoint path and query params
    const { endpoint, ...restQueries } = query;

    const url = new URL(`https://learning-faisal-217.myshopify.com/admin/api/2023-10/${endpoint}`);
    Object.keys(restQueries).forEach(key => {
        url.searchParams.append(key, restQueries[key]);
    });

    try {
        const response = await fetch(url.href, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN,
            },
            body: method !== 'GET' ? JSON.stringify(body) : undefined,
        });

        const responseText = await response.text();
        const data = JSON.parse(responseText);

        // 👉 Add CORS headers:
        res.setHeader('Access-Control-Allow-Origin', '*'); // Or set your store URL instead of '*'
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        res.status(response.status).json(data);
    } catch (error) {
        console.error('Proxy error:', error);

        // 👉 Add CORS headers even on error:
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        res.status(500).json({ error: 'Internal Server Error' });
    }
}