// app/api/earnings/route.js

import { NextResponse } from 'next/server'

const API_KEY = process.env.RAPIDAPI_KEY;
const API_HOST = 'apidojo-yahoo-finance-v1.p.rapidapi.com';

export async function GET(req) {
    const { searchParams } = new URL(req.url)
    const symbol = searchParams.get('symbol')

    const url = `https://${API_HOST}/stock/get-earnings?symbol=${symbol}&region=US&lang=en-US`;
    
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': API_HOST
        }
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching earnings data' }, { status: 500 });
    }
}