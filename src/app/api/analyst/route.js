// app/api/analyst-reports/route.js

import { NextResponse } from 'next/server';

const API_KEY = process.env.RAPIDAPI_KEY;
const API_HOST = 'apidojo-yahoo-finance-v1.p.rapidapi.com';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const ticker = searchParams.get('ticker'); // Get the ticker from the query
    const region = searchParams.get('region') || 'US';
    const lang = searchParams.get('lang') || 'en-US';

    if (!ticker) {
        return NextResponse.json({ error: 'Ticker symbol is required' }, { status: 400 });
    }

    const url = `https://${API_HOST}/stock/get-what-analysts-are-saying?symbols=${ticker}&region=${region}&lang=${lang}`;

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': API_HOST,
        },
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching analyst reports' }, { status: 500 });
    }
}
