import { NextResponse } from 'next/server';

const API_KEY = process.env.RAPIDAPI_KEY;
const API_HOST = 'apidojo-yahoo-finance-v1.p.rapidapi.com';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get('symbol');
    const region = searchParams.get('region') || 'US'; // Default to 'US' if region is not provided

    if (!symbol) {
        return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
    }

    const url = `https://${API_HOST}/stock/v2/get-insider-transactions?symbol=${symbol}&region=${region}`;

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': API_HOST
        }
    };

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            console.error('Error fetching insider transactions:', response.statusText);
            return NextResponse.json({ error: 'Error fetching insider transactions' }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching insider transactions:', error);
        return NextResponse.json({ error: 'Error fetching insider transactions' }, { status: 500 });
    }
}
