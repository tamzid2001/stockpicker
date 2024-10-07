// app/api/stock-options/route.js

import { NextResponse } from 'next/server';

const API_KEY = process.env.RAPIDAPI_KEY;
const API_HOST = 'apidojo-yahoo-finance-v1.p.rapidapi.com';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get('symbol');

    // Validate that a symbol is provided
    if (!symbol) {
        return NextResponse.json({ error: 'Stock symbol is required' }, { status: 400 });
    }

    const url = `https://${API_HOST}/stock/v3/get-options?symbol=${symbol}&region=US&lang=en-US&straddle=true`;

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': API_HOST
        }
    };

    try {
        const response = await fetch(url, options);
        
        // Check if the response is ok
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching stock options data:', error);
        return NextResponse.json({ error: 'Error fetching stock options data' }, { status: 500 });
    }
}
