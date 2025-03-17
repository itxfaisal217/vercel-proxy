import fetch from 'node-fetch';

export default async function handler(req, res) {
    const { method, body, query } = req;

    // Separate endpoint path and query params
    const { endpoint, ...restQueries } = query;

    const url = new URL(`https://learning-faisal-217.myshopify.com/admin/api/2023-10/${endpoint}`);

    // Add remaining query parameters (like ids)
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
        console.log('Response Status:', response.status);
        console.log('Response Text:', responseText);

        const data = JSON.parse(responseText);
        res.status(response.status).json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}