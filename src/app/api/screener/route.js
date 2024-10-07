// app/api/screeners/route.js

import { NextResponse } from 'next/server';

const API_KEY = process.env.RAPIDAPI_KEY;
const API_HOST = 'apidojo-yahoo-finance-v1.p.rapidapi.com';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const scrIds = searchParams.get('scrIds');
    const start = searchParams.get('start') || 0;
    const count = searchParams.get('count') || 100;

    // Validate that scrIds is provided
    if (!scrIds) {
        return NextResponse.json({ error: 'scrIds parameter is required' }, { status: 400 });
    }

    const url = `https://${API_HOST}/screeners/get-symbols-by-predefined?scrIds=${scrIds}&start=${start}&count=${count}`;

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
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching screeners data:', error);
        return NextResponse.json({ error: 'Error fetching screeners data' }, { status: 500 });
    }
}
