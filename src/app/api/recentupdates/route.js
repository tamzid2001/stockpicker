// pages/api/recentUpdates.js

import { NextResponse } from 'next/server';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const ticker = searchParams.get('ticker');
    const region = searchParams.get('region') || 'US';
    const lang = searchParams.get('lang') || 'en-US';

    if (!ticker) {
        return NextResponse.json({ error: 'Ticker symbol is required.' }, { status: 400 });
    }

    const url = `https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/get-recent-updates?symbol=${ticker}&region=${region}&lang=${lang}`;

    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
            'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching recent updates:', error);
        return NextResponse.json({ error: 'Error fetching recent updates data. Please try again later.' }, { status: 500 });
    }
}
