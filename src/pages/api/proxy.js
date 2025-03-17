import fetch from 'node-fetch';

export default async function handler(req, res) {
    const { method, body, headers, query } = req;

    // Define the Shopify Admin API endpoint
    const shopifyAdminUrl = `https://learning-faisal-217.myshopify.com/admin/api/2023-10/${query.endpoint}`;

    try {
        // Forward the request to Shopify Admin API
        const response = await fetch(shopifyAdminUrl, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN,
                ...headers,
            },
            body: method !== 'GET' ? JSON.stringify(body) : undefined,
        });

        // Check if the response is JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            res.status(response.status).json(data);
        } else {
            // Handle non-JSON responses (e.g., HTML errors)
            const text = await response.text();
            console.error('Non-JSON response:', text);
            res.status(response.status).json({ error: 'Non-JSON response', details: text });
        }
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}