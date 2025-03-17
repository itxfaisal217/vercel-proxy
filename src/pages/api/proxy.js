import fetch from 'node-fetch';
import https from 'https';

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
            agent: new https.Agent({ rejectUnauthorized: false }), // Disable SSL validation
        });

        // Get the response from Shopify
        const data = await response.json();

        // Send the response back to the client
        res.status(response.status).json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}