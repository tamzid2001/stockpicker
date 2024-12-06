// app/api/news/route.js

import { NextResponse } from 'next/server'

const API_KEY = process.env.RAPIDAPI_KEY;
const API_HOST = 'apidojo-yahoo-finance-v1.p.rapidapi.com';

export async function POST(req) {
    const { uuids } = await req.json();

    const url = 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/news/v2/list?region=US&snippetCount=10';
    
    const options = {
        method: 'POST',
        headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': API_HOST,
            'Content-Type': 'text/plain'
        },
        body: uuids || ''
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching news data:', error);
        return NextResponse.json({ error: 'Error fetching news data' }, { status: 500 });
    }
}